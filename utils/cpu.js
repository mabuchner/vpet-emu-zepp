import * as sound from "./sound";

const OSC1_CLOCK = 32768;
const TIMER_CLOCK_DIV = OSC1_CLOCK / 256;
const STOPWATCH_CLOCK_DIV = OSC1_CLOCK / 100;
const PTIMER_CLOCK_DIV = new Uint8Array([
  0,
  0,
  OSC1_CLOCK / 256,
  OSC1_CLOCK / 512,
  OSC1_CLOCK / 1024,
  OSC1_CLOCK / 2048,
  OSC1_CLOCK / 4096,
  OSC1_CLOCK / 8192,
]);

const RAM_SIZE = 0x300;
const VRAM_SIZE = 0x0a0;
const VRAM_PART_SIZE = 0x050;
const VRAM_PART1_OFFSET = 0xe00;
const VRAM_PART2_OFFSET = 0xe80;
const VRAM_PART1_END = VRAM_PART1_OFFSET + VRAM_PART_SIZE;
const VRAM_PART2_END = VRAM_PART2_OFFSET + VRAM_PART_SIZE;
const IORAM_OFFSET = 0xf00;
const IORAM_SIZE = 0x07f;
const IORAM_END = IORAM_OFFSET + IORAM_SIZE;

const EMPTY_VRAM = new Uint8Array(VRAM_SIZE);
const EMPTY_VRAM_WORDS = new Uint16Array(EMPTY_VRAM.buffer);
const FULL_VRAM = new Uint8Array(VRAM_SIZE).fill(1);
const FULL_VRAM_WORDS = new Uint16Array(FULL_VRAM.buffer);

const IO_IT1 = 8;
const IO_IT2 = 4;
const IO_IT8 = 2;
const IO_IT32 = 1;
const IO_ISW0 = 2;
const IO_ISW1 = 1;
const IO_IPT = 1;
// const IO_ISIO = 1; // Unused
const IO_IK0 = 1;
const IO_IK1 = 1;
// const IO_EIT1 = 8; // Unused
// const IO_EIT2 = 4; // Unused
// const IO_EIT8 = 2; // Unused
// const IO_EIT32 = 1; // Unused
// const IO_EISW1 = 2; // Unused
// const IO_EISW0 = 1; // Unused
// const IO_EIPT = 1; // Unused
// const IO_EISIO = 1; // Unused
// const IO_EIK03 = 8; // Unused
// const IO_EIK02 = 4; // Unused
// const IO_EIK01 = 2; // Unused
// const IO_EIK00 = 1; // Unused
// const IO_EIK13 = 8; // Unused
// const IO_EIK12 = 4; // Unused
// const IO_EIK11 = 2; // Unused
// const IO_EIK10 = 1; // Unused
// const IO_TM3 = 8; // Unused
const IO_TM2 = 4;
// const IO_TM1 = 2; // Unused
// const IO_TM0 = 1; // Unused
const IO_TM7 = 8;
const IO_TM6 = 4;
// const IO_TM5 = 2; // Unused
const IO_TM4 = 1;
// const IO_SWL3 = 8; // Unused
// const IO_SWL2 = 4; // Unused
// const IO_SWL1 = 2; // Unused
// const IO_SWL0 = 1; // Unused
// const IO_SWH3 = 8; // Unused
// const IO_SWH2 = 4; // Unused
// const IO_SWH1 = 2; // Unused
// const IO_SWH0 = 1; // Unused
// const IO_PT3 = 8; // Unused
// const IO_PT2 = 4; // Unused
// const IO_PT1 = 2; // Unused
// const IO_PT0 = 1; // Unused
// const IO_PT7 = 8; // Unused
// const IO_PT6 = 4; // Unused
// const IO_PT5 = 2; // Unused
// const IO_PT4 = 1; // Unused
// const IO_RD3 = 8; // Unused
// const IO_RD2 = 4; // Unused
// const IO_RD1 = 2; // Unused
// const IO_RD0 = 1; // Unused
// const IO_RD7 = 8; // Unused
// const IO_RD6 = 4; // Unused
// const IO_RD5 = 2; // Unused
// const IO_RD4 = 1; // Unused
// const IO_SD3 = 8; // Unused
// const IO_SD2 = 4; // Unused
// const IO_SD1 = 2; // Unused
// const IO_SD0 = 1; // Unused
// const IO_SD7 = 8; // Unused
// const IO_SD6 = 4; // Unused
// const IO_SD5 = 2; // Unused
// const IO_SD4 = 1; // Unused
// const IO_K03 = 8; // Unused
// const IO_K02 = 4; // Unused
// const IO_K01 = 2; // Unused
// const IO_K00 = 1; // Unused
// const IO_DFK03 = 8; // Unused
// const IO_DFK02 = 4; // Unused
// const IO_DFK01 = 2; // Unused
// const IO_DFK00 = 1; // Unused
// const IO_K13 = 8; // Unused
// const IO_K12 = 4; // Unused
// const IO_K11 = 2; // Unused
// const IO_K10 = 1; // Unused
// const IO_R03 = 8; // Unused
// const IO_R02 = 4; // Unused
// const IO_R01 = 2; // Unused
// const IO_R00 = 1; // Unused
// const IO_R13 = 8; // Unused
// const IO_R12 = 4; // Unused
// const IO_R11 = 2; // Unused
// const IO_R10 = 1; // Unused
// const IO_R23 = 8; // Unused
// const IO_R22 = 4; // Unused
// const IO_R21 = 2; // Unused
// const IO_R20 = 1; // Unused
const IO_R33 = 8;
// const IO_R32 = 4; // Unused
// const IO_R31 = 2; // Unused
// const IO_R30 = 1; // Unused
const IO_R43 = 8;
// const IO_R42 = 4; // Unused
// const IO_R41 = 2; // Unused
// const IO_R40 = 1; // Unused
// const IO_P03 = 8; // Unused
// const IO_P02 = 4; // Unused
// const IO_P01 = 2; // Unused
// const IO_P00 = 1; // Unused
// const IO_P13 = 8; // Unused
// const IO_P12 = 4; // Unused
// const IO_P11 = 2; // Unused
// const IO_P10 = 1; // Unused
// const IO_P23 = 8; // Unused
// const IO_P22 = 4; // Unused
// const IO_P21 = 2; // Unused
// const IO_P20 = 1; // Unused
// const IO_P33 = 8; // Unused
// const IO_P32 = 4; // Unused
// const IO_P31 = 2; // Unused
// const IO_P30 = 1; // Unused
const IO_CLKCHG = 8;
// const IO_OSCC = 4; // Unused
// const IO_VSC1 = 2; // Unused
// const IO_VSC0 = 1; // Unused
const IO_ALOFF = 8;
const IO_ALON = 4;
// const IO_LDUTY = 2; // Unused
// const IO_HLMOD = 1; // Unused
// const IO_LC3 = 8; // Unused
// const IO_LC2 = 4; // Unused
// const IO_LC1 = 2; // Unused
// const IO_LC0 = 1; // Unused
const IO_SVDDT = 8;
// const IO_SVDON = 4; // Unused
// const IO_SVC1 = 2; // Unused
// const IO_SVC0 = 1; // Unused
const IO_SHOTPW = 8;
const IO_BZFQ = 7;
// const IO_BZFQ2 = 4; // Unused
// const IO_BZFQ1 = 2; // Unused
// const IO_BZFQ0 = 1; // Unused
const IO_BZSHOT = 8;
const IO_ENVRST = 4; // Unused
const IO_ENVRT = 2;
const IO_ENVON = 1;
const IO_TMRST = 2;
// const IO_WDRST = 1; // Unused
const IO_SWRST = 2;
const IO_SWRUN = 1;
const IO_PTRST = 2;
const IO_PTRUN = 1;
const IO_PTCOUT = 8;
const IO_PTC = 7;
// const IO_PTC2 = 4; // Unused
// const IO_PTC1 = 2; // Unused
// const IO_PTC0 = 1; // Unused
// const IO_SCTRG = 8; // Unused
// const IO_SEN = 4; // Unused
// const IO_SCS1 = 2; // Unused
// const IO_SCS0 = 1; // Unused
// const IO_HZR3 = 8; // Unused
// const IO_HZR2 = 4; // Unused
// const IO_HZR1 = 2; // Unused
// const IO_HZR0 = 1; // Unused
const IO_IOC3 = 8;
const IO_IOC2 = 4;
const IO_IOC1 = 2;
const IO_IOC0 = 1;
const IO_PUP3 = 8;
const IO_PUP2 = 4;
const IO_PUP1 = 2;
const IO_PUP0 = 1;

