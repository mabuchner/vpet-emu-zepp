import { CPU } from "./utils/cpu";
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
    this.globalData.cpu = new CPU(this.globalData.rom, clock, toneGenerator);

    // Adaptive batch size: adjusted each interval to keep elapsed time near 9 ms,
    // maximising clock() throughput without overrunning the 10 ms period.
    let batchSize = 8;
    this.globalData.updateInterval = setInterval(() => {
      const startTime = Date.now();
      for (let i = 0; i < batchSize; i += 1) {
        this.globalData.cpu.clock();
        this.globalData.clockCounter += 1;
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < 8) {
        batchSize += 1;
      } else if (elapsed > 10) {
        batchSize = Math.max(1, batchSize - 1);
      }
    }, 10);

    this.globalData.clockCounterInterval = setInterval(() => {
      this.globalData.clocksPerSecond = this.globalData.clockCounter;
      this.globalData.clockCounter = 0;
    }, 1000);
  },

  onDestroy(/*options*/) {
    console.log("app on destroy invoke");
    clearInterval(this.globalData.clockCounterInterval);
    clearInterval(this.globalData.updateInterval);
  },
});
