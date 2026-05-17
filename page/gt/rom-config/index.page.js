import { createWidget, event, widget } from "@zos/ui";
import { createModal, MODAL_CONFIRM, showToast } from "@zos/interaction";
import {
  CONTENT_TOP,
  DEVICE_WIDTH,
  ITEM_H,
  ITEM_RADIUS,
  ITEM_TEXT_SIZE,
  ITEM_W,
  ITEM_X,
  TITLE_STYLE,
} from "zosLoader:./index.page.[pf].layout.js";
import { deleteSaveState } from "../../../utils/save-state";

Page({
  state: {
    romId: undefined,
    romName: undefined,
  },
  onInit(params) {
    const { romId, romName } = JSON.parse(params);
    this.state.romId = romId;
    this.state.romName = romName;
  },
  build() {
    const { romId, romName } = this.state;

    createWidget(widget.TEXT, {
      ...TITLE_STYLE,
      text: romName,
    });

    const resetBtn = createWidget(widget.BUTTON, {
      x: ITEM_X,
      y: CONTENT_TOP,
      w: ITEM_W,
      h: ITEM_H,
      text: "Reset State",
      color: 0xffffff,
      normal_color: 0x333333,
      press_color: 0x555555,
      radius: ITEM_RADIUS,
      text_size: ITEM_TEXT_SIZE,
    });
    const confirmModal = createModal({
      content: "Delete save state for " + romName + "?",
      onClick(key) {
        if (key.type === MODAL_CONFIRM) {
          try {
            deleteSaveState(romId);
            showToast({ content: "Save state reset" });
          } catch {
            showToast({ content: "Failed to reset save state" });
          }
        }
      },
    });
    resetBtn.addEventListener(event.CLICK_UP, () => {
      confirmModal.show(true);
    });

    createWidget(widget.FILL_RECT, {
      x: 0,
      y: CONTENT_TOP + ITEM_H,
      w: DEVICE_WIDTH,
      h: 120,
      color: 0x000000,
    });
  },
  onDestroy() {},
});
