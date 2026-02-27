import { RLEArrayBuilder } from "./rle-array";
import { Sound } from "./sound";

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
const FULL_VRAM = new Uint8Array(VRAM_SIZE).fill(1);

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

// E0C6200
export class CPU {
  constructor(rom, clock, toneGenerator) {
    this._ROM = rom;
    this._sound = new Sound(OSC1_CLOCK, toneGenerator);

    this._port_pullup = mask.port_pullup;

    this._p3_dedicated = mask.p3_dedicated;

    this._initRegisters();

    this._OSC1_clock_div = clock / OSC1_CLOCK;

    this._OSC1_counter = 0;
    this._timer_counter = 0;
    this._ptimer_counter = 0;
    this._stopwatch_counter = 0;
    this._execution_counter = 0;
    this._instr_counter = 0;

    this._if_delay = false;

    this._RESET = 0;

    const get_io_dummy = this._get_io_dummy.bind(this);
    const set_io_dummy = this._set_io_dummy.bind(this);
    this._io_tbl = {
      0xf00: [this._get_io_it.bind(this), set_io_dummy],
      0xf01: [this._get_io_isw.bind(this), set_io_dummy],
      0xf02: [this._get_io_ipt.bind(this), set_io_dummy],
      0xf03: [this._get_io_isio.bind(this), set_io_dummy],
      0xf04: [this._get_io_ik0.bind(this), set_io_dummy],
      0xf05: [this._get_io_ik1.bind(this), set_io_dummy],
      0xf10: [this._get_io_eit.bind(this), this._set_io_eit.bind(this)],
      0xf11: [this._get_io_eisw.bind(this), this._set_io_eisw.bind(this)],
      0xf12: [this._get_io_eipt.bind(this), this._set_io_eipt.bind(this)],
      0xf13: [this._get_io_eisio.bind(this), this._set_io_eisio.bind(this)],
      0xf14: [this._get_io_eik0.bind(this), this._set_io_eik0.bind(this)],
      0xf15: [this._get_io_eik1.bind(this), this._set_io_eik1.bind(this)],
      0xf20: [this._get_io_tm30.bind(this), set_io_dummy],
      0xf21: [this._get_io_tm74.bind(this), set_io_dummy],
      0xf22: [this._get_io_swl.bind(this), set_io_dummy],
      0xf23: [this._get_io_swh.bind(this), set_io_dummy],
      0xf24: [this._get_io_pt30.bind(this), set_io_dummy],
      0xf25: [this._get_io_pt74.bind(this), set_io_dummy],
      0xf26: [this._get_io_rd30.bind(this), this._set_io_rd30.bind(this)],
      0xf27: [this._get_io_rd74.bind(this), this._set_io_rd74.bind(this)],
      0xf30: [this._get_io_sd30.bind(this), this._set_io_sd30.bind(this)],
      0xf31: [this._get_io_sd74.bind(this), this._set_io_sd74.bind(this)],
      0xf40: [this._get_io_k0.bind(this), set_io_dummy],
      0xf41: [this._get_io_dfk0.bind(this), set_io_dummy],
      0xf42: [this._get_io_k1.bind(this), set_io_dummy],
      0xf50: [this._get_io_r0.bind(this), this._set_io_r0.bind(this)],
      0xf51: [this._get_io_r1.bind(this), this._set_io_r1.bind(this)],
      0xf52: [this._get_io_r2.bind(this), this._set_io_r2.bind(this)],
      0xf53: [this._get_io_r3.bind(this), this._set_io_r3.bind(this)],
      0xf54: [this._get_io_r4.bind(this), this._set_io_r4.bind(this)],

      0xf60: [this._get_io_p0.bind(this), this._set_io_p0.bind(this)],
      0xf61: [this._get_io_p1.bind(this), this._set_io_p1.bind(this)],
      0xf62: [this._get_io_p2.bind(this), this._set_io_p2.bind(this)],
      0xf63: [this._get_io_p3.bind(this), this._set_io_p3.bind(this)],

      0xf70: [
        this._get_io_ctrl_osc.bind(this),
        this._set_io_ctrl_osc.bind(this),
      ], //to-do
      0xf71: [
        this._get_io_ctrl_lcd.bind(this),
        this._set_io_ctrl_lcd.bind(this),
      ],
      0xf72: [this._get_io_lc.bind(this), this._set_io_lc.bind(this)],
      0xf73: [this._get_io_ctrl_svd.bind(this), set_io_dummy], //to-do
      0xf74: [
        this._get_io_ctrl_bz1.bind(this),
        this._set_io_ctrl_bz1.bind(this),
      ], //to-do
      0xf75: [
        this._get_io_ctrl_bz2.bind(this),
        this._set_io_ctrl_bz2.bind(this),
      ], //to-do
      0xf76: [get_io_dummy, this._set_io_ctrl_tm.bind(this)],
      0xf77: [this._get_io_ctrl_sw.bind(this), this._set_io_ctrl_sw.bind(this)],
      0xf78: [this._get_io_ctrl_pt.bind(this), this._set_io_ctrl_pt.bind(this)],
      0xf79: [this._get_io_ptc.bind(this), this._set_io_ptc.bind(this)],
      0xf7a: [get_io_dummy, set_io_dummy], //to-do
      0xf7b: [get_io_dummy, set_io_dummy], //to-do
      0xf7d: [this._get_io_ioc.bind(this), this._set_io_ioc.bind(this)],
      0xf7e: [this._get_io_pup.bind(this), this._set_io_pup.bind(this)],
    };

    this._get_abmxmy_tbl = [
      this.get_A.bind(this),
      this.get_B.bind(this),
      this.get_MX.bind(this),
      this.get_MY.bind(this),
    ];

    this._set_abmxmy_tbl = [
      this.set_A.bind(this),
      this.set_B.bind(this),
      this.set_MX.bind(this),
      this.set_MY.bind(this),
    ];

    this._execute = new RLEArrayBuilder()
      .push(256, this._jp_s.bind(this)) //0 0 0 0  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._retd_l.bind(this)) //0 0 0 1  l7 l6 l5 l4  l3 l2 l1 l0
      .push(256, this._jp_c_s.bind(this)) //0 0 1 0  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._jp_nc_s.bind(this)) //0 0 1 1  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._call_s.bind(this)) //0 1 0 0  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._calz_s.bind(this)) //0 1 0 1  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._jp_z_s.bind(this)) //0 1 1 0  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._jp_nz_s.bind(this)) //0 1 1 1  s7 s6 s5 s4  s3 s2 s1 s0
      .push(256, this._ld_y_y.bind(this)) //1 0 0 0  y7 y6 y5 y4  y3 y2 y1 y0
      .push(256, this._lbpx_mx_l.bind(this)) //1 0 0 1  l7 l6 l5 l4  l3 l2 l1 l0
      .push(16, this._adc_xh_i.bind(this)) //1 0 1 0  0 0 0 0  i3 i2 i1 i0
      .push(16, this._adc_xl_i.bind(this)) //1 0 1 0  0 0 0 1  i3 i2 i1 i0
      .push(16, this._adc_yh_i.bind(this)) //1 0 1 0  0 0 1 0  i3 i2 i1 i0
      .push(16, this._adc_yl_i.bind(this)) //1 0 1 0  0 0 1 1  i3 i2 i1 i0
      .push(16, this._cp_xh_i.bind(this)) //1 0 1 0  0 1 0 0  i3 i2 i1 i0
      .push(16, this._cp_xl_i.bind(this)) //1 0 1 0  0 1 0 1  i3 i2 i1 i0
      .push(16, this._cp_yh_i.bind(this)) //1 0 1 0  0 1 1 0  i3 i2 i1 i0
      .push(16, this._cp_yl_i.bind(this)) //1 0 1 0  0 1 1 1  i3 i2 i1 i0
      .push(16, this._add_r_q.bind(this)) //1 0 1 0  1 0 0 0  r1 r0 q1 q0
      .push(16, this._adc_r_q.bind(this)) //1 0 1 0  1 0 0 1  r1 r0 q1 q0
      .push(16, this._sub_r_q.bind(this)) //1 0 1 0  1 0 1 0  r1 r0 q1 q0
      .push(16, this._sbc_r_q.bind(this)) //1 0 1 0  1 0 1 1  r1 r0 q1 q0
      .push(16, this._and_r_q.bind(this)) //1 0 1 0  1 1 0 0  r1 r0 q1 q0
      .push(16, this._or_r_q.bind(this)) //1 0 1 0  1 1 0 1  r1 r0 q1 q0
      .push(16, this._xor_r_q.bind(this)) //1 0 1 0  1 1 1 0  r1 r0 q1 q0
      .push(16, this._rlc_r.bind(this)) //1 0 1 0  1 1 1 1  r1 r0 r1 r0
      .push(256, this._ld_x_x.bind(this)) //1 0 1 1  x7 x6 x5 x4  x3 x2 x1 x0
      .push(64, this._add_r_i.bind(this)) //1 1 0 0  0 0 r1 r0  i3 i2 i1 i0
      .push(64, this._adc_r_i.bind(this)) //1 1 0 0  0 1 r1 r0  i3 i2 i1 i0
      .push(64, this._and_r_i.bind(this)) //1 1 0 0  1 0 r1 r0  i3 i2 i1 i0
      .push(64, this._or_r_i.bind(this)) //1 1 0 0  1 1 r1 r0  i3 i2 i1 i0
      .push(64, this._xor_r_i.bind(this)) //1 1 0 1  0 0 r1 r0  i3 i2 i1 i0
      .push(64, this._sbc_r_i.bind(this)) //1 1 0 1  0 1 r1 r0  i3 i2 i1 i0
      .push(64, this._fan_r_i.bind(this)) //1 1 0 1  1 0 r1 r0  i3 i2 i1 i0
      .push(64, this._cp_r_i.bind(this)) //1 1 0 1  1 1 r1 r0  i3 i2 i1 i0
      .push(64, this._ld_r_i.bind(this)) //1 1 1 0  0 0 r1 r0  i3 i2 i1 i0
      .push(32, this._pset_p.bind(this)) //1 1 1 0  0 1 0 p4  p3 p2 p1 p0
      .push(16, this._ldpx_mx_i.bind(this)) //1 1 1 0  0 1 1 0  i3 i2 i1 i0
      .push(16, this._ldpy_my_i.bind(this)) //1 1 1 0  0 1 1 1  i3 i2 i1 i0
      .push(4, this._ld_xp_r.bind(this)) //1 1 1 0  1 0 0 0  0 0 r1 r0
      .push(4, this._ld_xh_r.bind(this)) //1 1 1 0  1 0 0 0  0 1 r1 r0
      .push(4, this._ld_xl_r.bind(this)) //1 1 1 0  1 0 0 0  1 0 r1 r0
      .push(4, this._rrc_r.bind(this)) //1 1 1 0  1 0 0 0  1 1 r1 r0
      .push(4, this._ld_yp_r.bind(this)) //1 1 1 0  1 0 0 1  0 0 r1 r0
      .push(4, this._ld_yh_r.bind(this)) //1 1 1 0  1 0 0 1  0 1 r1 r0
      .push(4, this._ld_yl_r.bind(this)) //1 1 1 0  1 0 0 1  1 0 r1 r0
      .push(4, this._dummy.bind(this))
      .push(4, this._ld_r_xp.bind(this)) //1 1 1 0  1 0 1 0  0 0 r1 r0
      .push(4, this._ld_r_xh.bind(this)) //1 1 1 0  1 0 1 0  0 1 r1 r0
      .push(4, this._ld_r_xl.bind(this)) //1 1 1 0  1 0 1 0  1 0 r1 r0
      .push(4, this._dummy.bind(this))
      .push(4, this._ld_r_yp.bind(this)) //1 1 1 0  1 0 1 1  0 0 r1 r0
      .push(4, this._ld_r_yh.bind(this)) //1 1 1 0  1 0 1 1  0 1 r1 r0
      .push(4, this._ld_r_yl.bind(this)) //1 1 1 0  1 0 1 1  1 0 r1 r0
      .push(4, this._dummy.bind(this))
      .push(16, this._ld_r_q.bind(this)) //1 1 1 0  1 1 0 0  r1 r0 q1 q0
      .push(16, this._dummy.bind(this))
      .push(16, this._ldpx_r_q.bind(this)) //1 1 1 0  1 1 1 0  r1 r0 q1 q0
      .push(16, this._ldpy_r_q.bind(this)) //1 1 1 0  1 1 1 1  r1 r0 q1 q0
      .push(16, this._cp_r_q.bind(this)) //1 1 1 1  0 0 0 0  r1 r0 q1 q0
      .push(16, this._fan_r_q.bind(this)) //1 1 1 1  0 0 0 1  r1 r0 q1 q0
      .push(8, this._dummy.bind(this))
      .push(4, this._acpx_mx_r.bind(this)) //1 1 1 1  0 0 1 0  1 0 r1 r0
      .push(4, this._acpy_my_r.bind(this)) //1 1 1 1  0 0 1 0  1 1 r1 r0
      .push(8, this._dummy.bind(this))
      .push(4, this._scpx_mx_r.bind(this)) //1 1 1 1  0 0 1 1  1 0 r1 r0
      .push(4, this._scpy_my_r.bind(this)) //1 1 1 1  0 0 1 1  1 1 r1 r0
      .push(16, this._set_f_i.bind(this)) //1 1 1 1  0 1 0 0  i3 i2 i1 i0
      .push(16, this._rst_f_i.bind(this)) //1 1 1 1  0 1 0 1  i3 i2 i1 i0
      .push(16, this._inc_mn.bind(this)) //1 1 1 1  0 1 1 0  n3 n2 n1 n0
      .push(16, this._dec_mn.bind(this)) //1 1 1 1  0 1 1 1  n3 n2 n1 n0
      .push(16, this._ld_mn_a.bind(this)) //1 1 1 1  1 0 0 0  n3 n2 n1 n0
      .push(16, this._ld_mn_b.bind(this)) //1 1 1 1  1 0 0 1  n3 n2 n1 n0
      .push(16, this._ld_a_mn.bind(this)) //1 1 1 1  1 0 1 0  n3 n2 n1 n0
      .push(16, this._ld_b_mn.bind(this)) //1 1 1 1  1 0 1 1  n3 n2 n1 n0
      .push(4, this._push_r.bind(this)) //1 1 1 1  1 1 0 0  0 0 r1 r0
      .push(1, this._push_xp.bind(this)) //1 1 1 1  1 1 0 0  0 1 0 0
      .push(1, this._push_xh.bind(this)) //1 1 1 1  1 1 0 0  0 1 0 1
      .push(1, this._push_xl.bind(this)) //1 1 1 1  1 1 0 0  0 1 1 0
      .push(1, this._push_yp.bind(this)) //1 1 1 1  1 1 0 0  0 1 1 1
      .push(1, this._push_yh.bind(this)) //1 1 1 1  1 1 0 0  1 0 0 0
      .push(1, this._push_yl.bind(this)) //1 1 1 1  1 1 0 0  1 0 0 1
      .push(1, this._push_f.bind(this)) //1 1 1 1  1 1 0 0  1 0 1 0
      .push(1, this._dec_sp.bind(this)) //1 1 1 1  1 1 0 0  1 0 1 1
      .push(4, this._dummy.bind(this))
      .push(4, this._pop_r.bind(this)) //1 1 1 1  1 1 0 1  0 0 r1 r0
      .push(1, this._pop_xp.bind(this)) //1 1 1 1  1 1 0 1  0 1 0 0
      .push(1, this._pop_xh.bind(this)) //1 1 1 1  1 1 0 1  0 1 0 1
      .push(1, this._pop_xl.bind(this)) //1 1 1 1  1 1 0 1  0 1 1 0
      .push(1, this._pop_yp.bind(this)) //1 1 1 1  1 1 0 1  0 1 1 1
      .push(1, this._pop_yh.bind(this)) //1 1 1 1  1 1 0 1  1 0 0 0
      .push(1, this._pop_yl.bind(this)) //1 1 1 1  1 1 0 1  1 0 0 1
      .push(1, this._pop_f.bind(this)) //1 1 1 1  1 1 0 1  1 0 1 0
      .push(1, this._inc_sp.bind(this)) //1 1 1 1  1 1 0 1  1 0 1 1
      .push(2, this._dummy.bind(this))
      .push(1, this._rets.bind(this)) //1 1 1 1  1 1 0 1  1 1 1 0
      .push(1, this._ret.bind(this)) //1 1 1 1  1 1 0 1  1 1 1 1
      .push(4, this._ld_sph_r.bind(this)) //1 1 1 1  1 1 1 0  0 0 r1 r0
      .push(4, this._ld_r_sph.bind(this)) //1 1 1 1  1 1 1 0  0 1 r1 r0
      .push(1, this._jpba.bind(this)) //1 1 1 1  1 1 1 0  1 0 0 0
      .push(7, this._dummy.bind(this))
      .push(4, this._ld_spl_r.bind(this)) //1 1 1 1  1 1 1 1  0 0 r1 r0
      .push(4, this._ld_r_spl.bind(this)) //1 1 1 1  1 1 1 1  0 1 r1 r0
      .push(1, this._halt.bind(this)) //1 1 1 1  1 1 1 1  1 0 0 0
      .push(2, this._dummy.bind(this))
      .push(1, this._nop5.bind(this)) //1 1 1 1  1 1 1 1  1 0 1 1
      .push(3, this._dummy.bind(this))
      .push(1, this._nop7.bind(this)) //1 1 1 1  1 1 1 1  1 1 1 1
      .build();
  }

