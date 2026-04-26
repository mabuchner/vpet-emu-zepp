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

    // Adaptive batch size: adjusted each interval to keep elapsed time near
    // 16 ms, maximising clock() throughput without overrunning the 20 ms
    // period.
    let batchSize = 8;
    this.globalData.updateInterval = setInterval(() => {
      const startTime = Date.now();
      cpu.clockBatch(batchSize);
      this.globalData.clockCounter += batchSize;
      const elapsed = Date.now() - startTime;
      if (elapsed < 16) {
        batchSize += 1;
      } else if (elapsed > 20) {
        batchSize = Math.max(1, batchSize - 1);
      }
    }, 20);

    let lastReset = Date.now();
    this.globalData.clockCounterInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastReset;
      lastReset = now;
      this.globalData.clocksPerSecond = (this.globalData.clockCounter / elapsed) * 1000;
      this.globalData.clockCounter = 0;
    }, 1000);
  },

  onDestroy(/*options*/) {
    console.log("app on destroy invoke");
    clearInterval(this.globalData.clockCounterInterval);
    clearInterval(this.globalData.updateInterval);
  },
});
