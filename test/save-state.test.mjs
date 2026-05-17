import { describe, it } from "node:test";
import assert from "node:assert/strict";

const cpu = await import("../utils/cpu.js");
const { ROM } = await import("../utils/rom.js");

const ROM_SIZE = 0x4000;
const noopToneGenerator = { play() {}, stop() {} };

// Byte offsets within the save state buffer
const OFF_A = 5;
const OFF_B = 6;
const OFF_SP = 7;
const OFF_CF = 8;
const OFF_ZF = 9;
const OFF_DF = 10;
const OFF_IF = 11;
const OFF_HALT = 12;
const OFF_IF_DELAY = 13;
const OFF_P0_OUTPUT_DATA = 14;
const OFF_P1_OUTPUT_DATA = 15;
const OFF_P2_OUTPUT_DATA = 16;
const OFF_P3_OUTPUT_DATA = 17;
const OFF_IT = 18;
const OFF_ISW = 19;
const OFF_IPT = 20;
const OFF_ISIO = 21;
const OFF_IK0 = 22;
const OFF_IK1 = 23;
const OFF_EIT = 24;
const OFF_EISW = 25;
const OFF_EIPT = 26;
const OFF_EISIO = 27;
const OFF_EIK0 = 28;
const OFF_EIK1 = 29;
const OFF_TM = 30;
const OFF_SWL = 31;
const OFF_SWH = 32;
const OFF_PT = 33;
const OFF_RD = 34;
const OFF_SD = 35;
const OFF_K0 = 36;
const OFF_DFK0 = 37;
const OFF_K1 = 38;
const OFF_R0 = 39;
const OFF_R1 = 40;
const OFF_R2 = 41;
const OFF_R3 = 42;
const OFF_R4 = 43;
const OFF_P0 = 44;
const OFF_P1 = 45;
const OFF_P2 = 46;
const OFF_P3 = 47;
const OFF_CTRL_OSC = 48;
const OFF_CTRL_LCD = 49;
const OFF_LC = 50;
const OFF_CTRL_SVD = 51;
const OFF_CTRL_BZ1 = 52;
const OFF_CTRL_BZ2 = 53;
const OFF_CTRL_SW = 54;
const OFF_CTRL_PT = 55;
const OFF_PTC = 56;
const OFF_SC = 57;
const OFF_HZR = 58;
const OFF_IOC = 59;
const OFF_PUP = 60;
const OFF_IX = 61; // uint16 LE
const OFF_IY = 63; // uint16 LE
const OFF_PC = 65; // uint16 LE
const OFF_NPC = 67; // uint16 LE
const OFF_OSC1_COUNTER = 69; // uint32 LE
const OFF_TIMER_COUNTER = 73; // uint32 LE
const OFF_PTIMER_COUNTER = 77; // uint32 LE
const OFF_STOPWATCH_COUNTER = 81; // uint32 LE

function freshCPU() {
  cpu.initCPU(new ROM(new Uint8Array(ROM_SIZE)), 1_600_000, noopToneGenerator);
}