const mask = {
  port_pullup: {
    K0: 15,
    K1: 15,
  },
  p3_dedicated: 0,
};

// E0C6200 — module-level state

let _ROM;
let _OSC1_clock_div;
let _OSC1_counter;
let _timer_counter;
let _ptimer_counter;
let _stopwatch_counter;
let _if_delay;
let _RESET;
let _io_tbl;
let _get_abmxmy_tbl;
let _set_abmxmy_tbl;
const _execute = new Array(4096);
let _port_pullup;
let _p3_dedicated;
// Registers (set by _initRegisters):
let _A, _B, _IX, _IY, _SP;
let _PC, _NPC;
let _CF, _ZF, _DF, _IF;
let _RAM, _VRAM, _VRAM_words;
let _HALT;
let _P0_OUTPUT_DATA, _P1_OUTPUT_DATA, _P2_OUTPUT_DATA, _P3_OUTPUT_DATA;
let _IT, _ISW, _IPT, _ISIO, _IK0, _IK1;
let _EIT, _EISW, _EIPT, _EISIO, _EIK0, _EIK1;
let _TM, _SWL, _SWH, _PT, _RD, _SD;
let _K0, _DFK0, _K1;
let _R0, _R1, _R2, _R3, _R4;
let _P0, _P1, _P2, _P3;
let _CTRL_OSC, _CTRL_LCD, _LC, _CTRL_SVD; // eslint-disable-line no-unused-vars
let _CTRL_BZ1, _CTRL_BZ2, _CTRL_SW, _CTRL_PT;
let _PTC, _SC, _HZR, _IOC, _PUP; // eslint-disable-line no-unused-vars

