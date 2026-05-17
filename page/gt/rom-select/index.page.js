import { createWidget, event, widget } from "@zos/ui";
import { push } from "@zos/router";
import { statSync } from "@zos/fs";
import { showToast } from "@zos/interaction";
import { ROM_LIST } from "../../../utils/rom-config";
import {
  BOTTOM_PADDING,
  DEVICE_WIDTH,
  ITEM_GAP,
  ITEM_H,
  ITEM_RADIUS,
  ITEM_TEXT_SIZE,
  MENU_BTN_GAP,
  MENU_BTN_W,
  ROM_BTN_W,
  ITEM_X,
  LIST_TOP,
  TITLE_STYLE,
} from "zosLoader:./index.page.[pf].layout.js";

function romFileExists(file) {
  return statSync({ path: "assets://raw/" + file }) !== undefined;
}

Page({
  state: {},
  onInit() {},
  build() {
    createWidget(widget.TEXT, TITLE_STYLE);

    ROM_LIST.forEach((rom, index) => {
      const available = romFileExists(rom.file);
      const itemY = LIST_TOP + index * (ITEM_H + ITEM_GAP);
      const btn = createWidget(widget.BUTTON, {
        x: ITEM_X,
        y: itemY,
        w: ROM_BTN_W,
        h: ITEM_H,
        text: rom.name,
        color: available ? 0xffffff : 0x666666,
        normal_color: available ? 0x333333 : 0x1a1a1a,
        press_color: 0x555555,
        radius: ITEM_RADIUS,
        text_size: ITEM_TEXT_SIZE,
      });
      btn.addEventListener(event.CLICK_UP, () => {
        if (available) {
          push({
            url: "page/gt/emulator/index.page",
            params: JSON.stringify({ romId: rom.id }),
          });
        } else {
          showToast({ content: "Copy " + rom.file + " to assets/raw/" });
        }
      });
      const menuBtn = createWidget(widget.BUTTON, {
        x: ITEM_X + ROM_BTN_W + MENU_BTN_GAP,
        y: itemY,
        w: MENU_BTN_W,
        h: ITEM_H,
        text: "...",
        color: 0xffffff,
        normal_color: 0x333333,
        press_color: 0x555555,
        radius: ITEM_RADIUS,
        text_size: ITEM_TEXT_SIZE,
      });
      menuBtn.addEventListener(event.CLICK_UP, () => {
        push({
          url: "page/gt/rom-config/index.page",
          params: JSON.stringify({ romId: rom.id, romName: rom.name }),
        });
      });
    });

    createWidget(widget.FILL_RECT, {
      x: 0,
      y: LIST_TOP + ROM_LIST.length * (ITEM_H + ITEM_GAP),
      w: DEVICE_WIDTH,
      h: BOTTOM_PADDING,
      color: 0x000000,
    });
  },
  onDestroy() {},
});