  /*
  examine() {
    return {
      PC: this._PC,
      NPC: this._NPC & 0x1F00,
      A: this._A,
      B: this._B,
      IX: this._IX,
      IY: this._IY,
      SP: this._SP,
      CF: this._CF,
      ZF: this._ZF,
      DF: this._DF,
      IF: this._IF,
      HALT: this._HALT,
      RAM0: this._RAM.slice(0, 256),
      RAM1: this._RAM.slice(256, 512),
      RAM2: this._RAM.slice(512, 640),
      VRAM: this._VRAM.slice(),
      IORAM: [
        this._IT,
        this._ISW,
        this._IPT,
        this._ISIO,
        this._IK0,
        this._IK1,
        this._EIT,
        this._EISW,
        this._EIPT,
        this._EISIO,
        this._EIK0,
        this._EIK1,
        this._TM & 0xF,
        this._TM >> 4,
        this._SWL,
        this._SWH,
        this._PT & 0xF,
        this._PT >> 4,
        this._RD & 0xF,
        this._RD >> 4,
        this._SD & 0xF,
        this._SD >> 4,
        this._K0,
        this._DFK0,
        this._K1,
        this._R0,
        this._R1,
        this._R2,
        this._R3,
        this._R4,
        this._P0,
        this._P1,
        this._P2,
        this._P3,
        this._CTRL_OSC,
        this._CTRL_LCD,
        this._LC,
        this._CTRL_SVD,
        this._CTRL_BZ1,
        this._CTRL_BZ2,
        0,
        this._CTRL_SW,
        this._CTRL_PT,
        this._PTC,
        this._SC,
        this._HZR,
        this._IOC,
        this._PUP
      ]
    };
  }
  */