export function initCPU(rom, clock, toneGenerator) {
  _ROM = rom;
  sound.initSound(OSC1_CLOCK, toneGenerator);

  _port_pullup = mask.port_pullup;

  _p3_dedicated = mask.p3_dedicated;

  _initRegisters();

  _OSC1_clock_div = clock / OSC1_CLOCK;

  _OSC1_counter = 0;
  _timer_counter = 0;
  _ptimer_counter = 0;
  _stopwatch_counter = 0;

  _if_delay = false;

  _RESET = 0;

  _io_tbl = new Array(IORAM_SIZE);
  _io_tbl[0x00] = [_get_io_it, _set_io_dummy];
  _io_tbl[0x01] = [_get_io_isw, _set_io_dummy];
  _io_tbl[0x02] = [_get_io_ipt, _set_io_dummy];
  _io_tbl[0x03] = [_get_io_isio, _set_io_dummy];
  _io_tbl[0x04] = [_get_io_ik0, _set_io_dummy];
  _io_tbl[0x05] = [_get_io_ik1, _set_io_dummy];
  _io_tbl[0x10] = [_get_io_eit, _set_io_eit];
  _io_tbl[0x11] = [_get_io_eisw, _set_io_eisw];
  _io_tbl[0x12] = [_get_io_eipt, _set_io_eipt];
  _io_tbl[0x13] = [_get_io_eisio, _set_io_eisio];
  _io_tbl[0x14] = [_get_io_eik0, _set_io_eik0];
  _io_tbl[0x15] = [_get_io_eik1, _set_io_eik1];
  _io_tbl[0x20] = [_get_io_tm30, _set_io_dummy];
  _io_tbl[0x21] = [_get_io_tm74, _set_io_dummy];
  _io_tbl[0x22] = [_get_io_swl, _set_io_dummy];
  _io_tbl[0x23] = [_get_io_swh, _set_io_dummy];
  _io_tbl[0x24] = [_get_io_pt30, _set_io_dummy];
  _io_tbl[0x25] = [_get_io_pt74, _set_io_dummy];
  _io_tbl[0x26] = [_get_io_rd30, _set_io_rd30];
  _io_tbl[0x27] = [_get_io_rd74, _set_io_rd74];
  _io_tbl[0x30] = [_get_io_sd30, _set_io_sd30];
  _io_tbl[0x31] = [_get_io_sd74, _set_io_sd74];
  _io_tbl[0x40] = [_get_io_k0, _set_io_dummy];
  _io_tbl[0x41] = [_get_io_dfk0, _set_io_dfk0];
  _io_tbl[0x42] = [_get_io_k1, _set_io_dummy];
  _io_tbl[0x50] = [_get_io_r0, _set_io_r0];
  _io_tbl[0x51] = [_get_io_r1, _set_io_r1];
  _io_tbl[0x52] = [_get_io_r2, _set_io_r2];
  _io_tbl[0x53] = [_get_io_r3, _set_io_r3];
  _io_tbl[0x54] = [_get_io_r4, _set_io_r4];
  _io_tbl[0x60] = [_get_io_p0, _set_io_p0];
  _io_tbl[0x61] = [_get_io_p1, _set_io_p1];
  _io_tbl[0x62] = [_get_io_p2, _set_io_p2];
  _io_tbl[0x63] = [_get_io_p3, _set_io_p3];
  _io_tbl[0x70] = [_get_io_ctrl_osc, _set_io_ctrl_osc]; //to-do
  _io_tbl[0x71] = [_get_io_ctrl_lcd, _set_io_ctrl_lcd];
  _io_tbl[0x72] = [_get_io_lc, _set_io_lc];
  _io_tbl[0x73] = [_get_io_ctrl_svd, _set_io_dummy]; //to-do
  _io_tbl[0x74] = [_get_io_ctrl_bz1, _set_io_ctrl_bz1]; //to-do
  _io_tbl[0x75] = [_get_io_ctrl_bz2, _set_io_ctrl_bz2]; //to-do
  _io_tbl[0x76] = [_get_io_dummy, _set_io_ctrl_tm];
  _io_tbl[0x77] = [_get_io_ctrl_sw, _set_io_ctrl_sw];
  _io_tbl[0x78] = [_get_io_ctrl_pt, _set_io_ctrl_pt];
  _io_tbl[0x79] = [_get_io_ptc, _set_io_ptc];
  _io_tbl[0x7a] = [_get_io_dummy, _set_io_dummy]; //to-do
  _io_tbl[0x7b] = [_get_io_dummy, _set_io_dummy]; //to-do
  _io_tbl[0x7d] = [_get_io_ioc, _set_io_ioc];
  _io_tbl[0x7e] = [_get_io_pup, _set_io_pup];

  _get_abmxmy_tbl = [get_A, get_B, get_MX, get_MY];

  _set_abmxmy_tbl = [set_A, set_B, set_MX, set_MY];

  const fillOpRange = (tbl, start, count, fn) => {
    for (let i = 0; i < count; i += 1) {
      tbl[start + i] = fn;
    }
    return start + count;
  };
  let opOffset = 0;
  opOffset = fillOpRange(_execute, opOffset, 256, _jp_s); //0 0 0 0  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _retd_l); //0 0 0 1  l7 l6 l5 l4  l3 l2 l1 l0
  opOffset = fillOpRange(_execute, opOffset, 256, _jp_c_s); //0 0 1 0  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _jp_nc_s); //0 0 1 1  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _call_s); //0 1 0 0  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _calz_s); //0 1 0 1  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _jp_z_s); //0 1 1 0  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _jp_nz_s); //0 1 1 1  s7 s6 s5 s4  s3 s2 s1 s0
  opOffset = fillOpRange(_execute, opOffset, 256, _ld_y_y); //1 0 0 0  y7 y6 y5 y4  y3 y2 y1 y0
  opOffset = fillOpRange(_execute, opOffset, 256, _lbpx_mx_l); //1 0 0 1  l7 l6 l5 l4  l3 l2 l1 l0
  opOffset = fillOpRange(_execute, opOffset, 16, _adc_xh_i); //1 0 1 0  0 0 0 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _adc_xl_i); //1 0 1 0  0 0 0 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _adc_yh_i); //1 0 1 0  0 0 1 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _adc_yl_i); //1 0 1 0  0 0 1 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _cp_xh_i); //1 0 1 0  0 1 0 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _cp_xl_i); //1 0 1 0  0 1 0 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _cp_yh_i); //1 0 1 0  0 1 1 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _cp_yl_i); //1 0 1 0  0 1 1 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _add_r_q); //1 0 1 0  1 0 0 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _adc_r_q); //1 0 1 0  1 0 0 1  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _sub_r_q); //1 0 1 0  1 0 1 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _sbc_r_q); //1 0 1 0  1 0 1 1  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _and_r_q); //1 0 1 0  1 1 0 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _or_r_q); //1 0 1 0  1 1 0 1  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _xor_r_q); //1 0 1 0  1 1 1 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _rlc_r); //1 0 1 0  1 1 1 1  r1 r0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 256, _ld_x_x); //1 0 1 1  x7 x6 x5 x4  x3 x2 x1 x0
  opOffset = fillOpRange(_execute, opOffset, 64, _add_r_i); //1 1 0 0  0 0 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _adc_r_i); //1 1 0 0  0 1 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _and_r_i); //1 1 0 0  1 0 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _or_r_i); //1 1 0 0  1 1 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _xor_r_i); //1 1 0 1  0 0 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _sbc_r_i); //1 1 0 1  0 1 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _fan_r_i); //1 1 0 1  1 0 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _cp_r_i); //1 1 0 1  1 1 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 64, _ld_r_i); //1 1 1 0  0 0 r1 r0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 32, _pset_p); //1 1 1 0  0 1 0 p4  p3 p2 p1 p0
  opOffset = fillOpRange(_execute, opOffset, 16, _ldpx_mx_i); //1 1 1 0  0 1 1 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _ldpy_my_i); //1 1 1 0  0 1 1 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_xp_r); //1 1 1 0  1 0 0 0  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_xh_r); //1 1 1 0  1 0 0 0  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_xl_r); //1 1 1 0  1 0 0 0  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _rrc_r); //1 1 1 0  1 0 0 0  1 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_yp_r); //1 1 1 0  1 0 0 1  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_yh_r); //1 1 1 0  1 0 0 1  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_yl_r); //1 1 1 0  1 0 0 1  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_xp); //1 1 1 0  1 0 1 0  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_xh); //1 1 1 0  1 0 1 0  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_xl); //1 1 1 0  1 0 1 0  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_yp); //1 1 1 0  1 0 1 1  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_yh); //1 1 1 0  1 0 1 1  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_yl); //1 1 1 0  1 0 1 1  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 16, _ld_r_q); //1 1 1 0  1 1 0 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 16, _ldpx_r_q); //1 1 1 0  1 1 1 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _ldpy_r_q); //1 1 1 0  1 1 1 1  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _cp_r_q); //1 1 1 1  0 0 0 0  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 16, _fan_r_q); //1 1 1 1  0 0 0 1  r1 r0 q1 q0
  opOffset = fillOpRange(_execute, opOffset, 8, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _acpx_mx_r); //1 1 1 1  0 0 1 0  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _acpy_my_r); //1 1 1 1  0 0 1 0  1 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 8, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _scpx_mx_r); //1 1 1 1  0 0 1 1  1 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _scpy_my_r); //1 1 1 1  0 0 1 1  1 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 16, _set_f_i); //1 1 1 1  0 1 0 0  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _rst_f_i); //1 1 1 1  0 1 0 1  i3 i2 i1 i0
  opOffset = fillOpRange(_execute, opOffset, 16, _inc_mn); //1 1 1 1  0 1 1 0  n3 n2 n1 n0
  opOffset = fillOpRange(_execute, opOffset, 16, _dec_mn); //1 1 1 1  0 1 1 1  n3 n2 n1 n0
  opOffset = fillOpRange(_execute, opOffset, 16, _ld_mn_a); //1 1 1 1  1 0 0 0  n3 n2 n1 n0
  opOffset = fillOpRange(_execute, opOffset, 16, _ld_mn_b); //1 1 1 1  1 0 0 1  n3 n2 n1 n0
  opOffset = fillOpRange(_execute, opOffset, 16, _ld_a_mn); //1 1 1 1  1 0 1 0  n3 n2 n1 n0
  opOffset = fillOpRange(_execute, opOffset, 16, _ld_b_mn); //1 1 1 1  1 0 1 1  n3 n2 n1 l0
  opOffset = fillOpRange(_execute, opOffset, 4, _push_r); //1 1 1 1  1 1 0 0  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 1, _push_xp); //1 1 1 1  1 1 0 0  0 1 0 0
  opOffset = fillOpRange(_execute, opOffset, 1, _push_xh); //1 1 1 1  1 1 0 0  0 1 0 1
  opOffset = fillOpRange(_execute, opOffset, 1, _push_xl); //1 1 1 1  1 1 0 0  0 1 1 0
  opOffset = fillOpRange(_execute, opOffset, 1, _push_yp); //1 1 1 1  1 1 0 0  0 1 1 1
  opOffset = fillOpRange(_execute, opOffset, 1, _push_yh); //1 1 1 1  1 1 0 0  1 0 0 0
  opOffset = fillOpRange(_execute, opOffset, 1, _push_yl); //1 1 1 1  1 1 0 0  1 0 0 1
  opOffset = fillOpRange(_execute, opOffset, 1, _push_f); //1 1 1 1  1 1 0 0  1 0 1 0
  opOffset = fillOpRange(_execute, opOffset, 1, _dec_sp); //1 1 1 1  1 1 0 0  1 0 1 1
  opOffset = fillOpRange(_execute, opOffset, 4, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _pop_r); //1 1 1 1  1 1 0 1  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_xp); //1 1 1 1  1 1 0 1  0 1 0 0
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_xh); //1 1 1 1  1 1 0 1  0 1 0 1
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_xl); //1 1 1 1  1 1 0 1  0 1 1 0
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_yp); //1 1 1 1  1 1 0 1  0 1 1 1
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_yh); //1 1 1 1  1 1 0 1  1 0 0 0
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_yl); //1 1 1 1  1 1 0 1  1 0 0 1
  opOffset = fillOpRange(_execute, opOffset, 1, _pop_f); //1 1 1 1  1 1 0 1  1 0 1 0
  opOffset = fillOpRange(_execute, opOffset, 1, _inc_sp); //1 1 1 1  1 1 0 1  1 0 1 1
  opOffset = fillOpRange(_execute, opOffset, 2, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 1, _rets); //1 1 1 1  1 1 0 1  1 1 1 0
  opOffset = fillOpRange(_execute, opOffset, 1, _ret); //1 1 1 1  1 1 0 1  1 1 1 1
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_sph_r); //1 1 1 1  1 1 1 0  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_sph); //1 1 1 1  1 1 1 0  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 1, _jpba); //1 1 1 1  1 1 1 0  1 0 0 0
  opOffset = fillOpRange(_execute, opOffset, 7, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_spl_r); //1 1 1 1  1 1 1 1  0 0 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 4, _ld_r_spl); //1 1 1 1  1 1 1 1  0 1 r1 r0
  opOffset = fillOpRange(_execute, opOffset, 1, _halt); //1 1 1 1  1 1 1 1  1 0 0 0
  opOffset = fillOpRange(_execute, opOffset, 2, _dummy);
  opOffset = fillOpRange(_execute, opOffset, 1, _nop5); //1 1 1 1  1 1 1 1  1 0 1 1
  opOffset = fillOpRange(_execute, opOffset, 3, _dummy);
  fillOpRange(_execute, opOffset, 1, _nop7); //1 1 1 1  1 1 1 1  1 1 1 1
}

