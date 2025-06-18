import { Vibrator, VIBRATOR_SCENE_SHORT_STRONG } from "@zos/sensor";

export class ToneGenerator {
  constructor() {
    this.vibration = new Vibrator();
  }

  play(freq, noise, dutyRatio, goalTime) {
    console.log(`play(${freq}, ${noise}, ${dutyRatio}, ${goalTime})`);
    this.vibration.setMode(VIBRATOR_SCENE_SHORT_STRONG);
    this.vibration.start();
  }

  stop(/*goalTime*/) {
    //console.log(`stop(${goalTime})`);
  }
}
