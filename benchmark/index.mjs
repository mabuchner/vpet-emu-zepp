import { Bench } from "tinybench";
import { RLEArrayBuilder } from "../utils/rle-array.js";
import { ROM } from "../utils/rom.js";
import { CPU } from "../utils/cpu.js";
import { DISPLAY_PIXEL_COUNT_X, packVram } from "../utils/display.js";

const noopToneGenerator = { play() {}, stop() {} };

const BENCH_OPTIONS = { time: 50, warmupTime: 10 };

// ---------------------------------------------------------------------------
// Synthetic ROM helpers
// ---------------------------------------------------------------------------

const ROM_SIZE = 0x4000; // 16 384 bytes = 8 192 × 12-bit words (13-bit PC)

/**
 * Build a synthetic ROM where every instruction at every PC is the given
 * 12-bit opcode. ROM words are stored big-endian as 2 bytes:
 *   byte[addr]   = (opcode >> 8) & 0x0f   (high nibble)
 *   byte[addr+1] = opcode & 0xff           (low byte)
 */
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

/**
 * Opcode 0x000 → _jp_s → jumps to (NPC & 0x1f00) | 0x00.
 * Since NPC starts at 0x100, this loops at PC = 0x100 forever.
 * Instruction cost: 5 emulated CPU cycles.
 */
const OPCODE_JP_LOOP = 0x000;

/**
 * Opcode 0xFFB → _nop5 → increments PC, 5 emulated cycles.
 * PC wraps within the current bank so a ROM full of 0xFFB keeps
 * executing nop5 instructions in sequence (no infinite loop).
 */
const OPCODE_NOP5 = 0xffb;

// ---------------------------------------------------------------------------
// RLEArray.at()
// Measures the instruction-dispatch table lookup used inside every clock().
// ---------------------------------------------------------------------------

{
  const noop = () => 5;
  const builder = new RLEArrayBuilder();
  for (let i = 0; i < 4096; i++) builder.push(1, noop);
  const table = builder.build();

  let idx = 0;
  const rng = new Uint16Array(4096);
  for (let i = 0; i < 4096; i++) rng[i] = (Math.random() * 4096) | 0;
  let ri = 0;

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("sequential scan (0x000–0xFFF)", () => {
      table.at(idx++ & 0xfff);
    })
    .add("random access", () => {
      table.at(rng[ri++ & 0xfff]);
    });

  await bench.run();
  console.log("\n── RLEArray.at() – instruction dispatch lookup");
  console.table(bench.table());
}

// ---------------------------------------------------------------------------
// ROM.getWord()
// Measures the instruction-fetch step (one array read per clock()).
// ---------------------------------------------------------------------------

{
  const rom = makeRom(OPCODE_JP_LOOP);

  const addrs = new Uint16Array(1024);
  for (let i = 0; i < 1024; i++) addrs[i] = ((Math.random() * 0x2000) | 0) & ~1;
  let ai = 0;

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("address 0x200 (PC = 0x100)", () => {
      rom.getWord(0x200);
    })
    .add("random address (cache pressure)", () => {
      rom.getWord(addrs[ai++ & 1023]);
    });

  await bench.run();
  console.log("\n── ROM.getWord() – instruction fetch");
  console.table(bench.table());
}

// ---------------------------------------------------------------------------
// CPU.get_mem() / CPU.set_mem()
// Three separate address ranges each take a different code path:
//   RAM   : addr < 0x300          → TypedArray read
//   VRAM  : 0xE00 ≤ addr < 0xEA0 → TypedArray read + offset
//   IO    : 0xF00 ≤ addr < 0xF7F → object property lookup + function call
// ---------------------------------------------------------------------------

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("RAM  (addr 0x000)", () => {
      cpu.get_mem(0x000);
    })
    .add("RAM  (addr 0x2ff – near limit)", () => {
      cpu.get_mem(0x2ff);
    })
    .add("VRAM (addr 0xe00 – part 1)", () => {
      cpu.get_mem(0xe00);
    })
    .add("VRAM (addr 0xe80 – part 2)", () => {
      cpu.get_mem(0xe80);
    })
    .add("IO   (addr 0xf00 – interrupt flags)", () => {
      cpu.get_mem(0xf00);
    })
    .add("IO   (addr 0xf40 – port K0)", () => {
      cpu.get_mem(0xf40);
    });

  await bench.run();
  console.log("\n── CPU.get_mem() – memory read by address type");
  console.table(bench.table());
}

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("RAM  (addr 0x000)", () => {
      cpu.set_mem(0x000, 5);
    })
    .add("VRAM (addr 0xe00 – part 1)", () => {
      cpu.set_mem(0xe00, 5);
    })
    .add("VRAM (addr 0xe80 – part 2)", () => {
      cpu.set_mem(0xe80, 5);
    })
    .add("IO   (addr 0xf76 – timer ctrl)", () => {
      cpu.set_mem(0xf76, 2);
    });

  await bench.run();
  console.log("\n── CPU.set_mem() – memory write by address type");
  console.table(bench.table());
}

// ---------------------------------------------------------------------------
// CPU.clock() end-to-end
// Measures the complete emulation step including ROM fetch, dispatch,
// instruction execution, and OSC1 timing.
// ---------------------------------------------------------------------------

{
  const cpuJp = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);
  const cpuNop = new CPU(makeRom(OPCODE_NOP5), 1_600_000, noopToneGenerator);
  const cpuBatch = new CPU(
    makeRom(OPCODE_JP_LOOP),
    1_600_000,
    noopToneGenerator,
  );

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("jp loop  (opcode 0x000, 5 cycles, no mem write)", () => {
      cpuJp.clock();
    })
    .add("nop5 loop (opcode 0xFFB, 5 cycles, PC++)", () => {
      cpuNop.clock();
    })
    .add("8× batch (mirrors app.js setInterval body)", () => {
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
      cpuBatch.clock();
    });

  await bench.run();
  console.log("\n── CPU.clock() – full emulation step");
  console.table(bench.table());
}

// ---------------------------------------------------------------------------
// Display: VRAM pixel packing
// Mirrors the inner loop of _buildDisplayUI() in index.page.js.
// Runs on every display refresh (every 50 ms, 20 fps).
// ---------------------------------------------------------------------------

{
  const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 1_600_000, noopToneGenerator);
  const displayBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);
  const prevBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);

  const bench = new Bench(BENCH_OPTIONS);
  bench
    .add("pack 32-column VRAM → displayBuf (one frame)", () => {
      packVram(cpu.get_VRAM(), displayBuf);
    })
    .add("diff-check 32-column buffer (hasDiff scan)", () => {
      let hasDiff = false;
      for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x++) {
        if (displayBuf[x] !== prevBuf[x]) {
          hasDiff = true;
          break;
        }
      }
      return hasDiff;
    });

  await bench.run();
  console.log("\n── Display VRAM pixel packing");
  console.table(bench.table());
}