/*
function examine() {
  return {
    PC: _PC,
    NPC: _NPC & 0x1F00,
    A: _A,
    B: _B,
    IX: _IX,
    IY: _IY,
    SP: _SP,
    CF: _CF,
    ZF: _ZF,
    DF: _DF,
    IF: _IF,
    HALT: _HALT,
    RAM0: _RAM.slice(0, 256),
    RAM1: _RAM.slice(256, 512),
    RAM2: _RAM.slice(512, 640),
    VRAM: _VRAM.slice(),
    IORAM: [
      _IT,
      _ISW,
      _IPT,
      _ISIO,
      _IK0,
      _IK1,
      _EIT,
      _EISW,
      _EIPT,
      _EISIO,
      _EIK0,
      _EIK1,
      _TM & 0xF,
      _TM >> 4,
      _SWL,
      _SWH,
      _PT & 0xF,
      _PT >> 4,
      _RD & 0xF,
      _RD >> 4,
      _SD & 0xF,
      _SD >> 4,
      _K0,
      _DFK0,
      _K1,
      _R0,
      _R1,
      _R2,
      _R3,
      _R4,
      _P0,
      _P1,
      _P2,
      _P3,
      _CTRL_OSC,
      _CTRL_LCD,
      _LC,
      _CTRL_SVD,
      _CTRL_BZ1,
      _CTRL_BZ2,
      0,
      _CTRL_SW,
      _CTRL_PT,
      _PTC,
      _SC,
      _HZR,
      _IOC,
      _PUP
    ]
  };
}
*/

function _initRegisters() {
  _A = 0;
  _B = 0;
  _IX = 0;
  _IY = 0;
  _SP = 0;

  _PC = 0x100;
  _NPC = 0x100;

  _CF = 0;
  _ZF = 0;
  _DF = 0;
  _IF = 0;

  _RAM = new Uint8Array(RAM_SIZE);
  _VRAM = new Uint8Array(VRAM_SIZE);
  _VRAM_words = new Uint16Array(_VRAM.buffer);

  _HALT = 0;

  _P0_OUTPUT_DATA = 0;
  _P1_OUTPUT_DATA = 0;
  _P2_OUTPUT_DATA = 0;
  _P3_OUTPUT_DATA = 0;

  _IT = 0;
  _ISW = 0;
  _IPT = 0;
  _ISIO = 0;
  _IK0 = 0;
  _IK1 = 0;
  _EIT = 0;
  _EISW = 0;
  _EIPT = 0;
  _EISIO = 0;
  _EIK0 = 0;
  _EIK1 = 0;
  _TM = 0;
  _SWL = 0;
  _SWH = 0;
  _PT = 0;
  _RD = 0;
  _SD = 0;
  _K0 = _port_pullup.K0;
  _DFK0 = 0xf;
  _K1 = _port_pullup.K1;
  _R0 = 0;
  _R1 = 0;
  _R2 = 0;
  _R3 = 0;
  _R4 = 0xf;
  _P0 = 0;
  _P1 = 0;
  _P2 = 0;
  _P3 = 0;
  _CTRL_OSC = 0;
  _CTRL_LCD = IO_ALOFF;
  _LC = 0;
  _CTRL_SVD = IO_SVDDT;
  _CTRL_BZ1 = 0;
  _CTRL_BZ2 = 0;
  _CTRL_SW = 0;
  _CTRL_PT = 0;
  _PTC = 0;
  _SC = 0;
  _HZR = 0;
  _IOC = 0;
  _PUP = 0;
}

export function reset() {
  _initRegisters();

  _OSC1_counter = 0;
  _timer_counter = 0;
  _stopwatch_counter = 0;
  sound.set_buzzer_off();
  sound.set_envelope_off();
}

function _get_io_dummy() {
  return 0;
}

function _set_io_dummy(/*value*/) {
  return;
}

function _get_io_it() {
  const ret = _IT;
  _IT = 0;
  return ret;
}

function _get_io_isw() {
  const ret = _ISW;
  _ISW = 0;
  return ret;
}

function _get_io_ipt() {
  const ret = _IPT;
  _IPT = 0;
  return ret;
}

function _get_io_isio() {
  const ret = _ISIO;
  _ISIO = 0;
  return ret;
}

function _get_io_ik0() {
  const ret = _IK0;
  _IK0 = 0;
  return ret;
}

function _get_io_ik1() {
  const ret = _IK1;
  _IK1 = 0;
  return ret;
}

function _get_io_eit() {
  return _EIT;
}

function _set_io_eit(value) {
  _EIT = value;
}

function _get_io_eisw() {
  return _EISW;
}

function _set_io_eisw(value) {
  _EISW = value & 0x3;
}

function _get_io_eipt() {
  return _EIPT;
}

function _set_io_eipt(value) {
  _EIPT = value & 0x1;
}

function _get_io_eisio() {
  return _EISIO;
}

function _set_io_eisio(value) {
  _EISIO = value & 0x1;
}

function _get_io_eik0() {
  return _EIK0;
}

function _set_io_eik0(value) {
  _EIK0 = value;
}

function _get_io_eik1() {
  return _EIK1;
}

function _set_io_eik1(value) {
  _EIK1 = value;
}

function _get_io_tm30() {
  return _TM & 0xf;
}

function _get_io_tm74() {
  return (_TM >> 4) & 0xf;
}

function _get_io_swl() {
  return _SWL & 0xf;
}

function _get_io_swh() {
  return _SWH & 0xf;
}

function _get_io_pt30() {
  return _PT & 0xf;
}

function _get_io_pt74() {
  return (_PT >> 4) & 0xf;
}

function _get_io_rd30() {
  return _RD & 0xf;
}

function _set_io_rd30(value) {
  _RD = (_RD & 0xf0) | (value & 0x0f);
}

function _get_io_rd74() {
  return (_RD >> 4) & 0xf;
}

function _set_io_rd74(value) {
  _RD = (_RD & 0x0f) | ((value << 4) & 0xf0);
}

function _get_io_sd30() {
  return _SD & 0xf;
}

function _set_io_sd30(value) {
  _SD = (_SD & 0xf0) | (value & 0x0f);
}

function _get_io_sd74() {
  return (_SD >> 4) & 0xf;
}

function _set_io_sd74(value) {
  _SD = (_SD & 0x0f) | ((value << 4) & 0xf0);
}

function _get_io_k0() {
  return _K0;
}

function _get_io_dfk0() {
  return _DFK0;
}

function _set_io_dfk0(value) {
  _DFK0 = value;
}

function _get_io_k1() {
  return _K1;
}

function _get_io_r0() {
  return _R0;
}

function _set_io_r0(value) {
  _R0 = value;
}

function _get_io_r1() {
  return _R1;
}

function _set_io_r1(value) {
  _R1 = value;
}

function _get_io_r2() {
  return _R2;
}

function _set_io_r2(value) {
  _R2 = value;
}

function _get_io_r3() {
  return _R3;
}

function _set_io_r3(value) {
  _R3 = value;
}

function _get_io_r4() {
  return _R4;
}

function _set_io_r4(value) {
  _R4 = value;
  if (value & IO_R43) {
    sound.set_buzzer_off();
  } else {
    sound.set_buzzer_on();
  }
}

function _get_io_p0() {
  return _P0;
}

function _set_io_p0(value) {
  _P0_OUTPUT_DATA = value;
  if (_IOC & IO_IOC0) {
    _P0 = value;
  }
}

function _get_io_p1() {
  return _P1;
}

function _set_io_p1(value) {
  _P1_OUTPUT_DATA = value;
  if (_IOC & IO_IOC1) {
    _P1 = value;
  }
}

function _get_io_p2() {
  return _P2;
}

function _set_io_p2(value) {
  _P2_OUTPUT_DATA = value;
  if (_IOC & IO_IOC2) {
    _P2 = value;
  }
}

function _get_io_p3() {
  return _P3;
}

function _set_io_p3(value) {
  _P3_OUTPUT_DATA = value;
  if (_IOC & IO_IOC3 || _p3_dedicated) {
    _P3 = value;
  }
}

function _get_io_ioc() {
  return _IOC;
}