  _initRegisters() {
    this._A = 0;
    this._B = 0;
    this._IX = 0;
    this._IY = 0;
    this._SP = 0;

    this._PC = 0x100;
    this._NPC = 0x100;

    this._CF = 0;
    this._ZF = 0;
    this._DF = 0;
    this._IF = 0;

    this._RAM = new Uint8Array(RAM_SIZE);
    this._VRAM = new Uint8Array(VRAM_SIZE);

    this._HALT = 0;

    this._P0_OUTPUT_DATA = 0;
    this._P1_OUTPUT_DATA = 0;
    this._P2_OUTPUT_DATA = 0;
    this._P3_OUTPUT_DATA = 0;

    this._IT = 0;
    this._ISW = 0;
    this._IPT = 0;
    this._ISIO = 0;
    this._IK0 = 0;
    this._IK1 = 0;
    this._EIT = 0;
    this._EISW = 0;
    this._EIPT = 0;
    this._EISIO = 0;
    this._EIK0 = 0;
    this._EIK1 = 0;
    this._TM = 0;
    this._SWL = 0;
    this._SWH = 0;
    this._PT = 0;
    this._RD = 0;
    this._SD = 0;
    this._K0 = this._port_pullup.K0;
    this._DFK0 = 0xf;
    this._K1 = this._port_pullup.K1;
    this._R0 = 0;
    this._R1 = 0;
    this._R2 = 0;
    this._R3 = 0;
    this._R4 = 0xf;
    this._P0 = 0;
    this._P1 = 0;
    this._P2 = 0;
    this._P3 = 0;
    this._CTRL_OSC = 0;
    this._CTRL_LCD = IO_ALOFF;
    this._LC = 0;
    this._CTRL_SVD = IO_SVDDT;
    this._CTRL_BZ1 = 0;
    this._CTRL_BZ2 = 0;
    this._CTRL_SW = 0;
    this._CTRL_PT = 0;
    this._PTC = 0;
    this._SC = 0;
    this._HZR = 0;
    this._IOC = 0;
    this._PUP = 0;
  }

  reset() {
    this._initRegisters();

    this._OSC1_counter = 0;
    this._timer_counter = 0;
    this._stopwatch_counter = 0;
    this._execution_counter = 0;

    this._sound.set_buzzer_off();
    this._sound.set_envelope_off();
  }

  _get_io_dummy() {
    return 0;
  }

  _set_io_dummy(/*value*/) {
    return;
  }

  _get_io_it() {
    const ret = this._IT;
    this._IT = 0;
    return ret;
  }

  _get_io_isw() {
    const ret = this._ISW;
    this._ISW = 0;
    return ret;
  }

  _get_io_ipt() {
    const ret = this._IPT;
    this._IPT = 0;
    return ret;
  }

  _get_io_isio() {
    const ret = this._ISIO;
    this._ISIO = 0;
    return ret;
  }

  _get_io_ik0() {
    const ret = this._IK0;
    this._IK0 = 0;
    return ret;
  }

  _get_io_ik1() {
    const ret = this._IK1;
    this._IK1 = 0;
    return ret;
  }

  _get_io_eit() {
    return this._EIT;
  }

