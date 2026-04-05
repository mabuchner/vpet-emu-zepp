# QuickJS Performance Optimisation Log

This document records every performance optimisation attempted on the
E0C6200 CPU emulator running under QuickJS on a Zepp OS 4 smartwatch.
The primary metric is **processing time per `clock()` call** as shown by
the in-app debug overlay (lower is better). The secondary metric is the
Mac micro-benchmark (`qjs benchmark/qjs-bundle.js`, `clock()` ops/s,
higher is better).

All watch measurements are taken during live Tamagotchi P1 emulation.
Mac measurements use an esbuild IIFE bundle; because the bundler converts
ES-module `let` variables to closure `var` upvalues, some optimisations
appear neutral or negative on Mac but improve the watch (which uses native
ES modules). Watch results are the authoritative signal.

---

## Mac Benchmark

The Mac benchmark (`benchmark/qjs-bench.mjs`) exercises several subsystems
in isolation — `ROM.getWord()`, `CPU.get_mem()` / `CPU.set_mem()`, the full
`CPU.clock()` loop, and the display VRAM packing step. The `clock()` figures
are the primary comparison point and are reported throughout this document.

The benchmark uses a synthetic ROM filled with a single repeating opcode
(either a tight `JP` loop or a `NOP5`) so that the measured cost is
representative of the hot instruction-dispatch path rather than any
particular ROM workload.

**Building the bundle:**

```
npx esbuild benchmark/qjs-bench.mjs \
  --bundle --format=iife --platform=neutral \
  --outfile=benchmark/qjs-bundle.js
```

esbuild bundles the ES-module source and all its imports into a single
self-contained IIFE that QuickJS can execute without a module loader.

**Running the benchmark:**

```
qjs benchmark/qjs-bundle.js
```

`qjs` is the QuickJS command-line interpreter. The benchmark runs a 200 ms
warm-up followed by a 2 000 ms timed window for each case, calling each
function in inner batches of 100–1 000 to amortise `Date.now()` overhead.
It prints ops/s and µs/op for each case.

---

## Baseline

| Metric                | Value             |
| --------------------- | ----------------- |
| Watch processing time | ~1.3 ms / clock() |
| Mac benchmark         | ~600 k ops/s      |

The original implementation used:

- A per-opcode JavaScript function dispatch table (indirect call per instruction)
- A per-IO-address handler function table (indirect call per memory access)
- All CPU state stored as object properties (`this._PC`, `this._A`, …)
- A single `clock()` call issued by a `setInterval` in `app.js`

---

## Optimisations

### P7 — Switch-based instruction dispatch

**What changed:** Replaced the per-opcode function dispatch table with a
single `switch (opcode >> 8)` statement inside `clock()`. QuickJS compiles
dense `switch` statements into jump tables; it cannot inline or devirtualise
indirect function calls.

**Result:** Eliminated one indirect function call per instruction.
Significant reduction in per-instruction overhead.

---

### P8 — Inline ROM fetch

**What changed:** Replaced calls to `rom.getWord(pc)` (a method call plus
two array reads) with direct inline reads of `rom._data[pc * 2]` and
`rom._data[pc * 2 + 1]` inside `clock()`.

**Result:** Eliminated one method call per instruction.

---

### P9 — Switch-based IO dispatch

**What changed:** Replaced the IO handler function table used in `get_mem`
and `set_mem` with a large `switch` statement. Same reasoning as P7.

**Result:** Eliminated one indirect function call per IO register access.

---

### P10 — Inline address-mode helpers

**What changed:** The register-indirect addressing helpers
`_get_abmxmy_tbl` / `_set_abmxmy_tbl` were small functions called from
many instruction cases. Inlined them as direct register reads/writes.

**Result:** Eliminated multiple function calls inside the instruction decode
switch.

---

### P11 — Local register cache in clock() (attempted, reverted)

**What changed:** Cached the ten hottest CPU registers into local variables
at the start of `clock()`, then wrote them back at the end.

**Result:** −14 % regression. The unconditional write-back of ten registers
on every call costs more than the property-lookup savings. Reverted.

---

### P12 — TypedArray for CPU registers (attempted, reverted)

**What changed:** Stored all registers in a `Uint32Array` and accessed them
by index (`this._regs[REG_PC]`).

**Result:** −3 % regression. Every access requires two operations (object
property lookup + element read) instead of one. Reverted.

---

### clockBatch — Batch clock() calls

**What changed:** Added `CPU.clockBatch(n)` which executes `n` clock cycles
in a tight loop. `app.js` now calls `clockBatch(batchSize)` from
`setInterval` and adaptively grows `batchSize` to keep each interval close
to 9 ms.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~1.3 ms | **~0.7 ms** |