function _set_io_ioc(value) {
  _IOC = value;
  if (_IOC & IO_IOC0) {
    _P0 = _P0_OUTPUT_DATA;
  }
  if (_IOC & IO_IOC1) {
    _P1 = _P1_OUTPUT_DATA;
  }
  if (_IOC & IO_IOC2) {
    _P2 = _P2_OUTPUT_DATA;
  }
  if (_IOC & IO_IOC3) {
    _P3 = _P3_OUTPUT_DATA;
  }
}

function _get_io_pup() {
  return _PUP;
}

function _set_io_pup(value) {
  _PUP = value;
}

function _get_io_ctrl_osc() {
  return _CTRL_OSC;
}

function _set_io_ctrl_osc(value) {
  _CTRL_OSC = value;
}

function _get_io_ctrl_lcd() {
  return _CTRL_LCD;
}

function _set_io_ctrl_lcd(value) {
  _CTRL_LCD = value;
}

function _get_io_lc() {
  return _LC;
}

function _set_io_lc(value) {
  _LC = value;
}

function _get_io_ctrl_svd() {
  return 0;
}

function _get_io_ctrl_bz1() {
  return _CTRL_BZ1;
}

function _set_io_ctrl_bz1(value) {
  _CTRL_BZ1 = value;
  sound.set_freq(_CTRL_BZ1 & IO_BZFQ);
}

function _get_io_ctrl_bz2() {
  const isOneShotRinging = sound.is_one_shot_ringing() ? 1 : 0;
  return (_CTRL_BZ2 & (IO_ENVRT | IO_ENVON)) | (IO_BZSHOT * isOneShotRinging);
}

function _set_io_ctrl_bz2(value) {
  _CTRL_BZ2 = value & (IO_ENVRT | IO_ENVON);

  const cycle = (value & IO_ENVRT) > 0 ? 1 : 0;
  sound.set_envelope_cycle(cycle);
  if (value & IO_BZSHOT) {
    const duration = (_CTRL_BZ1 & IO_SHOTPW) > 0 ? 1 : 0;
    sound.one_shot(duration);
  }
  if (value & IO_ENVON) {
    sound.set_envelope_on();
  } else {
    sound.set_envelope_off();
  }
  if (value & IO_ENVRST) {
    sound.reset_envelope();
  }
}

function _set_io_ctrl_tm(value) {
  if (value & IO_TMRST) {
    _TM = 0;
  }
}

function _get_io_ctrl_sw() {
  return _CTRL_SW & IO_SWRUN;
}

function _set_io_ctrl_sw(value) {
  if (value & IO_SWRST) {
    _SWL = _SWH = 0;
  }
  _CTRL_SW = value & IO_SWRUN;
}

function _get_io_ctrl_pt() {
  return _CTRL_PT & IO_PTRUN;
}

function _set_io_ctrl_pt(value) {
  if (value & IO_PTRST) {
    _PT = _RD;
  }
  _CTRL_PT = value & IO_PTRUN;
}

function _get_io_ptc() {
  return _PTC;
}

function _set_io_ptc(value) {
  _PTC = value;
}

export function pin_set(port, pin, level) {
  if (port === "K0") {
    const new_K0 = (~(1 << pin) & _K0) | (level << pin);

    if (_EIK0 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
      _IK0 |= IO_IK0;
    }

    if (
      pin === 3 &&
      (_PTC & IO_PTC) < 2 &&
      _DFK0 >> pin !== level &&
      _K0 >> pin !== level
    ) {
      _process_ptimer();
    }

    _K0 = new_K0;
  }
  if (port === "K1") {
    const new_K1 = (~(1 << pin) & _K1) | (level << pin);
    if (_EIK1 && level === 0 && _K1 >> pin !== level) {
      _IK1 |= IO_IK1;
    }
    _K1 = new_K1;
  } else if (port === "P0") {
    if (!(_IOC & IO_IOC0)) {
      _P0 = (~(1 << pin) & _P0) | (level << pin);
    }
  } else if (port === "P1") {
    if (!(_IOC & IO_IOC1)) {
      _P1 = (~(1 << pin) & _P1) | (level << pin);
    }
  } else if (port === "P2") {
    if (!(_IOC & IO_IOC2)) {
      _P2 = (~(1 << pin) & _P2) | (level << pin);
    }
  } else if (port === "P3") {
    if (!(_IOC & IO_IOC3) && !_p3_dedicated) {
      _P3 = (~(1 << pin) & _P3) | (level << pin);
    }
  } else if (port === "RES") {
    reset();
    _RESET = 1;
  }
}

export function pin_release(port, pin) {
  if (port === "K0") {
    const level = (_port_pullup.K0 >> pin) & 0x1;
    const new_K0 = (~(1 << pin) & _K0) | (level << pin);

    if (_EIK0 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
      _IK0 |= IO_IK0;
    }

    if (
      pin === 3 &&
      (_PTC & IO_PTC) < 2 &&
      _DFK0 >> pin !== level &&
      _K0 >> pin !== level
    ) {
      _process_ptimer();
    }

    _K0 = new_K0;
  }
  if (port === "K1") {
    const level = (_port_pullup.K1 >> pin) & 0x1;
    const new_K1 = (~(1 << pin) & _K1) | (level << pin);
    if (_EIK1 && level === 0 && _K1 >> pin !== level) {
      _IK1 |= IO_IK1;
    }
    _K1 = new_K1;
  } else if (port === "P0") {
    if (!(_IOC & IO_IOC0)) {
      _P0 = (~(1 << pin) & _P0) | (_PUP & IO_PUP0);
    }
  } else if (port === "P1") {
    if (!(_IOC & IO_IOC1)) {
      _P1 = (~(1 << pin) & _P1) | (_PUP & IO_PUP1);
    }
  } else if (port === "P2") {
    if (!(_IOC & IO_IOC2)) {
      _P2 = (~(1 << pin) & _P2) | (_PUP & IO_PUP2);
    }
  } else if (port === "P3") {
    if (!(_IOC & IO_IOC3) && !_p3_dedicated) {
      _P3 = (~(1 << pin) & _P3) | (_PUP & IO_PUP3);
    }
  } else if (port === "RES") {
    _RESET = 0;
  }
}

export function pc() {
  return _PC & 0x1fff;
}

export function get_VRAM() {
  if ((_CTRL_LCD & IO_ALOFF) | _RESET) {
    return EMPTY_VRAM;
  }
  if (_CTRL_LCD & IO_ALON) {
    return FULL_VRAM;
  }
  return _VRAM;
}

export function get_VRAM_words() {
  if ((_CTRL_LCD & IO_ALOFF) | _RESET) {
    return EMPTY_VRAM_WORDS;
  }
  if (_CTRL_LCD & IO_ALON) {
    return FULL_VRAM_WORDS;
  }
  return _VRAM_words;
}

export function get_ROM() {
  return _ROM;
}

function clock() {
  let exec_cycles = 7;

  if (_RESET) {
    return exec_cycles;
  }

  if (!_HALT) {
    _if_delay = false;
    //const s0 = Date.now();
    const opcode = _ROM.getOpcode(_PC);
    //const dt0 = Date.now() - s0;

    //const s1 = Date.now();
    const op = _execute[opcode];
    //const dt1 = Date.now() - s1;

    //const s = Date.now();
    exec_cycles = op(opcode);
    //const dt = Date.now() - s;
    //if (dt > 10) {
    //  console.log(op);
    //}
    //console.log(`getWord=${dt0}, at=${dt1}, exec=${dt}`);
  }

  //const is = Date.now();
  if (_IF && !_if_delay) {
    if (_IPT & _EIPT) {
      exec_cycles += _interrupt(0xc);
    } else if (_ISIO & _EISIO) {
      exec_cycles += _interrupt(0xa);
    } else if (_IK1) {
      exec_cycles += _interrupt(0x8);
    } else if (_IK0) {
      exec_cycles += _interrupt(0x6);
    } else if (_ISW & _EISW) {
      exec_cycles += _interrupt(0x4);
    } else if (_IT & _EIT) {
      exec_cycles += _interrupt(0x2);
    }
  }
  //const idt = Date.now() - is;

  //const os = Date.now();
  if (!(_CTRL_OSC & IO_CLKCHG)) {
    _clock_OSC1(exec_cycles);
    exec_cycles *= _OSC1_clock_div;
  } else {
    // IO_CLKCHG mode: CPU runs on high-frequency oscillator; OSC1 advances
    // fractionally per CPU cycle (~1/48). Track accumulated ticks with a
    // counter and fire _clock_OSC1() at most once per instruction.
    _OSC1_counter -= exec_cycles;
    while (_OSC1_counter <= 0) {
      _OSC1_counter += _OSC1_clock_div;
      _clock_OSC1(1);
    }
  }
  //const odt = Date.now() - os;
  //console.log(`interrupt=${idt}, osc1=${odt}`);

  return exec_cycles;
}