  _set_io_eit(value) {
    this._EIT = value;
  }

  _get_io_eisw() {
    return this._EISW;
  }

  _set_io_eisw(value) {
    this._EISW = value & 0x3;
  }

  _get_io_eipt() {
    return this._EIPT;
  }

  _set_io_eipt(value) {
    this._EIPT = value & 0x1;
  }

  _get_io_eisio() {
    return this._EISIO;
  }

  _set_io_eisio(value) {
    this._EISIO = value & 0x1;
  }

  _get_io_eik0() {
    return this._EIK0;
  }

  _set_io_eik0(value) {
    this._EIK0 = value;
  }

  _get_io_eik1() {
    return this._EIK1;
  }

  _set_io_eik1(value) {
    this._EIK1 = value;
  }

  _get_io_tm30() {
    return this._TM & 0xf;
  }

  _get_io_tm74() {
    return (this._TM >> 4) & 0xf;
  }

  _get_io_swl() {
    return this._SWL & 0xf;
  }

  _get_io_swh() {
    return this._SWH & 0xf;
  }

  _get_io_pt30() {
    return this._PT & 0xf;
  }

  _get_io_pt74() {
    return (this._PT >> 4) & 0xf;
  }

  _get_io_rd30() {
    return this._PRD & 0xf; // TODO: _PRD does not exist?
  }

  _set_io_rd30(value) {
    this._RD = (this._RD & 0xf0) | (value & 0x0f);
  }

  _get_io_rd74() {
    return (this._RD >> 4) & 0xf;
  }

  _set_io_rd74(value) {
    this._RD = (this._RD & 0x0f) | ((value << 4) & 0xf0);
  }

  _get_io_sd30() {
    return this._SD & 0xf;
  }

  _set_io_sd30(value) {
    this._SD = (this._SD & 0xf0) | (value & 0x0f);
  }

  _get_io_sd74() {
    return (this._SD >> 4) & 0xf;
  }

  _set_io_sd74(value) {
    this._SD = (this._SD & 0x0f) | ((value << 4) & 0xf0);
  }

  _get_io_k0() {
    return this._K0;
  }

  _get_io_dfk0() {
    return this._DFK0;
  }

  _set_io_dfk0(value) {
    this._DFK0 = value;
  }

  _get_io_k1() {
    return this._K1;
  }

  _get_io_r0() {
    return this._R0;
  }

  _set_io_r0(value) {
    this._R0 = value;
  }

  _get_io_r1() {
    return this._R1;
  }

  _set_io_r1(value) {
    this._R1 = value;
  }

  _get_io_r2() {
    return this._R2;
  }

  _set_io_r2(value) {
    this._R2 = value;
  }

  _get_io_r3() {
    return this._R3;
  }

  _set_io_r3(value) {
    this._R3 = value;
  }

  _get_io_r4() {
    return this._R4;
  }

  _set_io_r4(value) {
    this._R4 = value;
    if (value & IO_R43) {
      this._sound.set_buzzer_off();
    } else {
      this._sound.set_buzzer_on();
    }
  }

  _get_io_p0() {
    return this._P0;
  }

  _set_io_p0(value) {
    this._P0_OUTPUT_DATA = value;
    if (this._IOC & IO_IOC0) {
      this._P0 = value;
    }
  }

  _get_io_p1() {
    return this._P1;
  }

  _set_io_p1(value) {
    this._P1_OUTPUT_DATA = value;
    if (this._IOC & IO_IOC1) {
      this._P1 = value;
    }
  }

  _get_io_p2() {
    return this._P2;
  }

  _set_io_p2(value) {
    this._P2_OUTPUT_DATA = value;
    if (this._IOC & IO_IOC2) {
      this._P2 = value;
    }
  }

  _get_io_p3() {
    return this._P3;
  }

  _set_io_p3(value) {
    this._P3_OUTPUT_DATA = value;
    if (this._IOC & IO_IOC3 || this._p3_dedicated) {
      this._P3 = value;
    }
  }

  _get_io_ioc() {
    return this._IOC;
  }

  _set_io_ioc(value) {
    this._IOC = value;
    if (this._IOC & IO_IOC0) {
      this._P0 = this._P0_OUTPUT_DATA;
    }
    if (this._IOC & IO_IOC1) {
      this._P1 = this._P1_OUTPUT_DATA;
    }
    if (this._IOC & IO_IOC2) {
      this._P2 = this._P2_OUTPUT_DATA;
    }
    if (this._IOC & IO_IOC3) {
      this._P3 = this._P3_OUTPUT_DATA;
    }
  }

  _get_io_pup() {
    return this._PUP;
  }

  _set_io_pup(value) {
    this._PUP = value;
  }

  _get_io_ctrl_osc() {
    return this._CTRL_OSC;
  }

  _set_io_ctrl_osc(value) {
    this._CTRL_OSC = value;
  }

  _get_io_ctrl_lcd() {
    return this._CTRL_LCD;
  }

  _set_io_ctrl_lcd(value) {
    this._CTRL_LCD = value;
  }

  _get_io_lc() {
    return this._LC;
  }

  _set_io_lc(value) {
    this._LC = value;
  }

  _get_io_ctrl_svd() {
    return 0;
  }

  _get_io_ctrl_bz1() {
    return this._CTRL_BZ1;
  }

  _set_io_ctrl_bz1(value) {
    this._CTRL_BZ1 = value;
    this._sound.set_freq(this._CTRL_BZ1 & IO_BZFQ);
  }

  _get_io_ctrl_bz2() {
    const isOneShotRinging = this._sound.is_one_shot_ringing() ? 1 : 0;
    return (
      (this._CTRL_BZ2 & (IO_ENVRT | IO_ENVON)) | (IO_BZSHOT * isOneShotRinging)
    );
  }

  _set_io_ctrl_bz2(value) {
    this._CTRL_BZ2 = value & (IO_ENVRT | IO_ENVON);

    const cycle = (value & IO_ENVRT) > 0 ? 1 : 0;
    this._sound.set_envelope_cycle(cycle);
    if (value & IO_BZSHOT) {
      const duration = (this._CTRL_BZ1 & IO_SHOTPW) > 0 ? 1 : 0;
      this._sound.one_shot(duration);
    }
    if (value & IO_ENVON) {
      this._sound.set_envelope_on();
    } else {
      this._sound.set_envelope_off();
    }
    if (value & IO_ENVRST) {
      this._sound.reset_envelope();
    }
  }

  _set_io_ctrl_tm(value) {
    if (value & IO_TMRST) {
      this._TM = 0;
    }
  }

  _get_io_ctrl_sw() {
    return this._CTRL_SW & IO_SWRUN;
  }

  _set_io_ctrl_sw(value) {
    if (value & IO_SWRST) {
      this._SWL = this._SWH = 0;
    }
    this._CTRL_SW = value & IO_SWRUN;
  }

  _get_io_ctrl_pt() {
    return this._CTRL_PT & IO_PTRUN;
  }

  _set_io_ctrl_pt(value) {
    if (value & IO_PTRST) {
      this._PT = this._RD;
    }
    this._CTRL_PT = value & IO_PTRUN;
  }

  _get_io_ptc() {
    return this._PTC;
  }

  _set_io_ptc(value) {
    this._PTC = value;
  }

