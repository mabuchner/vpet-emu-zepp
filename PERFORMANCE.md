# Performance Optimizations

Identified via the Node.js benchmark (`npm run benchmark` / `node --import ./benchmark/register.mjs ./benchmark/index.mjs`).
On-device: watch the **"batch ms"** field and **"disp ms"** field in the debug UI.

## Measurements

### CPU batch (8× clock())

| Step                     | Node.js 8× batch  | Watch batch ms   | Notes                                                                                                                                   |
| ------------------------ | ----------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline                 | 303.82 ns         | 10–12 ms         | `setInterval` period is 10 ms — already saturated                                                                                       |
| P1 – remove `try/catch`  | 296.24 ns (−2.5%) | 9–11 ms (−~1 ms) | `set_mem` IO write −16% on Node.js                                                                                                      |
| P2 – flat IO array       | 299.31 ns (~0%)   | ~10 ms stable    | IO reads −24–37% on Node.js; reduced jitter on watch (was 9–11 ms); jp-loop synthetic benchmark misses IO — real firmware benefits more |
| P3 – flat dispatch array | 292 ns median (=) | ~10 ms (=)       | No measurable gain on either platform — both engines handle the two-level lookup efficiently                                            |

Each individual `clock()` call costs ~1.25–1.5 ms on the watch vs ~49 ns on Node.js (~25 000× slower).

### Display update (50 ms interval)

| Step                             | Watch disp ms (no-op) | Watch disp ms (update) | Notes                                                                         |
| -------------------------------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| Baseline                         | ~1 ms                 | ~27 ms                 | 1 full-clear + up to 512 pixel `drawRect` native-bridge calls                 |
| P5 – cache `Uint16Array` view    | ~1 ms (=)             | ~27 ms (=)             | View creation is free (no data copy); bottleneck is `drawRect` calls          |
| P6 – column diff + RLE rendering | ~1 ms (=)             | 1–2 ms (−93%)          | Only repaints changed columns; merges pixel runs into taller `drawRect` calls |

## Checklist

- [x] **P1 – Remove `try/catch` from `set_mem`** (`utils/cpu.js:1254`)
      `set_mem` is called on every stack push/pop, CALL/RET, and memory write. A `try/catch` block
      anywhere in a function prevents V8 (and most embedded JS engines) from applying peak JIT
      optimizations to the whole function. Remove it; individual `_set_io_*` handlers can guard
      themselves if needed.

- [x] **P2 – Replace `_io_tbl` object with flat Array** (`utils/cpu.js:234`)
      IO reads are 50–75% slower than RAM reads in the benchmark (23 ns RAM vs 40 ns IO). The root
      cause is hash-map property lookup on a plain JS object. A flat `Array(127)` indexed by
      `addr - 0xF00` uses integer-indexed array access, which JS engines specialize heavily.

- [x] **P3 – Replace `RLEArray` with flat Array for instruction dispatch** (`utils/cpu.js:313`)
      `_execute.at(opcode)` does two array lookups: `_values[_indexTable[opcode]]`. A plain
      `Array(4096)` holding handler functions directly would cut that to one lookup and make the
      instruction dispatch loop more JIT-friendly. Memory cost: ~32 KB of function references.

- [x] **P4 – Fix `RLEArray.push()` temp-array allocation** (`utils/rle-array.js:10`) — obsolete: `RLEArray` is no longer used in the CPU after P3
      `this._indexTable.set(new Array(count).fill(valueIndex), this._length)` allocates a temporary
      GC-able Array on every push (construction-time only, but ~70 calls). Replace with a simple
      `for` loop over the Uint16Array directly.

- [x] **P5 – Cache `Uint16Array` view in `packVram`** (`utils/display.js:109`)
      `new Uint16Array(vram.buffer)` is called on every display refresh (20 fps). The backing
      `Uint8Array` buffer never changes, so the view can be created once and reused.

- [x] **P6 – Column-level diff + run-length rendering for the display** (`page/gt/home/index.page.js:239`)
      When the display updates, the current code issues 1 full-clear `drawRect` + up to 512
      individual pixel `drawRect` calls. On Zepp OS each `drawRect` is a native-bridge call.
      Two improvements:
  - Compare individual columns before repainting them, not just the whole 32-word buffer.
  - Within each column, draw contiguous runs of set pixels as a single taller `drawRect`
    rather than one call per pixel.
