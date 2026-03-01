import { createWidget, event, prop, widget } from "@zos/ui";
import { log as Logger } from "@zos/utils";
import {
  setPageBrightTime,
  pauseDropWristScreenOff,
  pausePalmScreenOff,
  setWakeUpRelaunch,
} from "@zos/display";
// import { TEXT_STYLE } from "zosLoader:./index.page.[pf].layout.js";
import { DISPLAY_PIXEL_COUNT_X, packVram } from "../../../utils/display";

const logger = Logger.getLogger("vpet-emu");

const DISPLAY_PIXEL_COUNT_Y = 16;
const DISPLAY_PIXEL_SIZE = 8;
const DISPLAY_WIDTH = DISPLAY_PIXEL_COUNT_X * DISPLAY_PIXEL_SIZE;
const DISPLAY_HEIGHT = DISPLAY_PIXEL_COUNT_Y * DISPLAY_PIXEL_SIZE;
const DISPLAY_POS_X = 120;
const DISPLAY_POS_Y = 160;

const displayBuffers = [
  new Uint16Array(DISPLAY_WIDTH),
  new Uint16Array(DISPLAY_WIDTH),
];
let displayBufferIndex = 0;

const buttons = {
  btnLeft: {
    port: "K0",
    pin: 2,
    level: 0,
  },
  btnCenter: {
    port: "K0",
    pin: 1,
    level: 0,
  },
  btnRight: {
    port: "K0",
    pin: 0,
    level: 0,
  },
};