Reduced `setInterval` callback overhead per emulated cycle by amortising
it over many cycles.

---

### P13 — Module-level variables for CPU registers and state

**What changed:** All CPU state (`_PC`, `_A`, `_RAM`, `_VRAM`, all IO
registers, etc.) moved from object properties (`this._X`) to module-level
`let` variables. In QuickJS, module-level variable access is a direct
indexed slot read; object property access requires a hash-map traversal.
Getter methods added for the handful of fields accessed from outside the
module.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.7 ms | **~0.6 ms** |

Note: the Mac benchmark regressed slightly because esbuild's IIFE bundling
converts module `let` to closure `var`, which behaves differently from
native ES-module slot access. The watch (native ES modules) improved.

---

### P14 — Extract hot CPU methods to module-level functions

**What changed:** The eight most-called internal methods (`get_mem`,
`set_mem`, `_interrupt`, `_clock_OSC1`, `_process_timer`, `_process_ptimer`,
`_process_stopwatch`, `_initRegisters`) were moved from class methods to
module-level `function` declarations. Call sites updated from `this.method()`
to direct `method()` calls. The class retains thin public wrappers for
`get_mem` and `set_mem`.

**Result:** Eliminated the `this` property lookup overhead from ~233 hot
internal calls. Combined with P13 and P15 below.

---

### P15 — RAM fast-paths for get_mem / set_mem

**What changed:** Call sites where the address is always in RAM (stack
pointer, immediate nibble operands) were replaced with direct `_RAM[addr]`
reads/writes. Calls with index registers (IX, IY) used a conditional:
`_IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX)`.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.6 ms | **~0.5–0.6 ms** |

Eliminated the function-call overhead for the most common memory accesses.

---

### P16 — HALT idle-skip in clockBatch (no improvement)

**What changed:** When the CPU is halted and no interrupt is pending,
`clockBatch` now calls `_clock_OSC1()` directly in a tight inner loop
rather than going through `clock()` ~18 times per timer period.

**Result:** No measurable improvement. At ~2 000 effective clock calls/s,
the emulated CPU is time-starved and never actually reaches the HALT state
during normal Tamagotchi P1 gameplay. The optimisation is correct but
the condition is never triggered.

---

### P17 — Batch OSC1 tick handling

**What changed:** In normal mode, `clock()` previously called
`_clock_OSC1()` exactly `exec_cycles` times (typically 5–7) at the end
of every instruction. Each call incurred full function-call overhead plus
an inner `_sound.clock()` dispatch. Replaced the loop with direct counter
decrements by `exec_cycles` and a single `_sound.batch(exec_cycles)` call.
Added `Sound.batch(n)` to accumulate n ticks in one pass.

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~573 k ops/s | **~1 051 k ops/s** (+83 %) |
| Watch processing time | ~0.5–0.6 ms | **~0.2 ms** |

**Largest single gain of the entire optimisation effort.** Eliminated 10–14
function calls per instruction (5–7 calls to `_clock_OSC1()` × 2 for the
inner `_sound.clock()` dispatch inside each).

---

### P18 — Inline Sound state as module-level variables

**What changed:** The `Sound` class instance (`_sound`) was replaced by
module-level variables for all sound state (`_snd_cycle`, `_snd_one_shot`,
`_snd_envelope`, etc.) and module-level functions for sound operations.
The hot path in `clock()` no longer calls `_sound.batch()` at all. When
sound is inactive (`_snd_active = false`, which is almost always), the
per-instruction cost is a single integer increment plus one boolean check.

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~1 051 k ops/s | **~1 128 k ops/s** (+7 %) |
| Watch processing time | ~0.2 ms | **~0.1 ms** |

Eliminated one method dispatch and ~3 object property accesses per
instruction. When sound is silent the entire sound hot-path collapses to
`_snd_cycle += exec_cycles; if (false) {}`.

---

### P19 — Extract clock() to module-level \_clock()

**What changed:** The `clock()` method body (~2 200 lines) was moved to a
module-level `function _clock()`. `clockBatch` calls `_clock()` directly
instead of `this.clock()`, eliminating a property lookup on the CPU object
for every instruction. The class `clock()` method becomes a one-line wrapper.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.13 ms | ~0.13 ms (no change) |

The Mac benchmark appeared flat or slightly regressed (IIFE bundling
artefact). The watch showed no measurable gain; the property lookup
savings were smaller than expected.

---

### P20 — Pre-computed ROM opcode table; remove dead OSC1 multiply

