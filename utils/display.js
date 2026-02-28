export const DISPLAY_PIXEL_COUNT_X = 32;

// The first number contains the 16-bit offset in the VRAM of the upper 8
// pixels. The second number is the 16-bit offset of the lower 8 pixels. The
// two offsets are stored in a single 16-bit values, so we only need to do one
// array lookup.
//
// The 8 pixels of the top and the bottom half are stored in two bytes in the
// VRAM (0x0F0F).
export const vramOffsets = new Uint16Array([
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

export function packVram(vram, buf) {
  const words = new Uint16Array(vram.buffer);
  for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
    const offset = vramOffsets[x];
    const word0 = words[offset & 0xff];
    const word1 = words[offset >> 8];
    const byte0 = (word0 >> 4) | (word0 & 0xf);
    const byte1 = (word1 >> 4) | (word1 & 0xf);
    buf[x] = (byte1 << 8) | byte0;
  }
}