export function clockBatch(n) {
  for (let i = 0; i < n; i += 1) {
    clock();
  }
}

// Advance all OSC1-driven sub-systems by osc1Ticks ticks.
// Precondition: osc1Ticks must be smaller than every clock divisor (≥128)
// so each counter fires at most once. In practice osc1Ticks is either 1
// (IO_CLKCHG mode) or exec_cycles (5–12) in normal mode.
function _clock_OSC1(osc1Ticks) {
  sound.clockBatch(osc1Ticks);

  if ((_PTC & IO_PTC) > 1) {
    _ptimer_counter -= osc1Ticks;
    if (_ptimer_counter <= 0) {
      _ptimer_counter += PTIMER_CLOCK_DIV[_PTC & IO_PTC];
      _process_ptimer();
    }
  }

  _stopwatch_counter -= osc1Ticks;
  if (_stopwatch_counter <= 0) {
    _stopwatch_counter += STOPWATCH_CLOCK_DIV;
    _process_stopwatch();
  }

  _timer_counter -= osc1Ticks;
  if (_timer_counter <= 0) {
    _timer_counter += TIMER_CLOCK_DIV;
    _process_timer();
  }
}

function _process_ptimer() {
  _PT = (_PT - 1) & 0xff;
  if (_PT === 0) {
    _PT = _RD;
    _IPT |= IO_IPT;
  }
  if (_PTC & IO_PTCOUT) {
    _R3 ^= IO_R33;
  }
}

function _process_stopwatch() {
  if (_CTRL_SW & IO_SWRUN) {
    _SWL = (_SWL + 1) % 10;
    if (_SWL === 0) {
      _SWH = (_SWH + 1) % 10;
      _ISW |= IO_ISW1;
      if (_SWH === 0) {
        _ISW |= IO_ISW0;
      }
    }
  }
}

function _process_timer() {
  const new_TM = (_TM + 1) & 0xff;
  if ((new_TM & IO_TM2) < (_TM & IO_TM2)) {
    _IT |= IO_IT32;
  }
  if (((new_TM >> 4) & IO_TM4) < ((_TM >> 4) & IO_TM4)) {
    _IT |= IO_IT8;
  }
  if (((new_TM >> 4) & IO_TM6) < ((_TM >> 4) & IO_TM6)) {
    _IT |= IO_IT2;
  }
  if (((new_TM >> 4) & IO_TM7) < ((_TM >> 4) & IO_TM7)) {
    _IT |= IO_IT1;
  }
  _TM = new_TM;
}

function _interrupt(vector) {
  set_mem((_SP - 1) & 0xff, (_PC >> 8) & 0x0f);
  set_mem((_SP - 2) & 0xff, (_PC >> 4) & 0x0f);
  _SP = (_SP - 3) & 0xff;
  set_mem(_SP, _PC & 0x0f);
  _IF = 0;
  _HALT = 0;
  _PC = _NPC = (_NPC & 0x1000) | 0x0100 | vector;
  return 13;
}

export function get_mem(addr) {
  if (addr < RAM_SIZE) {
    return _RAM[addr];
  }

  if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
    return _VRAM[addr - VRAM_PART1_OFFSET];
  }

  if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
    return _VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE];
  }

  if (addr >= IORAM_OFFSET && addr < IORAM_END) {
    const io = _io_tbl[addr - IORAM_OFFSET];
    if (io) {
      return io[0]();
    }
  }

  return 0;
}

export function set_mem(addr, value) {
  if (addr < RAM_SIZE) {
    _RAM[addr] = value & 0xf;
  } else if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
    _VRAM[addr - VRAM_PART1_OFFSET] = value & 0xf;
  } else if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
    _VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE] = value & 0xf;
  } else if (addr >= IORAM_OFFSET && addr < IORAM_END) {
    const io = _io_tbl[addr - IORAM_OFFSET];
    if (io) {
      io[1](value);
    }
  }
}

export function get_A() {
  return _A;
}

export function set_A(value) {
  _A = value & 0xf;
}

export function get_B() {
  return _B;
}

export function set_B(value) {
  _B = value & 0xf;
}

export function get_MX() {
  return get_mem(_IX);
}

export function set_MX(value) {
  set_mem(_IX, value);
}

export function get_MY() {
  return get_mem(_IY);
}

export function set_MY(value) {
  set_mem(_IY, value);
}

function _jp_s(opcode) {
  // PCB←NBP, PCP←NPP, PCS←s7~s0
  _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  return 5;
}

function _retd_l(opcode) {
  // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP←SP+3, M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
  _PC = _NPC =
    (_PC & 0x1000) | (_RAM[_SP + 2] << 8) | (_RAM[_SP + 1] << 4) | _RAM[_SP];
  _SP = (_SP + 3) & 0xff;
  set_mem(_IX, opcode & 0x00f);
  set_mem((_IX & 0xf00) | ((_IX + 1) & 0xff), (opcode >> 4) & 0x00f);
  _IX = (_IX & 0xf00) | ((_IX + 2) & 0xff);
  return 12;
}

function _jp_c_s(opcode) {
  // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=1
  if (_CF) {
    _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  } else {
    _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  }

  return 5;
}

function _jp_nc_s(opcode) {
  // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=0
  if (!_CF) {
    _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  } else {
    _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  }

  return 5;
}

function _call_s(opcode) {
  // M(SP-1) ←PCP, M(SP-2) ←PCSH, M(SP-3) ←PCSL+1 SP←SP-3, PCP←NPP, PCS←s7~s0
  set_mem((_SP - 1) & 0xff, ((_PC + 1) >> 8) & 0x0f);
  set_mem((_SP - 2) & 0xff, ((_PC + 1) >> 4) & 0x0f);
  _SP = (_SP - 3) & 0xff;
  set_mem(_SP, (_PC + 1) & 0x0f);
  _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  return 7;
}

function _calz_s(opcode) {
  // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP ← SP-3, PCP ← 0, PCS ← s7~s0
  set_mem((_SP - 1) & 0xff, ((_PC + 1) >> 8) & 0x0f);
  set_mem((_SP - 2) & 0xff, ((_PC + 1) >> 4) & 0x0f);
  _SP = (_SP - 3) & 0xff;
  set_mem(_SP, (_PC + 1) & 0x0f);
  _PC = _NPC = (_NPC & 0x1000) | (opcode & 0x0ff);
  return 7;
}

function _jp_z_s(opcode) {
  // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=1
  if (_ZF) {
    _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  } else {
    _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  }
  return 5;
}

function _jp_nz_s(opcode) {
  // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=0
  if (!_ZF) {
    _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
  } else {
    _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  }
  return 5;
}

