import { createWidget, event, prop, widget } from "@zos/ui";
import { log as Logger } from "@zos/utils";
import {
  setPageBrightTime,
  pauseDropWristScreenOff,
  pausePalmScreenOff,
  setWakeUpRelaunch,
} from "@zos/display";
// import { TEXT_STYLE } from "zosLoader:./index.page.[pf].layout.js";

const logger = Logger.getLogger("vpet-emu");

const DISPLAY_PIXEL_COUNT_X = 32;
const DISPLAY_PIXEL_COUNT_Y = 16;
const DISPLAY_PIXEL_SIZE = 8;
const DISPLAY_WIDTH = DISPLAY_PIXEL_COUNT_X * DISPLAY_PIXEL_SIZE;
const DISPLAY_HEIGHT = DISPLAY_PIXEL_COUNT_Y * DISPLAY_PIXEL_SIZE;
const DISPLAY_POS_X = 120;
const DISPLAY_POS_Y = 160;

// The first number contains the 16-bit offset in the VRAM of the upper 8
// pixels. The second number is the 16-bit offset of the lower 8 pixels. The
// two offsets are stored in a single 16-bit values, so we only need to do one
// array lookup.
//
// The 8 pixels of the top and the bottom half are stored in two bytes in the
// VRAM (0x0F0F).
const vramOffsets = new Uint16Array([
  // "col_0
  0 | (40 << 8),

  // "col_1
  1 | (41 << 8),

  // "col_2
  2 | (42 << 8),

  // "col_3
  3 | (43 << 8),

  // "col_4
  4 | (44 << 8),

  // "col_5
  5 | (45 << 8),

  // "col_6
  6 | (46 << 8),

  // "col_7
  7 | (47 << 8),

  // "col_8
  9 | (49 << 8),

  // "col_9
  10 | (50 << 8),

  // "col_10
  11 | (51 << 8),

  // "col_11
  12 | (52 << 8),

  // "col_12
  13 | (53 << 8),

  // "col_13
  14 | (54 << 8),

  // "col_14
  15 | (55 << 8),

  // "col_15
  16 | (56 << 8),

  // "col_16
  36 | (76 << 8),

  // "col_17
  35 | (75 << 8),

  // "col_18
  34 | (74 << 8),

  // "col_19
  33 | (73 << 8),

  // "col_20
  32 | (72 << 8),

  // "col_21
  31 | (71 << 8),

  // "col_22
  30 | (70 << 8),

  // "col_23
  29 | (69 << 8),

  // "col_24
  27 | (67 << 8),

  // "col_25
  26 | (66 << 8),

  // "col_26
  25 | (65 << 8),

  // "col_27
  24 | (64 << 8),

  // "col_28
  23 | (63 << 8),

  // "col_29
  22 | (62 << 8),

  // "col_30
  21 | (61 << 8),

  // "col_31
  20 | (60 << 8),
]);

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
      // const startTime = new Date();
      const app = getApp();
      const cpu = app._options.globalData.cpu;

      const words = new Uint16Array(cpu.get_VRAM().buffer);
      const buf = displayBuffers[displayBufferIndex];
      for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
        const offset = vramOffsets[x]; // Read two offsets at once
        const word0 = words[offset & 0xff]; // Data for upper 8 pixels is stored at offset 0 (lower byte)
        const word1 = words[offset >> 8]; // Data for lower 8 pixels is stored at offset 1 (higher byte)
        const byte0 = (word0 >> 4) | (word0 & 0xf); // Data only stored in the lower nibbles 0x0F0F
        const byte1 = (word1 >> 4) | (word1 & 0xf); // Data only stored in the lower nibbles 0x0F0F
        buf[x] = (byte1 << 8) | byte0; // Store 16 pixels in a single word
      }

      let hasDiff = false;
      const previousBuf = displayBuffers[(displayBufferIndex + 1) % 2];
      for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
        if (buf[x] != previousBuf[x]) {
          hasDiff = true;
          break;
        }
      }

      if (hasDiff) {
        canvas.drawRect({
          x1: 0,
          y1: 0,
          x2: DISPLAY_WIDTH,
          y2: DISPLAY_HEIGHT,
          color: 0x999999,
        });

        let x1 = 0;
        let x2 = DISPLAY_PIXEL_SIZE;
        for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
          let word = buf[x];
          let y1 = 0;
          let y2 = DISPLAY_PIXEL_SIZE;
          for (let y = 0; word > 0 && y < DISPLAY_PIXEL_COUNT_Y; y += 1) {
            if (word & 1) {
              canvas.drawRect({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                color: 0x333333,
              });
            }
            y1 += DISPLAY_PIXEL_SIZE;
            y2 += DISPLAY_PIXEL_SIZE;
            word >>= 1;
          }
          x1 += DISPLAY_PIXEL_SIZE;
          x2 += DISPLAY_PIXEL_SIZE;
        }
        displayBufferIndex = (displayBufferIndex + 1) % 2;
      }

      // const endTime = new Date();
      // const dt = endTime - startTime;
      // console.log(`dt=${dt}ms`);
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