  pin_set(port, pin, level) {
    if (port === "K0") {
      const new_K0 = (~(1 << pin) & this._K0) | (level << pin);

      if (
        this._EIK0 &&
        this._DFK0 >> pin !== level &&
        this._K0 >> pin !== level
      ) {
        this._IK0 |= IO_IK0;
      }

      if (
        pin === 3 &&
        (this._PTC & IO_PTC) < 2 &&
        this._DFK0 >> pin !== level &&
        this._K0 >> pin !== level
      ) {
        this._process_ptimer();
      }

      this._K0 = new_K0;
    }
    if (port === "K1") {
      const new_K1 = (~(1 << pin) & this._K1) | (level << pin);
      if (this._EIK1 && level === 0 && this._K1 >> pin !== level) {
        this._IK1 |= IO_IK1;
      }
      this._K1 = new_K1;
    } else if (port === "P0") {
      if (!(this._IOC & IO_IOC0)) {
        this._P0 = (~(1 << pin) & this._P0) | (level << pin);
      }
    } else if (port === "P1") {
      if (!(this._IOC & IO_IOC1)) {
        this._P1 = (~(1 << pin) & this._P1) | (level << pin);
      }
    } else if (port === "P2") {
      if (!(this._IOC & IO_IOC2)) {
        this._P2 = (~(1 << pin) & this._P2) | (level << pin);
      }
    } else if (port === "P3") {
      if (!(this._IOC & IO_IOC3) && !this._p3_dedicated) {
        this._P3 = (~(1 << pin) & this._P3) | (level << pin);
      }
    } else if (port === "RES") {
      this.reset();
      this._RESET = 1;
    }
  }

  pin_release(port, pin) {
    if (port === "K0") {
      const level = (this._port_pullup.K0 >> pin) & 0x1;
      const new_K0 = (~(1 << pin) & this._K0) | (level << pin);

      if (
        this._EIK0 &&
        this._DFK0 >> pin !== level &&
        this._K0 >> pin !== level
      ) {
        this._IK0 |= IO_IK0;
      }

      if (
        pin === 3 &&
        (this._PTC & IO_PTC) < 2 &&
        this._DFK0 >> pin !== level &&
        this._K0 >> pin !== level
      ) {
        this._process_ptimer();
      }

      this._K0 = new_K0;
    }
    if (port === "K1") {
      const level = (this._port_pullup.K1 >> pin) & 0x1;
      const new_K1 = (~(1 << pin) & this._K1) | (level << pin);
      if (this._EIK1 && level === 0 && this._K1 >> pin !== level) {
        this._IK1 |= IO_IK1;
      }
      this._K1 = new_K1;
    } else if (port === "P0") {
      if (!(this._IOC & IO_IOC0)) {
        this._P0 = (~(1 << pin) & this._P0) | (this._PUP & IO_PUP0);
      }
    } else if (port === "P1") {
      if (!(this._IOC & IO_IOC1)) {
        this._P1 = (~(1 << pin) & this._P1) | (this._PUP & IO_PUP1);
      }
    } else if (port === "P2") {
      if (!(this._IOC & IO_IOC2)) {
        this._P2 = (~(1 << pin) & this._P2) | (this._PUP & IO_PUP2);
      }
    } else if (port === "P3") {
      if (!(this._IOC & IO_IOC3) && !this._p3_dedicated) {
        this._P3 = (~(1 << pin) & this._P3) | (this._PUP & IO_PUP3);
      }
    } else if (port === "RES") {
      this._RESET = 0;
    }
  }

  pc() {
    return this._PC & 0x1fff;
  }

  get_VRAM() {
    if ((this._CTRL_LCD & IO_ALOFF) | this._RESET) {
      return EMPTY_VRAM;
    }
    if (this._CTRL_LCD & IO_ALON) {
      return FULL_VRAM;
    }
    return this._VRAM;
  }

  get_ROM() {
    return this._ROM;
  }

  istr_counter() {
    return this._instr_counter;
  }

  clock() {
    let exec_cycles = 7;

    if (this._RESET) {
      return exec_cycles;
    }

    if (!this._HALT) {
      this._if_delay = false;
      //const s0 = Date.now();
      const opcode = this._ROM.getWord(this._PC * 2);
      //const dt0 = Date.now() - s0;

      //const s1 = Date.now();
      const op = this._execute.at(opcode);
      //const dt1 = Date.now() - s1;

      //const s = Date.now();
      exec_cycles = op(opcode);
      //const dt = Date.now() - s;
      //if (dt > 10) {
      //  console.log(op);
      //}
      //console.log(`getWord=${dt0}, at=${dt1}, exec=${dt}`);
      this._instr_counter += 1;
    }

    //const is = Date.now();
    if (this._IF && !this._if_delay) {
      if (this._IPT & this._EIPT) {
        exec_cycles += this._interrupt(0xc);
      } else if (this._ISIO & this._EISIO) {
        exec_cycles += this._interrupt(0xa);
      } else if (this._IK1) {
        exec_cycles += this._interrupt(0x8);
      } else if (this._IK0) {
        exec_cycles += this._interrupt(0x6);
      } else if (this._ISW & this._EISW) {
        exec_cycles += this._interrupt(0x4);
      } else if (this._IT & this._EIT) {
        exec_cycles += this._interrupt(0x2);
      }
    }
    //const idt = Date.now() - is;

    //const os = Date.now();
    if (!(this._CTRL_OSC & IO_CLKCHG)) {
      exec_cycles *= this._OSC1_clock_div;
    }

    this._OSC1_counter -= exec_cycles;
    while (this._OSC1_counter <= 0) {
      this._OSC1_counter += this._OSC1_clock_div;
      this._clock_OSC1();
    }
    //const odt = Date.now() - os;
    //console.log(`interrupt=${idt}, osc1=${odt}`);

    return exec_cycles;
  }

  _clock_OSC1() {
    this._sound.clock();

    if ((this._PTC & IO_PTC) > 1) {
      this._ptimer_counter -= 1;
      if (this._ptimer_counter <= 0) {
        this._ptimer_counter += PTIMER_CLOCK_DIV[this._PTC & IO_PTC];
        this._process_ptimer();
      }
    }

    this._stopwatch_counter -= 1;
    if (this._stopwatch_counter <= 0) {
      this._stopwatch_counter += STOPWATCH_CLOCK_DIV;
      this._process_stopwatch();
    }

    this._timer_counter -= 1;
    if (this._timer_counter <= 0) {
      this._timer_counter += TIMER_CLOCK_DIV;
      this._process_timer();
    }
  }

  _process_ptimer() {
    this._PT = (this._PT - 1) & 0xff;
    if (this._PT === 0) {
      this._PT = this._RD;
      this._IPT |= IO_IPT;
    }
    if (this._PTC & IO_PTCOUT) {
      this._R3 ^= IO_R33;
    }
  }

  _process_stopwatch() {
    if (this._CTRL_SW & IO_SWRUN) {
      this._SWL = (this._SWL + 1) % 10;
      if (this._SWL === 0) {
        this._SWH = (this._SWH + 1) % 10;
        this._ISW |= IO_ISW1;
        if (this._SWH === 0) {
          this._ISW |= IO_ISW0;
        }
      }
    }
  }

  _process_timer() {
    const new_TM = (this._TM + 1) & 0xff;
    if ((new_TM & IO_TM2) < (this._TM & IO_TM2)) {
      this._IT |= IO_IT32;
    }
    if (((new_TM >> 4) & IO_TM4) < ((this._TM >> 4) & IO_TM4)) {
      this._IT |= IO_IT8;
    }
    if (((new_TM >> 4) & IO_TM6) < ((this._TM >> 4) & IO_TM6)) {
      this._IT |= IO_IT2;
    }
    if (((new_TM >> 4) & IO_TM7) < ((this._TM >> 4) & IO_TM7)) {
      this._IT |= IO_IT1;
    }
    this._TM = new_TM;
  }

