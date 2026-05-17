import { describe, it } from "node:test";
import assert from "node:assert/strict";

const cpu = await import("../utils/cpu.js");
const { ROM } = await import("../utils/rom.js");

const ROM_SIZE = 0x4000;
const noopToneGenerator = { play() {}, stop() {} };

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
