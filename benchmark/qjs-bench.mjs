/**
 * QuickJS-compatible benchmark.
 *
 * Bundled with esbuild into a single file (qjs-bundle.js) and run via:
 *   qjs benchmark/qjs-bundle.js
 *
 * No external dependencies — uses Date.now() for timing instead of tinybench.
 */
import { ROM } from "../utils/rom.js";
import { CPU } from "../utils/cpu.js";
import { DISPLAY_PIXEL_COUNT_X, packVram } from "../utils/display.js";

const noopToneGenerator = { play() {}, stop() {} };

const ROM_SIZE = 0x4000;

function makeRom(opcode) {
  const data = new Uint8Array(ROM_SIZE);
  const hi = (opcode >> 8) & 0x0f;
  const lo = opcode & 0xff;
  for (let i = 0; i < ROM_SIZE; i += 2) {
    data[i] = hi;
    data[i + 1] = lo;
  }
  return new ROM(data);
}

const OPCODE_JP_LOOP = 0x000;
const OPCODE_NOP5 = 0xffb;

// ---------------------------------------------------------------------------
// Timing harness
// Runs fn() for `timeMs` ms in batches of `batchSize` to minimise Date.now()
// overhead. Reports ops/sec and µs/op.
// ---------------------------------------------------------------------------

function bench(label, fn, timeMs = 2000, batchSize = 1000) {
  // warmup
  const warmEnd = Date.now() + 200;
  while (Date.now() < warmEnd) {
    for (let i = 0; i < batchSize; i += 1) {
      fn();
    }
  }

  // measure
  let totalCount = 0;
  const start = Date.now();
  const end = start + timeMs;
  while (Date.now() < end) {
    for (let i = 0; i < batchSize; i += 1) {
      fn();
    }
    totalCount += batchSize;
  }
  const elapsed = Date.now() - start;

  const opsPerSec = Math.round((totalCount / elapsed) * 1000);
  const usPerOp = Math.round((elapsed / totalCount) * 1e6) / 1000;
  console.log(
    "  " + label + ": " + opsPerSec + " ops/s  (" + usPerOp + " µs/op)",
  );
}

// ---------------------------------------------------------------------------
// ROM.getWord()
// ---------------------------------------------------------------------------

{
  const rom = makeRom(OPCODE_JP_LOOP);

  const addrs = new Uint16Array(1024);
  for (let i = 0; i < 1024; i += 1) {
    addrs[i] = ((Math.random() * 0x2000) | 0) & ~1;
  }
  let ai = 0;

  console.log("\n── ROM.getWord()");
  bench("fixed address 0x200", () => {
    rom.getWord(0x200);
  });
  bench("random address (cache pressure)", () => {
    rom.getWord(addrs[ai++ & 1023]);
  });
}

// ---------------------------------------------------------------------------
// CPU.get_mem() / CPU.set_mem()
// ---------------------------------------------------------------------------

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);

  console.log("\n── CPU.get_mem()");
  bench("RAM  addr 0x000", () => {
    cpu.get_mem(0x000);
  });
  bench("RAM  addr 0x2ff", () => {
    cpu.get_mem(0x2ff);
  });
  bench("VRAM addr 0xe00 (part 1)", () => {
    cpu.get_mem(0xe00);
  });
  bench("VRAM addr 0xe80 (part 2)", () => {
    cpu.get_mem(0xe80);
  });
  bench("IO   addr 0xf00 (interrupt flags)", () => {
    cpu.get_mem(0xf00);
  });
  bench("IO   addr 0xf40 (port K0)", () => {
    cpu.get_mem(0xf40);
  });
}

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);

  console.log("\n── CPU.set_mem()");
  bench("RAM  addr 0x000", () => {
    cpu.set_mem(0x000, 5);
  });
  bench("VRAM addr 0xe00 (part 1)", () => {
    cpu.set_mem(0xe00, 5);
  });
  bench("VRAM addr 0xe80 (part 2)", () => {
    cpu.set_mem(0xe80, 5);
  });
  bench("IO   addr 0xf76 (timer ctrl)", () => {
    cpu.set_mem(0xf76, 2);
  });
}

// ---------------------------------------------------------------------------
// CPU.clock() — most important: full emulation step
// Use a smaller batch here since clock() is expensive.
// ---------------------------------------------------------------------------

{
  const cpuJp = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);
  const cpuNop = new CPU(makeRom(OPCODE_NOP5), 1_600_000, noopToneGenerator);

  console.log("\n── CPU.clock()");
  bench(
    "jp loop  (opcode 0x000, 5 cycles)",
    () => {
      cpuJp.clock();
    },
    2000,
    100,
  );
  bench(
    "nop5 loop (opcode 0xFFB, 5 cycles)",
    () => {
      cpuNop.clock();
    },
    2000,
    100,
  );
}

// ---------------------------------------------------------------------------
// Display: VRAM packing
// ---------------------------------------------------------------------------

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);
  const displayBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);
  const prevBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);

  console.log("\n── Display");
  bench("packVram (32 columns)", () => {
    packVram(cpu.get_VRAM_words(), displayBuf);
  });
  bench("diff-check 32-column buffer", () => {
    let hasDiff = false;
    for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
      if (displayBuf[x] !== prevBuf[x]) {
        hasDiff = true;
        break;
      }
    }
    return hasDiff;
  });
}

console.log("\nDone.");