function _ld_y_y(opcode) {
  // YH ← y7~y4, YL ← y3~y0
  _IY = (_IY & 0xf00) | (opcode & 0x0ff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _lbpx_mx_l(opcode) {
  // M(X)←l3~l0, M(X+1)← l7~l4, X←X+2
  set_mem(_IX, opcode & 0x00f);
  set_mem((_IX & 0xf00) | ((_IX + 1) & 0xff), (opcode >> 4) & 0x00f);
  _IX = (_IX & 0xf00) | ((_IX + 2) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _adc_xh_i(opcode) {
  // XH← XH+i3~i0+C
  const xh = ((_IX >> 4) & 0x00f) + (opcode & 0x00f) + _CF;
  _ZF = (xh & 0xf) === 0 ? 1 : 0;
  _CF = xh > 15 ? 1 : 0;
  _IX = (_IX & 0xf0f) | ((xh << 4) & 0x0f0);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _adc_xl_i(opcode) {
  // XL ← XL+i3~i0+C
  const xl = (_IX & 0x00f) + (opcode & 0x00f) + _CF;
  _ZF = (xl & 0xf) === 0 ? 1 : 0;
  _CF = xl > 15 ? 1 : 0;
  _IX = (_IX & 0xff0) | (xl & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _adc_yh_i(opcode) {
  // YH← YH+i3~i0+C
  const yh = ((_IY >> 4) & 0x00f) + (opcode & 0x00f) + _CF;
  _ZF = (yh & 0xf) === 0 ? 1 : 0;
  _CF = yh > 15 ? 1 : 0;
  _IY = (_IY & 0xf0f) | ((yh << 4) & 0x0f0);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _adc_yl_i(opcode) {
  // YL ← YL+i3~i0+C
  const yl = (_IY & 0x00f) + (opcode & 0x00f) + _CF;
  _ZF = (yl & 0xf) === 0 ? 1 : 0;
  _CF = yl > 15 ? 1 : 0;
  _IY = (_IY & 0xff0) | (yl & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _cp_xh_i(opcode) {
  // XH-i3~i0
  const cp = ((_IX >> 4) & 0x00f) - (opcode & 0x00f);
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _cp_xl_i(opcode) {
  // XL-i3~i0
  const cp = (_IX & 0x00f) - (opcode & 0x00f);
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _cp_yh_i(opcode) {
  // YH-i3~i0
  const cp = ((_IY >> 4) & 0x00f) - (opcode & 0x00f);
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _cp_yl_i(opcode) {
  // YL-i3~i0
  const cp = (_IY & 0x00f) - (opcode & 0x00f);
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _add_r_q(opcode) {
  // r←r+q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() + _get_abmxmy_tbl[q]();
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _adc_r_q(opcode) {
  // r ← r+q+C
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() + _get_abmxmy_tbl[q]() + _CF;
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _sub_r_q(opcode) {
  // r←r-q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() - _get_abmxmy_tbl[q]();
  _CF = (res < 0) | 0;
  if (_DF && res < 0) {
    res += 10;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _sbc_r_q(opcode) {
  // r ← r-q-C
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() - _get_abmxmy_tbl[q]() - _CF;
  _CF = (res < 0) | 0;
  if (_DF && res < 0) {
    res += 10;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _and_r_q(opcode) {
  // r←r && q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() & _get_abmxmy_tbl[q]();
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _or_r_q(opcode) {
  // r←r or q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() | _get_abmxmy_tbl[q]();
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _xor_r_q(opcode) {
  // r←r xor q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  let res = _get_abmxmy_tbl[r]() ^ _get_abmxmy_tbl[q]();
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _rlc_r(opcode) {
  // d3 ←d2, d2 ←d1, d1 ←d0, d0 ←C, C← d3
  const r = opcode & 0x3;
  const res = (_get_abmxmy_tbl[r]() << 1) + _CF;
  _CF = (res > 15) | 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _ld_x_x(opcode) {
  // XH ← x7~x4, XL ← x3~x0
  _IX = (_IX & 0xf00) | (opcode & 0x0ff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _add_r_i(opcode) {
  // r ← r+i3~i0
  const r = (opcode >> 4) & 0x3;
  let res = _get_abmxmy_tbl[r]() + (opcode & 0x00f);
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _adc_r_i(opcode) {
  // r ← r+i3~i0+C
  const r = (opcode >> 4) & 0x3;
  let res = _get_abmxmy_tbl[r]() + (opcode & 0x00f) + _CF;
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _and_r_i(opcode) {
  // r ← r && i3~i0
  const r = (opcode >> 4) & 0x3;
  const res = _get_abmxmy_tbl[r]() & opcode & 0x00f;
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _or_r_i(opcode) {
  // r ← r   i3~i0
  const r = (opcode >> 4) & 0x3;
  const res = _get_abmxmy_tbl[r]() | (opcode & 0x00f);
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _xor_r_i(opcode) {
  // r ← r i3~i0
  const r = (opcode >> 4) & 0x3;
  const res = _get_abmxmy_tbl[r]() ^ (opcode & 0x00f);
  _ZF = res === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _sbc_r_i(opcode) {
  // r ← r-i3~i0-C
  const r = (opcode >> 4) & 0x3;
  let res = _get_abmxmy_tbl[r]() - (opcode & 0x00f) - _CF;
  _CF = (res < 0) | 0;
  if (_DF && _CF) {
    res += 10;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  _set_abmxmy_tbl[r](res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _fan_r_i(opcode) {
  // r && i3~i0
  const r = (opcode >> 4) & 0x3;
  _ZF = (_get_abmxmy_tbl[r]() & opcode & 0x00f) === 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _cp_r_i(opcode) {
  // r-i3~i0
  const r = (opcode >> 4) & 0x3;
  const cp = _get_abmxmy_tbl[r]() - (opcode & 0x00f);
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _ld_r_i(opcode) {
  // r ← i3~i0
  const r = (opcode >> 4) & 0x3;
  _set_abmxmy_tbl[r](opcode & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pset_p(opcode) {
  // NBP ←p4, NPP ← p3~p0
  _if_delay = true;
  _NPC = (opcode << 8) & 0x1f00;
  _PC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ldpx_mx_i(opcode) {
  // M(X) ← i3~i0, X ← X+1
  set_mem(_IX, opcode & 0x00f);
  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ldpy_my_i(opcode) {
  // M(Y) ← i3~i0, Y ← Y+1
  set_mem(_IY, opcode & 0x00f);
  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_xp_r(opcode) {
  // XP ← r
  const r = opcode & 0x3;
  _IX = (_get_abmxmy_tbl[r]() << 8) | (_IX & 0x0ff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_xh_r(opcode) {
  // XH← r
  const r = opcode & 0x3;
  _IX = (_get_abmxmy_tbl[r]() << 4) | (_IX & 0xf0f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_xl_r(opcode) {
  // XL←r
  const r = opcode & 0x3;
  _IX = _get_abmxmy_tbl[r]() | (_IX & 0xff0);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _rrc_r(opcode) {
  // d3 ←C, d2 ←d3, d1 ←d2, d0 ←d1, C← d0
  const r = opcode & 0x3;
  const res = _get_abmxmy_tbl[r]() + (_CF << 4);
  _CF = res & 0x1;
  _set_abmxmy_tbl[r](res >> 1);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_yp_r(opcode) {
  // YP ← r
  const r = opcode & 0x3;
  _IY = (_get_abmxmy_tbl[r]() << 8) | (_IY & 0x0ff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_yh_r(opcode) {
  // YH← r
  const r = opcode & 0x3;
  _IY = (_get_abmxmy_tbl[r]() << 4) | (_IY & 0xf0f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_yl_r(opcode) {
  // YL←r
  const r = opcode & 0x3;
  _IY = _get_abmxmy_tbl[r]() | (_IY & 0xff0);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _dummy(/*opcode*/) {
  return 5;
}

function _ld_r_xp(opcode) {
  // r←XP
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_IX >> 8);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_xh(opcode) {
  // r←XH
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r]((_IX >> 4) & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_xl(opcode) {
  // r←XL
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_IX & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_yp(opcode) {
  // r←YP
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_IY >> 8);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_yh(opcode) {
  // r←YH
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r]((_IY >> 4) & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_yl(opcode) {
  // r←YL
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_IY & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_q(opcode) {
  // r←q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  _set_abmxmy_tbl[r](_get_abmxmy_tbl[q]());
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ldpx_r_q(opcode) {
  // r←q, X←X+1
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  _set_abmxmy_tbl[r](_get_abmxmy_tbl[q]());
  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ldpy_r_q(opcode) {
  // r←q, Y←Y+1
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  _set_abmxmy_tbl[r](_get_abmxmy_tbl[q]());
  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _cp_r_q(opcode) {
  // r-q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  const cp = _get_abmxmy_tbl[r]() - _get_abmxmy_tbl[q]();
  _ZF = cp === 0 ? 1 : 0;
  _CF = cp < 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _fan_r_q(opcode) {
  // r && q
  const r = (opcode >> 2) & 0x3;
  const q = opcode & 0x3;
  _ZF = (_get_abmxmy_tbl[r]() & _get_abmxmy_tbl[q]()) === 0 ? 1 : 0;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _acpx_mx_r(opcode) {
  // M(X) ← M(X)+r+C, X ← X+1
  const r = opcode & 0x3;
  let res = get_mem(_IX) + _get_abmxmy_tbl[r]() + _CF;
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  set_mem(_IX, res & 0xf);
  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _acpy_my_r(opcode) {
  // M(Y) ← M(Y)+r+C, Y ← Y+1
  const r = opcode & 0x3;
  let res = get_mem(_IY) + _get_abmxmy_tbl[r]() + _CF;
  _CF = (res > 15) | 0;
  if (_DF && res > 9) {
    res += 6;
    _CF = 1;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  set_mem(_IY, res & 0xf);
  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _scpx_mx_r(opcode) {
  //  M(X) ← M(X)-r-C, X ← X+1
  const r = opcode & 0x3;
  let res = get_mem(_IX) - _get_abmxmy_tbl[r]() - _CF;
  _CF = (res < 0) | 0;
  if (_DF && res < 0) {
    res += 10;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  set_mem(_IX, res & 0xf);
  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _scpy_my_r(opcode) {
  // M(Y) ← M(Y)-r-C, Y ← Y+1
  const r = opcode & 0x3;
  let res = get_mem(_IY) - _get_abmxmy_tbl[r]() - _CF;
  _CF = (res < 0) | 0;
  if (_DF && res < 0) {
    res += 10;
  }
  _ZF = (res & 0xf) === 0 ? 1 : 0;
  set_mem(_IY, res & 0xf);
  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _set_f_i(opcode) {
  // F ← F or i3~i0
  _CF |= opcode & 0x001;
  _ZF |= (opcode >> 1) & 0x001;
  _DF |= (opcode >> 2) & 0x001;
  const new_IF = (opcode >> 3) & 0x001;
  _if_delay = new_IF && !_IF;
  _IF |= new_IF;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _rst_f_i(opcode) {
  // F ← F   i3~i0
  _CF &= opcode;
  _ZF &= opcode >> 1;
  _DF &= opcode >> 2;
  _IF &= opcode >> 3;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _inc_mn(opcode) {
  // M(n3~n0) ←M(n3~n0)+1
  const mn = opcode & 0x00f;
  const res = get_mem(mn) + 1;
  _ZF = res === 16 ? 1 : 0;
  _CF = (res > 15) | 0;
  set_mem(mn, res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _dec_mn(opcode) {
  // M(n3~n0) ←M(n3~n0)-1
  const mn = opcode & 0x00f;
  const res = get_mem(mn) - 1;
  _ZF = res === 0 ? 1 : 0;
  _CF = (res < 0) | 0;
  set_mem(mn, res & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

function _ld_mn_a(opcode) {
  // M(n3~n0) ← A
  set_mem(opcode & 0x00f, _A & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_mn_b(opcode) {
  // M(n3~n0) ← B
  set_mem(opcode & 0x00f, _B & 0xf);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_a_mn(opcode) {
  // A ← M(n3~n0)
  _A = get_mem(opcode & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_b_mn(opcode) {
  // B ← M(n3~n0)
  _B = get_mem(opcode & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_r(opcode) {
  // SP← SP-1, M(SP)←r
  const r = opcode & 0x3;
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, _get_abmxmy_tbl[r]());
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_xp(/*opcode*/) {
  // SP ← SP-1, M(SP) ← XP
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, _IX >> 8);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_xh(/*opcode*/) {
  // SP ← SP-1, M(SP) ← XH
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, (_IX >> 4) & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_xl(/*opcode*/) {
  // SP ← SP-1, M(SP) ← XL
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, _IX & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_yp(/*opcode*/) {
  // SP ← SP-1, M(SP) ← YP
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, _IY >> 8);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_yh(/*opcode*/) {
  // SP ← SP-1, M(SP) ← YH
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, (_IY >> 4) & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_yl(/*opcode*/) {
  // SP ← SP-1, M(SP) ← YL
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, _IY & 0x00f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _push_f(/*opcode*/) {
  // SP← SP-1, M(SP)←F
  _SP = (_SP - 1) & 0xff;
  set_mem(_SP, (_IF << 3) | (_DF << 2) | (_ZF << 1) | _CF);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _dec_sp(/*opcode*/) {
  // SP← SP-1
  _SP = (_SP - 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_r(opcode) {
  // r←M(SP), SP←SP+1
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](get_mem(_SP));
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_xp(/*opcode*/) {
  // XP ← M(SP), SP ← SP+1
  _IX = (get_mem(_SP) << 8) | (_IX & 0x0ff);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_xh(/*opcode*/) {
  // XH← M(SP), SP ← SP+1
  _IX = (get_mem(_SP) << 4) | (_IX & 0xf0f);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_xl(/*opcode*/) {
  // XL ← M(SP), SP ← SP+1
  _IX = get_mem(_SP) | (_IX & 0xff0);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_yp(/*opcode*/) {
  // YP ← M(SP), SP ← SP+1
  _IY = (get_mem(_SP) << 8) | (_IY & 0x0ff);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_yh(/*opcode*/) {
  // YH← M(SP), SP ← SP+1
  _IY = (get_mem(_SP) << 4) | (_IY & 0xf0f);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_yl(/*opcode*/) {
  // YL ← M(SP), SP ← SP+1
  _IY = get_mem(_SP) | (_IY & 0xff0);
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _pop_f(/*opcode*/) {
  // F←M(SP), SP←SP+1
  const f = get_mem(_SP);
  _CF = f & 0x1;
  _ZF = (f >> 1) & 0x1;
  _DF = (f >> 2) & 0x1;
  const new_IF = (f >> 3) & 0x1;
  _if_delay = new_IF && !_IF;
  _IF = new_IF;
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _inc_sp(/*opcode*/) {
  // SP← SP+1
  _SP = (_SP + 1) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _rets(/*opcode*/) {
  // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP←SP+3, PC←PC+1
  _PC =
    (_PC & 0x1000) |
    get_mem(_SP) |
    (get_mem(_SP + 1) << 4) |
    (get_mem(_SP + 2) << 8);
  _SP = (_SP + 3) & 0xff;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 12;
}

function _ret(/*opcode*/) {
  // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP ← SP+3
  _PC = _NPC =
    (_PC & 0x1000) |
    get_mem(_SP) |
    (get_mem(_SP + 1) << 4) |
    (get_mem(_SP + 2) << 8);
  _SP = (_SP + 3) & 0xff;
  return 7;
}

function _ld_sph_r(opcode) {
  //  SPH←r
  const r = opcode & 0x3;
  _SP = (_get_abmxmy_tbl[r]() << 4) | (_SP & 0x0f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_sph(opcode) {
  // r←SPH
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_SP >> 4);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _jpba(/*opcode*/) {
  // PCB←NBP, PCP←NPP, PCSH←B, PCSL ←A
  _PC = (_NPC & 0x1f00) | (_B << 4) | _A;
  return 5;
}

function _ld_spl_r(opcode) {
  // SPL ← r
  const r = opcode & 0x3;
  _SP = _get_abmxmy_tbl[r]() | (_SP & 0xf0);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _ld_r_spl(opcode) {
  const r = opcode & 0x3;
  _set_abmxmy_tbl[r](_SP & 0x0f);
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _halt(/*opcode*/) {
  // Halt (stop clock)
  _HALT = 1;
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5; // 1 1 1 1  1 1 1 1  1 0 0 0                          5
}

function _nop5(/*opcode*/) {
  // No operation (5 clock cycles)
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 5;
}

function _nop7(/*opcode*/) {
  // No operation (7 clock cycles)
  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
  return 7;
}

export function get_NPC() {
  return _NPC;
}

export function get_SP() {
  return _SP;
}

export function get_IX() {
  return _IX;
}

export function get_IY() {
  return _IY;
}