  _interrupt(vector) {
    this.set_mem((this._SP - 1) & 0xff, (this._PC >> 8) & 0x0f);
    this.set_mem((this._SP - 2) & 0xff, (this._PC >> 4) & 0x0f);
    this._SP = (this._SP - 3) & 0xff;
    this.set_mem(this._SP, this._PC & 0x0f);
    this._IF = 0;
    this._HALT = 0;
    this._PC = this._NPC = (this._NPC & 0x1000) | 0x0100 | vector;
    return 13;
  }

  get_mem(addr) {
    if (addr < RAM_SIZE) {
      return this._RAM[addr];
    }

    if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
      return this._VRAM[addr - VRAM_PART1_OFFSET];
    }

    if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
      return this._VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE];
    }

    if (addr >= IORAM_OFFSET && addr < IORAM_END) {
      const io = this._io_tbl[addr];
      if (io) {
        return io[0]();
      }
    }

    return 0;
  }

  set_mem(addr, value) {
    if (addr < RAM_SIZE) {
      this._RAM[addr] = value & 0xf;
    } else if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
      this._VRAM[addr - VRAM_PART1_OFFSET] = value & 0xf;
    } else if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
      this._VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE] = value & 0xf;
    } else if (addr >= IORAM_OFFSET && addr < IORAM_END) {
      const io = this._io_tbl[addr];
      try {
        if (io) {
          io[1](value);
        }
      } catch (e) {
        console.log(`set_mem exception at addr=0x${addr.toString(16)}: ${e}`);
      }
    }
  }

  get_A() {
    return this._A;
  }

  set_A(value) {
    this._A = value & 0xf;
  }

  get_B() {
    return this._B;
  }

  set_B(value) {
    this._B = value & 0xf;
  }

  get_MX() {
    return this.get_mem(this._IX);
  }

  set_MX(value) {
    this.set_mem(this._IX, value);
  }

  get_MY() {
    return this.get_mem(this._IY);
  }

  set_MY(value) {
    this.set_mem(this._IY, value);
  }

  _jp_s(opcode) {
    // PCB←NBP, PCP←NPP, PCS←s7~s0
    this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    return 5;
  }

  _retd_l(opcode) {
    // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP←SP+3, M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
    this._PC = this._NPC =
      (this._PC & 0x1000) |
      (this._RAM[this._SP + 2] << 8) |
      (this._RAM[this._SP + 1] << 4) |
      this._RAM[this._SP];
    this._SP = (this._SP + 3) & 0xff;
    this.set_mem(this._IX, opcode & 0x00f);
    this.set_mem(
      (this._IX & 0xf00) | ((this._IX + 1) & 0xff),
      (opcode >> 4) & 0x00f,
    );
    this._IX = (this._IX & 0xf00) | ((this._IX + 2) & 0xff);
    return 12;
  }

  _jp_c_s(opcode) {
    // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=1
    if (this._CF) {
      this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    } else {
      this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    }

    return 5;
  }

  _jp_nc_s(opcode) {
    // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=0
    if (!this._CF) {
      this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    } else {
      this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    }

    return 5;
  }

  _call_s(opcode) {
    // M(SP-1) ←PCP, M(SP-2) ←PCSH, M(SP-3) ←PCSL+1 SP←SP-3, PCP←NPP, PCS←s7~s0
    this.set_mem((this._SP - 1) & 0xff, ((this._PC + 1) >> 8) & 0x0f);
    this.set_mem((this._SP - 2) & 0xff, ((this._PC + 1) >> 4) & 0x0f);
    this._SP = (this._SP - 3) & 0xff;
    this.set_mem(this._SP, (this._PC + 1) & 0x0f);
    this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    return 7;
  }

  _calz_s(opcode) {
    // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP ← SP-3, PCP ← 0, PCS ← s7~s0
    this.set_mem((this._SP - 1) & 0xff, ((this._PC + 1) >> 8) & 0x0f);
    this.set_mem((this._SP - 2) & 0xff, ((this._PC + 1) >> 4) & 0x0f);
    this._SP = (this._SP - 3) & 0xff;
    this.set_mem(this._SP, (this._PC + 1) & 0x0f);
    this._PC = this._NPC = (this._NPC & 0x1000) | (opcode & 0x0ff);
    return 7;
  }

  _jp_z_s(opcode) {
    // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=1
    if (this._ZF) {
      this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    } else {
      this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    }
    return 5;
  }

  _jp_nz_s(opcode) {
    // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=0
    if (!this._ZF) {
      this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
    } else {
      this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    }
    return 5;
  }

  _ld_y_y(opcode) {
    // YH ← y7~y4, YL ← y3~y0
    this._IY = (this._IY & 0xf00) | (opcode & 0x0ff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _lbpx_mx_l(opcode) {
    // M(X)←l3~l0, M(X+1)← l7~l4, X←X+2
    this.set_mem(this._IX, opcode & 0x00f);
    this.set_mem(
      (this._IX & 0xf00) | ((this._IX + 1) & 0xff),
      (opcode >> 4) & 0x00f,
    );
    this._IX = (this._IX & 0xf00) | ((this._IX + 2) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _adc_xh_i(opcode) {
    // XH← XH+i3~i0+C
    const xh = ((this._IX >> 4) & 0x00f) + (opcode & 0x00f) + this._CF;
    this._ZF = (xh & 0xf) === 0 ? 1 : 0;
    this._CF = xh > 15 ? 1 : 0;
    this._IX = (this._IX & 0xf0f) | ((xh << 4) & 0x0f0);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _adc_xl_i(opcode) {
    // XL ← XL+i3~i0+C
    const xl = (this._IX & 0x00f) + (opcode & 0x00f) + this._CF;
    this._ZF = (xl & 0xf) === 0 ? 1 : 0;
    this._CF = xl > 15 ? 1 : 0;
    this._IX = (this._IX & 0xff0) | (xl & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _adc_yh_i(opcode) {
    // YH← YH+i3~i0+C
    const yh = ((this._IY >> 4) & 0x00f) + (opcode & 0x00f) + this._CF;
    this._ZF = (yh & 0xf) === 0 ? 1 : 0;
    this._CF = yh > 15 ? 1 : 0;
    this._IY = (this._IY & 0xf0f) | ((yh << 4) & 0x0f0);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _adc_yl_i(opcode) {
    // YL ← YL+i3~i0+C
    const yl = (this._IY & 0x00f) + (opcode & 0x00f) + this._CF;
    this._ZF = (yl & 0xf) === 0 ? 1 : 0;
    this._CF = yl > 15 ? 1 : 0;
    this._IY = (this._IY & 0xff0) | (yl & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _cp_xh_i(opcode) {
    // XH-i3~i0
    const cp = ((this._IX >> 4) & 0x00f) - (opcode & 0x00f);
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _cp_xl_i(opcode) {
    // XL-i3~i0
    const cp = (this._IX & 0x00f) - (opcode & 0x00f);
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _cp_yh_i(opcode) {
    // YH-i3~i0
    const cp = ((this._IY >> 4) & 0x00f) - (opcode & 0x00f);
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _cp_yl_i(opcode) {
    // YL-i3~i0
    const cp = (this._IY & 0x00f) - (opcode & 0x00f);
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _add_r_q(opcode) {
    // r←r+q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() + this._get_abmxmy_tbl[q]();
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _adc_r_q(opcode) {
    // r ← r+q+C
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() + this._get_abmxmy_tbl[q]() + this._CF;
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _sub_r_q(opcode) {
    // r←r-q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() - this._get_abmxmy_tbl[q]();
    this._CF = res < 0 ? 1 : 0;
    if (this._DF && res < 0) {
      res += 10;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _sbc_r_q(opcode) {
    // r ← r-q-C
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() - this._get_abmxmy_tbl[q]() - this._CF;
    this._CF = res < 0 ? 1 : 0;
    if (this._DF && res < 0) {
      res += 10;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _and_r_q(opcode) {
    // r←r && q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() & this._get_abmxmy_tbl[q]();
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _or_r_q(opcode) {
    // r←r or q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() | this._get_abmxmy_tbl[q]();
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _xor_r_q(opcode) {
    // r←r xor q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    let res = this._get_abmxmy_tbl[r]() ^ this._get_abmxmy_tbl[q]();
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _rlc_r(opcode) {
    // d3 ←d2, d2 ←d1, d1 ←d0, d0 ←C, C← d3
    const r = opcode & 0x3;
    const res = (this._get_abmxmy_tbl[r]() << 1) + this._CF;
    this._CF = res > 15 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _ld_x_x(opcode) {
    // XH ← x7~x4, XL ← x3~x0
    this._IX = (this._IX & 0xf00) | (opcode & 0x0ff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _add_r_i(opcode) {
    // r ← r+i3~i0
    const r = (opcode >> 4) & 0x3;
    let res = this._get_abmxmy_tbl[r]() + (opcode & 0x00f);
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _adc_r_i(opcode) {
    // r ← r+i3~i0+C
    const r = (opcode >> 4) & 0x3;
    let res = this._get_abmxmy_tbl[r]() + (opcode & 0x00f) + this._CF;
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _and_r_i(opcode) {
    // r ← r && i3~i0
    const r = (opcode >> 4) & 0x3;
    const res = this._get_abmxmy_tbl[r]() & opcode & 0x00f;
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _or_r_i(opcode) {
    // r ← r   i3~i0
    const r = (opcode >> 4) & 0x3;
    const res = this._get_abmxmy_tbl[r]() | (opcode & 0x00f);
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _xor_r_i(opcode) {
    // r ← r i3~i0
    const r = (opcode >> 4) & 0x3;
    const res = this._get_abmxmy_tbl[r]() ^ (opcode & 0x00f);
    this._ZF = res === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _sbc_r_i(opcode) {
    // r ← r-i3~i0-C
    const r = (opcode >> 4) & 0x3;
    let res = this._get_abmxmy_tbl[r]() - (opcode & 0x00f) - this._CF;
    this._CF = res < 0 ? 1 : 0;
    if (this._DF && this._CF) {
      res += 10;
    }
    this._ZF = (res & 0xf) === 0 ? 1 : 0;
    this._set_abmxmy_tbl[r](res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _fan_r_i(opcode) {
    // r && i3~i0
    const r = (opcode >> 4) & 0x3;
    this._ZF = (this._get_abmxmy_tbl[r]() & opcode & 0x00f) === 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _cp_r_i(opcode) {
    // r-i3~i0
    const r = (opcode >> 4) & 0x3;
    const cp = this._get_abmxmy_tbl[r]() - (opcode & 0x00f);
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _ld_r_i(opcode) {
    // r ← i3~i0
    const r = (opcode >> 4) & 0x3;
    this._set_abmxmy_tbl[r](opcode & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pset_p(opcode) {
    // NBP ←p4, NPP ← p3~p0
    this._if_delay = true;
    this._NPC = (opcode << 8) & 0x1f00;
    this._PC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ldpx_mx_i(opcode) {
    // M(X) ← i3~i0, X ← X+1
    this.set_mem(this._IX, opcode & 0x00f);
    this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ldpy_my_i(opcode) {
    // M(Y) ← i3~i0, Y ← Y+1
    this.set_mem(this._IY, opcode & 0x00f);
    this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_xp_r(opcode) {
    // XP ← r
    const r = opcode & 0x3;
    this._IX = (this._get_abmxmy_tbl[r]() << 8) | (this._IX & 0x0ff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_xh_r(opcode) {
    // XH← r
    const r = opcode & 0x3;
    this._IX = (this._get_abmxmy_tbl[r]() << 4) | (this._IX & 0xf0f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_xl_r(opcode) {
    // XL←r
    const r = opcode & 0x3;
    this._IX = this._get_abmxmy_tbl[r]() | (this._IX & 0xff0);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _rrc_r(opcode) {
    // d3 ←C, d2 ←d3, d1 ←d2, d0 ←d1, C← d0
    const r = opcode & 0x3;
    const res = this._get_abmxmy_tbl[r]() + (this._CF << 4);
    this._CF = res & 0x1;
    this._set_abmxmy_tbl[r](res >> 1);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_yp_r(opcode) {
    // YP ← r
    const r = opcode & 0x3;
    this._IY = (this._get_abmxmy_tbl[r]() << 8) | (this._IY & 0x0ff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_yh_r(opcode) {
    // YH← r
    const r = opcode & 0x3;
    this._IY = (this._get_abmxmy_tbl[r]() << 4) | (this._IY & 0xf0f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_yl_r(opcode) {
    // YL←r
    const r = opcode & 0x3;
    this._IY = this._get_abmxmy_tbl[r]() | (this._IY & 0xff0);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _dummy(/*opcode*/) {
    return 5;
  }

  _ld_r_xp(opcode) {
    // r←XP
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._IX >> 8);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_xh(opcode) {
    // r←XH
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r]((this._IX >> 4) & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_xl(opcode) {
    // r←XL
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._IX & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_yp(opcode) {
    // r←YP
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._IY >> 8);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_yh(opcode) {
    // r←YH
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r]((this._IY >> 4) & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_yl(opcode) {
    // r←YL
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._IY & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_q(opcode) {
    // r←q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._get_abmxmy_tbl[q]());
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ldpx_r_q(opcode) {
    // r←q, X←X+1
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._get_abmxmy_tbl[q]());
    this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ldpy_r_q(opcode) {
    // r←q, Y←Y+1
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._get_abmxmy_tbl[q]());
    this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _cp_r_q(opcode) {
    // r-q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    const cp = this._get_abmxmy_tbl[r]() - this._get_abmxmy_tbl[q]();
    this._ZF = cp === 0 ? 1 : 0;
    this._CF = cp < 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _fan_r_q(opcode) {
    // r && q
    const r = (opcode >> 2) & 0x3;
    const q = opcode & 0x3;
    this._ZF =
      (this._get_abmxmy_tbl[r]() & this._get_abmxmy_tbl[q]()) === 0 ? 1 : 0;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _acpx_mx_r(opcode) {
    // M(X) ← M(X)+r+C, X ← X+1
    const r = opcode & 0x3;
    let res = this.get_mem(this._IX) + this._get_abmxmy_tbl[r]() + this._CF;
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = res & (0xf === 0) ? 1 : 0;
    this.set_mem(this._IX, res & 0xf);
    this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _acpy_my_r(opcode) {
    // M(Y) ← M(Y)+r+C, Y ← Y+1
    const r = opcode & 0x3;
    let res = this.get_mem(this._IY) + this._get_abmxmy_tbl[r]() + this._CF;
    this._CF = res > 15 ? 1 : 0;
    if (this._DF && res > 9) {
      res += 6;
      this._CF = 1;
    }
    this._ZF = res & (0xf === 0) ? 1 : 0;
    this.set_mem(this._IY, res & 0xf);
    this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _scpx_mx_r(opcode) {
    //  M(X) ← M(X)-r-C, X ← X+1
    const r = opcode & 0x3;
    let res = this.get_mem(this._IX) - this._get_abmxmy_tbl[r]() - this._CF;
    this._CF = res < 0 ? 1 : 0;
    if (this._DF && res < 0) {
      res += 10;
    }
    this._ZF = res & (0xf === 0) ? 1 : 0;
    this.set_mem(this._IX, res & 0xf);
    this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _scpy_my_r(opcode) {
    // M(Y) ← M(Y)-r-C, Y ← Y+1
    const r = opcode & 0x3;
    let res = this.get_mem(this._IY) - this._get_abmxmy_tbl[r]() - this._CF;
    this._CF = res < 0 ? 1 : 0;
    if (this._DF && res < 0) {
      res += 10;
    }
    this._ZF = res & (0xf === 0) ? 1 : 0;
    this.set_mem(this._IY, res & 0xf);
    this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _set_f_i(opcode) {
    // F ← F or i3~i0
    this._CF |= opcode & 0x001;
    this._ZF |= (opcode >> 1) & 0x001;
    this._DF |= (opcode >> 2) & 0x001;
    const new_IF = (opcode >> 3) & 0x001;
    this._if_delay = new_IF && !this._IF;
    this._IF |= new_IF;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _rst_f_i(opcode) {
    // F ← F   i3~i0
    this._CF &= opcode;
    this._ZF &= opcode >> 1;
    this._DF &= opcode >> 2;
    this._IF &= opcode >> 3;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _inc_mn(opcode) {
    // M(n3~n0) ←M(n3~n0)+1
    const mn = opcode & 0x00f;
    const res = this.get_mem(mn) + 1;
    this._ZF = res === 16 ? 1 : 0;
    this._CF = res > 15 ? 1 : 0;
    this.set_mem(mn, res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _dec_mn(opcode) {
    // M(n3~n0) ←M(n3~n0)-1
    const mn = opcode & 0x00f;
    const res = this.get_mem(mn) - 1;
    this._ZF = res === 0 ? 1 : 0;
    this._CF = res < 0 ? 1 : 0;
    this.set_mem(mn, res & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }

  _ld_mn_a(opcode) {
    // M(n3~n0) ← A
    this.set_mem(opcode & 0x00f, this._A & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_mn_b(opcode) {
    // M(n3~n0) ← B
    this.set_mem(opcode & 0x00f, this._B & 0xf);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_a_mn(opcode) {
    // A ← M(n3~n0)
    this._A = this.get_mem(opcode & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_b_mn(opcode) {
    // B ← M(n3~n0)
    this._B = this.get_mem(opcode & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_r(opcode) {
    // SP← SP-1, M(SP)←r
    const r = opcode & 0x3;
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, this._get_abmxmy_tbl[r]());
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_xp(/*opcode*/) {
    // SP ← SP-1, M(SP) ← XP
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, this._IX >> 8);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_xh(/*opcode*/) {
    // SP ← SP-1, M(SP) ← XH
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, (this._IX >> 4) & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_xl(/*opcode*/) {
    // SP ← SP-1, M(SP) ← XL
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, this._IX & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_yp(/*opcode*/) {
    // SP ← SP-1, M(SP) ← YP
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, this._IY >> 8);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_yh(/*opcode*/) {
    // SP ← SP-1, M(SP) ← YH
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, (this._IY >> 4) & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_yl(/*opcode*/) {
    // SP ← SP-1, M(SP) ← YL
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(this._SP, this._IY & 0x00f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _push_f(/*opcode*/) {
    // SP← SP-1, M(SP)←F
    this._SP = (this._SP - 1) & 0xff;
    this.set_mem(
      this._SP,
      (this._IF << 3) | (this._DF << 2) | (this._ZF << 1) | this._CF,
    );
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _dec_sp(/*opcode*/) {
    // SP← SP-1
    this._SP = (this._SP - 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_r(opcode) {
    // r←M(SP), SP←SP+1
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this.get_mem(this._SP));
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_xp(/*opcode*/) {
    // XP ← M(SP), SP ← SP+1
    this._IX = (this.get_mem(this._SP) << 8) | (this._IX & 0x0ff);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_xh(/*opcode*/) {
    // XH← M(SP), SP ← SP+1
    this._IX = (this.get_mem(this._SP) << 4) | (this._IX & 0xf0f);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_xl(/*opcode*/) {
    // XL ← M(SP), SP ← SP+1
    this._IX = this.get_mem(this._SP) | (this._IX & 0xff0);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_yp(/*opcode*/) {
    // YP ← M(SP), SP ← SP+1
    this._IY = (this.get_mem(this._SP) << 8) | (this._IY & 0x0ff);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_yh(/*opcode*/) {
    // YH← M(SP), SP ← SP+1
    this._IY = (this.get_mem(this._SP) << 4) | (this._IY & 0xf0f);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_yl(/*opcode*/) {
    // YL ← M(SP), SP ← SP+1
    this._IY = this.get_mem(this._SP) | (this._IY & 0xff0);
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _pop_f(/*opcode*/) {
    // F←M(SP), SP←SP+1
    const f = this.get_mem(this._SP);
    this._CF = f & 0x1;
    this._ZF = (f >> 1) & 0x1;
    this._DF = (f >> 2) & 0x1;
    const new_IF = (f >> 3) & 0x1;
    this._if_delay = new_IF && !this._IF;
    this._IF = new_IF;
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _inc_sp(/*opcode*/) {
    // SP← SP+1
    this._SP = (this._SP + 1) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _rets(/*opcode*/) {
    // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP←SP+3, PC←PC+1
    this._PC =
      (this._PC & 0x1000) |
      this.get_mem(this._SP) |
      (this.get_mem(this._SP + 1) << 4) |
      (this.get_mem(this._SP + 2) << 8);
    this._SP = (this._SP + 3) & 0xff;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 12;
  }

  _ret(/*opcode*/) {
    // PCSL ← M(SP), PCSH ← M(SP+1), PCP ← M(SP+2) SP ← SP+3
    this._PC = this._NPC =
      (this._PC & 0x1000) |
      this.get_mem(this._SP) |
      (this.get_mem(this._SP + 1) << 4) |
      (this.get_mem(this._SP + 2) << 8);
    this._SP = (this._SP + 3) & 0xff;
    return 7;
  }

  _ld_sph_r(opcode) {
    //  SPH←r
    const r = opcode & 0x3;
    this._SP = (this._get_abmxmy_tbl[r]() << 4) | (this._SP & 0x0f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_sph(opcode) {
    // r←SPH
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._SP >> 4);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _jpba(/*opcode*/) {
    // PCB←NBP, PCP←NPP, PCSH←B, PCSL ←A
    this._PC = (this._NPC & 0x1f00) | (this._B << 4) | this._A;
    return 5;
  }

  _ld_spl_r(opcode) {
    // SPL ← r
    const r = opcode & 0x3;
    this._SP = this._get_abmxmy_tbl[r]() | (this._SP & 0xf0);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _ld_r_spl(opcode) {
    const r = opcode & 0x3;
    this._set_abmxmy_tbl[r](this._SP & 0x0f);
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _halt(/*opcode*/) {
    // Halt (stop clock)
    this._HALT = 1;
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5; // 1 1 1 1  1 1 1 1  1 0 0 0                          5
  }

  _nop5(/*opcode*/) {
    // No operation (5 clock cycles)
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 5;
  }

  _nop7(/*opcode*/) {
    // No operation (7 clock cycles)
    this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
    return 7;
  }
}
