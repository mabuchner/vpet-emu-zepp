import * as hmUI from "@zos/ui";
import { getDeviceInfo } from "@zos/device";
import { px } from "@zos/utils";

export const { width: DEVICE_WIDTH } = getDeviceInfo();

const TOP_PADDING = px(48);
const TITLE_H = px(72);

export const LIST_TOP = TOP_PADDING + TITLE_H;
export const ITEM_H = px(96);
export const ITEM_GAP = px(4);
export const ITEM_X = px(40);
export const ITEM_W = DEVICE_WIDTH - ITEM_X * 2;
export const ITEM_TEXT_SIZE = px(28);
export const ITEM_RADIUS = px(8);
export const BOTTOM_PADDING = px(120);

export const TITLE_STYLE = {
  text: "Select ROM",
  x: 0,
  y: TOP_PADDING,
  w: DEVICE_WIDTH,
  h: TITLE_H,
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
};
