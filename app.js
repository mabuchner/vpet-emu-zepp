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
    lastBatchMs: 0,
  },
  onCreate(/*options*/) {
    console.log("app on create invoke");

    const buffer = readFileSync({ path: "assets://raw/TamagotchiP1.bin" });
    const data = new Uint8Array(buffer);
    this.globalData.rom = new ROM(data);

    const clock = 1600000;
    const toneGenerator = new ToneGenerator();
    this.globalData.cpu = new CPU(this.globalData.rom, clock, toneGenerator);

    this.globalData.updateInterval = setInterval(() => {
      const startTime = Date.now();
      for (let i = 0; i < 8; i += 1) {
        this.globalData.cpu.clock();
        this.globalData.clockCounter += 1;
      }
      this.globalData.lastBatchMs = Date.now() - startTime;
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