describe("save state", () => {
  it("saveState returns a buffer of exactly 1013 bytes", () => {
    freshCPU();
    assert.equal(cpu.saveState().byteLength, 1013);
  });

  it("round-trip preserves default register values", () => {
    freshCPU();
    const saved = cpu.saveState();

    freshCPU();
    cpu.loadState(saved.buffer);

    assert.equal(cpu.get_A(), 0);
    assert.equal(cpu.get_B(), 0);
    assert.equal(cpu.pc(), 0x100);
  });

  it("round-trip preserves modified registers and RAM", () => {
    freshCPU();
    cpu.set_A(5);
    cpu.set_B(3);
    cpu.set_mem(0x010, 7);
    cpu.set_mem(0x0e0, 9);
    const saved = cpu.saveState();

    freshCPU();
    cpu.loadState(saved.buffer);

    assert.equal(cpu.get_A(), 5);
    assert.equal(cpu.get_B(), 3);
    assert.equal(cpu.get_mem(0x010), 7);
    assert.equal(cpu.get_mem(0x0e0), 9);
  });

  it("round-trip preserves VRAM", () => {
    freshCPU();
    cpu.set_mem(0xe00, 3);
    cpu.set_mem(0xe80, 11);
    const saved = cpu.saveState();

    freshCPU();
    cpu.loadState(saved.buffer);

    assert.equal(cpu.get_mem(0xe00), 3);
    assert.equal(cpu.get_mem(0xe80), 11);
  });

  it("round-trip preserves all scalar registers, counters, and index registers", () => {
    freshCPU();
    const saved = cpu.saveState();
    const view = new DataView(saved.buffer);

    // Set all scalar register fields to distinct non-zero values.
    // CTRL_LCD is set to 0x01 (no IO_ALON/IO_ALOFF bits) so VRAM reads correctly.
    saved[OFF_A] = 0x5;
    saved[OFF_B] = 0x3;
    saved[OFF_SP] = 0x10;
    saved[OFF_CF] = 0x1;
    saved[OFF_ZF] = 0x1;
    saved[OFF_DF] = 0x1;
    saved[OFF_IF] = 0x1;
    saved[OFF_HALT] = 0x1;
    saved[OFF_IF_DELAY] = 0x1;
    saved[OFF_P0_OUTPUT_DATA] = 0x2;
    saved[OFF_P1_OUTPUT_DATA] = 0x3;
    saved[OFF_P2_OUTPUT_DATA] = 0x4;
    saved[OFF_P3_OUTPUT_DATA] = 0x5;
    saved[OFF_IT] = 0x1;
    saved[OFF_ISW] = 0x1;
    saved[OFF_IPT] = 0x1;
    saved[OFF_ISIO] = 0x1;
    saved[OFF_IK0] = 0x1;
    saved[OFF_IK1] = 0x1;
    saved[OFF_EIT] = 0x1;
    saved[OFF_EISW] = 0x1;
    saved[OFF_EIPT] = 0x1;
    saved[OFF_EISIO] = 0x1;
    saved[OFF_EIK0] = 0x1;
    saved[OFF_EIK1] = 0x1;
    saved[OFF_TM] = 0x2;
    saved[OFF_SWL] = 0x3;
    saved[OFF_SWH] = 0x4;
    saved[OFF_PT] = 0x1;
    saved[OFF_RD] = 0x2;
    saved[OFF_SD] = 0x3;
    saved[OFF_K0] = 0x4;
    saved[OFF_DFK0] = 0x5;
    saved[OFF_K1] = 0x6;
    saved[OFF_R0] = 0x1;
    saved[OFF_R1] = 0x2;
    saved[OFF_R2] = 0x3;
    saved[OFF_R3] = 0x4;
    saved[OFF_R4] = 0x5;
    saved[OFF_P0] = 0x1;
    saved[OFF_P1] = 0x2;
    saved[OFF_P2] = 0x3;
    saved[OFF_P3] = 0x4;
    saved[OFF_CTRL_OSC] = 0x1;
    saved[OFF_CTRL_LCD] = 0x1;
    saved[OFF_LC] = 0x2;
    saved[OFF_CTRL_SVD] = 0x1;
    saved[OFF_CTRL_BZ1] = 0x1;
    saved[OFF_CTRL_BZ2] = 0x1;
    saved[OFF_CTRL_SW] = 0x1;
    saved[OFF_CTRL_PT] = 0x1;
    saved[OFF_PTC] = 0x2;
    saved[OFF_SC] = 0x3;
    saved[OFF_HZR] = 0x4;
    saved[OFF_IOC] = 0x1;
    saved[OFF_PUP] = 0x1;
    view.setUint16(OFF_IX, 0x123, true);
    view.setUint16(OFF_IY, 0x456, true);
    view.setUint16(OFF_PC, 0x100, true);
    view.setUint16(OFF_NPC, 0x100, true);
    view.setUint32(OFF_OSC1_COUNTER, 99999, true);
    view.setUint32(OFF_TIMER_COUNTER, 12345, true);
    view.setUint32(OFF_PTIMER_COUNTER, 67890, true);
    view.setUint32(OFF_STOPWATCH_COUNTER, 11111, true);

    freshCPU();
    cpu.loadState(saved.buffer);

    // Verify via getters where available
    assert.equal(cpu.get_A(), 0x5);
    assert.equal(cpu.get_B(), 0x3);
    assert.equal(cpu.get_SP(), 0x10);
    assert.equal(cpu.get_IX(), 0x123);
    assert.equal(cpu.get_IY(), 0x456);
    assert.equal(cpu.pc(), 0x100);
    assert.equal(cpu.get_NPC(), 0x100);

    // Verify all bytes round-trip exactly
    const resaved = cpu.saveState();
    assert.deepEqual(resaved, saved);
  });

  it("loadState throws on invalid magic header", () => {
    freshCPU();
    const saved = cpu.saveState();
    saved[0] = 0xff;

    assert.throws(() => cpu.loadState(saved.buffer), /invalid save state file/);
  });

  it("loadState throws on version mismatch", () => {
    freshCPU();
    const saved = cpu.saveState();
    saved[4] = 0xff;

    assert.throws(
      () => cpu.loadState(saved.buffer),
      /unsupported save state version/,
    );
  });

  it("loadState throws when buffer is too short", () => {
    assert.throws(
      () => cpu.loadState(new ArrayBuffer(10)),
      /save state too short/,
    );
  });
});