Page({
  state: {
    stateInterval: undefined,
    displayInterval: undefined,
    lastDisplayMs: 0,
  },
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");
    setPageBrightTime({
      brightTime: 30 * 60 * 1000, // 30 minutes
    });
    pauseDropWristScreenOff({
      duration: 0,
    });
    pausePalmScreenOff({
      duration: 0,
    });
    setWakeUpRelaunch({
      relaunch: true,
    });

    this._buildDebugUI();
    this._buildDisplayUI();
    this._buildIconsUI();
    this._buildButtonsUI();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
    clearInterval(this.state.displayInterval);
    clearInterval(this.state.stateInterval);
  },
  _buildDebugUI() {
    const insText = createWidget(widget.TEXT, {
      text: "#ins 0",
      x: 140,
      y: 30,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const clockMS = createWidget(widget.TEXT, {
      text: "0ms",
      x: 280,
      y: 30,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const batchMS = createWidget(widget.TEXT, {
      text: "batch 0ms",
      x: 140,
      y: 50,
      w: 200,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const dispMS = createWidget(widget.TEXT, {
      text: "disp 0ms",
      x: 140,
      y: 70,
      w: 200,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const pcText = createWidget(widget.TEXT, {
      text: "PC 0x0000",
      x: 100,
      y: 60,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const npcText = createWidget(widget.TEXT, {
      text: "NPC 0x0000",
      x: 200,
      y: 60,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const spText = createWidget(widget.TEXT, {
      text: "SP 0x00",
      x: 300,
      y: 60,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const aText = createWidget(widget.TEXT, {
      text: "A 0x0",
      x: 390,
      y: 160,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const bText = createWidget(widget.TEXT, {
      text: "B 0x0",
      x: 390,
      y: 190,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const ixText = createWidget(widget.TEXT, {
      text: "IX 0x000",
      x: 390,
      y: 220,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    const iyText = createWidget(widget.TEXT, {
      text: "IY 0x000",
      x: 390,
      y: 250,
      w: 100,
      h: 20,
      color: 0xdddd00,
      text_size: 15,
    });

    this.state.sateInterval = setInterval(() => {
      const app = getApp();
      const cpu = app._options.globalData.cpu;
      clockMS.setProperty(
        prop.TEXT,
        `${(1000 / app._options.globalData.clocksPerSecond).toFixed(1)}ms`,
      );
      batchMS.setProperty(
        prop.TEXT,
        `batch ${app._options.globalData.lastBatchMs}ms`,
      );
      dispMS.setProperty(prop.TEXT, `disp ${this.state.lastDisplayMs}ms`);
      insText.setProperty(prop.TEXT, `#ins ${cpu.istr_counter()}`);
      pcText.setProperty(
        prop.TEXT,
        `PC 0x${cpu.pc().toString(16).padStart(4, "0")}`,
      );
      npcText.setProperty(
        prop.TEXT,
        `NPC 0x${cpu._NPC.toString(16).padStart(4, "0")}`,
      );
      spText.setProperty(
        prop.TEXT,
        `SP 0x${cpu._SP.toString(16).padStart(2, "0")}`,
      );
      aText.setProperty(
        prop.TEXT,
        `A 0x${cpu._A.toString(16).padStart(1, "0")}`,
      );
      bText.setProperty(
        prop.TEXT,
        `B 0x${cpu._B.toString(16).padStart(1, "0")}`,
      );
      ixText.setProperty(
        prop.TEXT,
        `IX 0x${cpu._IX.toString(16).padStart(3, "0")}`,
      );
      iyText.setProperty(
        prop.TEXT,
        `IY 0x${cpu._IY.toString(16).padStart(3, "0")}`,
      );
    }, 1000);
  },
  _buildDisplayUI() {
    const canvas = createWidget(widget.CANVAS, {
      x: DISPLAY_POS_X,
      y: DISPLAY_POS_Y,
      w: DISPLAY_WIDTH,
      h: DISPLAY_HEIGHT,
    });
    canvas.drawRect({
      x1: 0,
      y1: 0,
      x2: DISPLAY_WIDTH,
      y2: DISPLAY_HEIGHT,
      color: 0x999999,
    });

    this.state.displayInterval = setInterval(() => {
      const startTime = Date.now();
      const app = getApp();
      const cpu = app._options.globalData.cpu;

      const buf = displayBuffers[displayBufferIndex];
      packVram(cpu.get_VRAM_words(), buf);

      const previousBuf = displayBuffers[(displayBufferIndex + 1) % 2];
      let hasDiff = false;

      for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
        if (buf[x] === previousBuf[x]) {
          continue;
        }
        hasDiff = true;

        const x1 = x * DISPLAY_PIXEL_SIZE;
        const x2 = x1 + DISPLAY_PIXEL_SIZE;

        canvas.drawRect({
          x1: x1,
          y1: 0,
          x2: x2,
          y2: DISPLAY_HEIGHT,
          color: 0x999999,
        });

        let word = buf[x];
        let y = 0;
        while (word > 0 && y < DISPLAY_PIXEL_COUNT_Y) {
          while (y < DISPLAY_PIXEL_COUNT_Y && !(word & 1)) {
            word >>= 1;
            y += 1;
          }
          if (word === 0 || y >= DISPLAY_PIXEL_COUNT_Y) {
            break;
          }
          const runStart = y;
          while (y < DISPLAY_PIXEL_COUNT_Y && word & 1) {
            word >>= 1;
            y += 1;
          }
          canvas.drawRect({
            x1: x1,
            y1: runStart * DISPLAY_PIXEL_SIZE,
            x2: x2,
            y2: y * DISPLAY_PIXEL_SIZE,
            color: 0x333333,
          });
        }
      }

      if (hasDiff) {
        displayBufferIndex = (displayBufferIndex + 1) % 2;
      }

      this.state.lastDisplayMs = Date.now() - startTime;
    }, 50);
  },
  _buildIconsUI() {
    const h = DISPLAY_WIDTH / 4;

    createWidget(widget.FILL_RECT, {
      x: DISPLAY_POS_X,
      y: DISPLAY_POS_Y - h,
      w: DISPLAY_WIDTH,
      h: h,
      color: 0xbbc7ac,
    });
    createWidget(widget.FILL_RECT, {
      x: DISPLAY_POS_X,
      y: DISPLAY_POS_Y + DISPLAY_HEIGHT,
      w: DISPLAY_WIDTH,
      h: h,
      color: 0xbbc7ac,
    });
  },
  _buildButtonsUI() {
    const pressButton = (port, pin, level) => {
      const cpu = getApp()._options.globalData.cpu;
      cpu.pin_set(port, pin, level);
      logger.log(`button down (port=${port}, pin=${pin}, level=${level})`);
    };

    const releaseButton = (port, pin) => {
      const cpu = getApp()._options.globalData.cpu;
      cpu.pin_release(port, pin);
      logger.log(`button up (port=${port}, pin=${pin})`);
    };

    const buttonA = createWidget(widget.BUTTON, {
      x: 100,
      y: 360,
      w: 80,
      h: 80,
      text: "A",
      color: 0x555555,
      press_color: 0x999999,
      normal_color: 0xcccccc,
      radius: 40,
    });
    buttonA.addEventListener(event.CLICK_DOWN, () => {
      pressButton(
        buttons.btnLeft.port,
        buttons.btnLeft.pin,
        buttons.btnLeft.level,
      );
    });
    buttonA.addEventListener(event.CLICK_UP, () => {
      releaseButton(buttons.btnLeft.port, buttons.btnLeft.pin);
    });

    const buttonB = createWidget(widget.BUTTON, {
      x: 200,
      y: 390,
      w: 80,
      h: 80,
      text: "B",
      color: 0x555555,
      press_color: 0x999999,
      normal_color: 0xcccccc,
      radius: 40,
    });
    buttonB.addEventListener(event.CLICK_DOWN, () => {
      pressButton(
        buttons.btnCenter.port,
        buttons.btnCenter.pin,
        buttons.btnCenter.level,
      );
    });
    buttonB.addEventListener(event.CLICK_UP, () => {
      releaseButton(buttons.btnCenter.port, buttons.btnCenter.pin);
    });

    const buttonC = createWidget(widget.BUTTON, {
      x: 300,
      y: 360,
      w: 80,
      h: 80,
      text: "C",
      color: 0x555555,
      press_color: 0x999999,
      normal_color: 0xcccccc,
      radius: 40,
    });
    buttonC.addEventListener(event.CLICK_DOWN, () => {
      pressButton(
        buttons.btnRight.port,
        buttons.btnRight.pin,
        buttons.btnRight.level,
      );
    });
    buttonC.addEventListener(event.CLICK_UP, () => {
      releaseButton(buttons.btnRight.port, buttons.btnRight.pin);
    });

    // const buttonAC = createWidget(widget.BUTTON, {
    //   x: 210,
    //   y: 410,
    //   w: 60,
    //   h: 60,
    //   text: "A+C",
    //   color: 0x555555,
    //   press_color: 0x999999,
    //   normal_color: 0xcccccc,
    //   radius: 30,
    // });
    // buttonAC.addEventListener(event.CLICK_DOWN, () => {
    //   pressButton(
    //     buttons.btnLeft.port,
    //     buttons.btnLeft.pin,
    //     buttons.btnLeft.level,
    //   );
    //   pressButton(
    //     buttons.btnRight.port,
    //     buttons.btnRight.pin,
    //     buttons.btnRight.level,
    //   );
    // });
    // buttonAC.addEventListener(event.CLICK_UP, () => {
    //   releaseButton(buttons.btnLeft.port, buttons.btnLeft.pin);
    //   releaseButton(buttons.btnRight.port, buttons.btnRight.pin);
    // });
  },
});