**What changed (opcode table):** The ROM byte array was pre-processed at
startup into a `Uint16Array` of 16-bit opcodes. The per-instruction fetch
`(_ROM_data[pc*2] << 8) | _ROM_data[pc*2+1]` (one multiply, two array
reads, one shift, one OR) was replaced by `_ROM_opcodes[_PC]` (one array
read).

**What changed (dead multiply):** After P17 moved to batched counter
updates, the `exec_cycles *= _OSC1_clock_div` at the end of `clock()` only
served the return value, which `clockBatch` discards. Removed.

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~1 102 k ops/s | **~1 191 k ops/s** (+8 %) |
| Watch processing time | ~0.13 ms | **~0.11–0.12 ms** |

---

### P21 — Integer stopwatch divisor; cache ptimer-active flag

**What changed (integer stopwatch):** `STOPWATCH_CLOCK_DIV` was `32768 / 100
= 327.68` — a floating-point constant. Once `_stopwatch_counter` was reset
with this value, all future arithmetic on it used heap-allocated IEEE 754
doubles. Changed to `Math.round(32768 / 100) = 328`. QuickJS represents
small integers as tagged values (no heap allocation), making all counter
arithmetic significantly cheaper. Timing error is 0.1 %, negligible.

**What changed (ptimer flag):** `(_PTC & IO_PTC) > 1` was evaluated with a
bitwise AND and comparison on every instruction. Added `_ptimer_active`
(updated only when `_PTC` is written) so the hot-path check is a single
boolean read.

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~1 191 k ops/s | **~1 221 k ops/s** (+2.5 %) |
| Watch processing time | ~0.11–0.12 ms | **~0.11 ms** |

---

### P22 — Restructure \_clock() to reduce per-instruction bytecode count

**Three sub-changes applied together:**

1. **Remove instruction counter.** `_instr_counter += 1` fired on every
   instruction (3 QuickJS bytecodes). The debug overlay was updated to show
   `clocksPerSecond` instead, which is already maintained by `app.js`.

2. **Early-return HALT path.** Previously `clock()` opened with
   `let exec_cycles = 7` then wrapped the entire instruction decode in
   `if (!_HALT) { … }`. Restructured so a rarely-taken `if (_HALT) { … return; }`
   path handles the halted case and returns early. The common non-HALT path
   has no enclosing `if` block (2 bytecodes saved per instruction).

3. **Default exec_cycles = 5.** Since most E0C6200 instructions are 5
   cycles, initialising `exec_cycles = 5` and removing the 66 now-redundant
   `exec_cycles = 5` assignments from individual switch cases saves 1
   bytecode per 5-cycle instruction. 7-cycle and 12-cycle instruction cases
   retain their explicit assignments.

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~1 221 k ops/s | **~1 250 k ops/s** (+2.4 %) |
| Watch processing time | ~0.11 ms | **~0.10–0.11 ms** |

---

### P23 — Cache stopwatch-active and CLKCHG-active flags

**What changed (stopwatch):** `_stopwatch_counter` was decremented and
checked unconditionally every instruction (7 bytecodes), but
`_process_stopwatch()` only has any effect when `IO_SWRUN` is set (the
stopwatch is running). Added `_stopwatch_active` (updated when `_CTRL_SW`
is written). The Tamagotchi P1 never uses the stopwatch, so this skips 7
bytecodes per instruction.

**What changed (CLKCHG):** `!(_CTRL_OSC & IO_CLKCHG)` (a bitwise AND and
NOT, ~5 bytecodes) was evaluated on every instruction to select between
normal-mode and high-frequency-oscillator-mode counter updates. Added
`_clkchg_active` (updated when `_CTRL_OSC` is written) to reduce this to a
single boolean read (2 bytecodes).

**Result:**
| Metric | Before | After |
|---|---|---|
| Mac benchmark | ~1 250 k ops/s | **~1 272 k ops/s** (+1.8 %) |
| Watch processing time | ~0.10–0.11 ms | ~0.10–0.11 ms (no further change) |

### P24 — Disable ToneGenerator console.log calls

**What changed:** `ToneGenerator.play()` and `ToneGenerator.stop()` each
contained a `console.log()` call that formatted and printed a string on
every sound event. These were commented out. The method parameters were
also commented out at the call site to avoid unused-variable overhead.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.10–0.11 ms | **~0.09–0.10 ms** |

Sound events are infrequent but the string formatting cost is non-trivial
in QuickJS each time they fire.

### P25 — Remove redundant double-masks and shorten boolean ternaries

**What changed (double-masks):** 81 expressions of the form `res & 0xf & 0xf`
were simplified to `res & 0xf`. Because `x & 0xf & 0xf ≡ x & 0xf`, the
second mask is a no-op but still generates a bytecode each time.

