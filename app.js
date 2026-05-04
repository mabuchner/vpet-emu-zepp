import * as cpu from "./utils/cpu";
import { ROM } from "./utils/rom";
import { ToneGenerator } from "./utils/tone-generator";

import { readFileSync } from "@zos/fs";

App({
  globalData: {
    rom: undefined,
    cpu: undefined,
    updateInterval: undefined,
    clockCounterInterval: undefined,
    clockCounter: 0,
    clocksPerSecond: 0,
    batchSize: 0,
    msPerClock: 0,
  },
  onCreate(/*options*/) {
    console.log("app on create invoke");

    const buffer = readFileSync({ path: "assets://raw/TamagotchiP1.bin" });
    const data = new Uint8Array(buffer);
    this.globalData.rom = new ROM(data);

    const clock = 1600000;
    const toneGenerator = new ToneGenerator();
    cpu.initCPU(this.globalData.rom, clock, toneGenerator);
    this.globalData.cpu = cpu;

    // Adaptive batch size: recalculated each interval from the measured
    // per-instruction time, targeting TARGET_FRACTION of the interval period.
    // This converges in one step and automatically tracks performance changes.
    const INTERVAL_MS = 20;
    const TARGET_FRACTION = 0.8; // target 16 ms, leave 4 ms headroom
    let batchSize = 8;
    this.globalData.updateInterval = setInterval(() => {
      const startTime = Date.now();
      cpu.clockBatch(batchSize);
      this.globalData.clockCounter += batchSize;
      const elapsed = Date.now() - startTime;
      if (elapsed > 0) {
        const msPerClock = elapsed / batchSize;
        batchSize = Math.max(
          1,
          Math.floor((INTERVAL_MS * TARGET_FRACTION) / msPerClock),
        );
        this.globalData.msPerClock =
          0.9 * this.globalData.msPerClock + 0.1 * msPerClock;
      } else {
        batchSize *= 2; // batch too fast for Date.now() to measure; double until elapsed > 0
      }
      this.globalData.batchSize = batchSize;
    }, INTERVAL_MS);

    let lastReset = Date.now();
    this.globalData.clockCounterInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastReset;
      lastReset = now;
      this.globalData.clocksPerSecond =
        (this.globalData.clockCounter / elapsed) * 1000;
      this.globalData.clockCounter = 0;
    }, 1000);
  },

  onDestroy(/*options*/) {
    console.log("app on destroy invoke");
    clearInterval(this.globalData.clockCounterInterval);
    clearInterval(this.globalData.updateInterval);
  },
});