**What changed (boolean ternaries):** 14 expressions of the form
`res > 15 ? 1 : 0` and `res < 0 ? 1 : 0` were replaced with
`(res > 15) | 0` and `(res < 0) | 0`. A comparison operator already
produces a JS boolean; coercing it to an integer with `| 0` costs one
bytecode, whereas the ternary requires four (if_false, push 1, goto,
push 0).

Also fixed in this pass: four instances of
`_ZF = res & (0xf === 0) ? 1 : 0` — an operator-precedence bug where
`===` binds tighter than `&`, causing `_ZF` to be hardcoded to 0 in the
`acpy_mx_r`, `acpy_my_r`, `scpy_mx_r`, and `scpy_my_r` instructions.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.09–0.10 ms | **~0.09–0.10 ms** (confirmed stable) |

The gain from the bytecode reductions is within measurement noise at this
level, but the correctness fix for the zero flag is significant.

### P26 — Shorten remaining boolean ternaries to bitwise-OR coercion

**What changed:** A second pass over all remaining `? 1 : 0` expressions
(42 total) that the P25 pass did not cover:

- **Comparison ternaries (13):** `xh > 15 ? 1 : 0`, `cp < 0 ? 1 : 0`,
  and three `> 0` checks in the sound/IO path replaced with `| 0`.
- **Zero-equality ternaries (28):** `(expr) === 0 ? 1 : 0` replaced with
  `!(expr) | 0`, and `word === 0 ? 1 : 0` replaced with `!word | 0`.
  The logical NOT on an integer costs one bytecode; `| 0` costs one more
  to coerce the boolean to an integer — two bytecodes total versus four
  for the ternary.
- **One non-zero equality (1):** `res === 16 ? 1 : 0` replaced with
  `(res === 16) | 0`.

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.09–0.10 ms | **~0.09–0.10 ms** (confirmed stable) |

Gains are within measurement noise at this level; the value is in the
cumulative bytecode reduction.

### P27 — Hoist IX/IY RAM guard in acpx/scpx/acpy/scpy (no measurable improvement)

**What changed:** In `acpx_mx_r`, `acpy_my_r`, `scpx_mx_r`, and
`scpy_my_r` the condition `_IX < RAM_SIZE` (or `_IY`) was evaluated twice
per instruction — once for the read of M(X)/M(Y) and once for the
write-back. The check was hoisted into a `const ixInRam` / `const iyInRam`
local variable, saving one comparison across the four cases (~12 bytecodes
total).

**Result:**
| Metric | Before | After |
|---|---|---|
| Watch processing time | ~0.09–0.10 ms | ~0.09–0.10 ms (no change) |

These instructions are used infrequently in Tamagotchi P1 code, so the
saved comparisons have no measurable effect at runtime.

---

## Summary

| Step                                                    | Watch time    | Change       |
| ------------------------------------------------------- | ------------- | ------------ |
| Baseline                                                | ~1.3 ms       | —            |
| clockBatch (batch loop)                                 | ~0.7 ms       | −46 %        |
| P13 (module-level CPU state)                            | ~0.6 ms       | −14 %        |
| P14 + P15 (module functions, RAM fast-paths)            | ~0.5–0.6 ms   | ~−10 %       |
| **P17 (batch OSC1 ticks)**                              | **~0.2 ms**   | **−60 %**    |
| **P18 (inline Sound state)**                            | **~0.1 ms**   | **−50 %**    |
| P20 (opcode table, dead multiply)                       | ~0.11–0.12 ms | −15 %        |
| P21–P23 (integer arithmetic, cached flags, restructure) | ~0.10–0.11 ms | ~−10 %       |
| P24 (disable ToneGenerator logs)                        | ~0.09–0.10 ms | ~−5 %        |
| P25 (double-mask removal, boolean ternary shortening)   | ~0.09–0.10 ms | within noise |
| P26 (remaining boolean ternary shortening, 42 cases)    | ~0.09–0.10 ms | within noise |
| P27 (hoist IX/IY RAM guard in acpx/scpx/acpy/scpy)      | ~0.09–0.10 ms | no change    |

**Total improvement: ~1.3 ms → ~0.09–0.10 ms (~13–14× faster)**

The two dominant gains were:

- **P17** — eliminating 10–14 function calls per instruction by batching
  OSC1 tick counter updates.
- **P18** — eliminating the per-instruction `_sound.batch()` method
  dispatch by moving Sound state to module-level variables.

Everything else provided smaller but cumulative gains. Several approaches
that appear effective in V8-based environments (typed-array register files,
local variable caches) did not help or actively regressed under QuickJS,
because QuickJS has no JIT and its cost model differs fundamentally from a
modern optimising engine.
