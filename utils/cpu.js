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

// E0C6200
export class CPU {
  constructor(rom, clock, toneGenerator) {
    this._ROM = rom;
    this._ROM_data = rom._data;
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
    this._VRAM_words = new Uint16Array(this._VRAM.buffer);

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

  get_VRAM_words() {
    if ((this._CTRL_LCD & IO_ALOFF) | this._RESET) {
      return EMPTY_VRAM_WORDS;
    }
    if (this._CTRL_LCD & IO_ALON) {
      return FULL_VRAM_WORDS;
    }
    return this._VRAM_words;
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
      const pcAddr = this._PC * 2;
      const opcode = (this._ROM_data[pcAddr] << 8) | this._ROM_data[pcAddr + 1];

      switch (opcode >> 8) {
        case 0x0: {
          // jp_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0
          this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          exec_cycles = 5;
          break;
        }
        case 0x1: {
          // retd_l
          // PCSL←M(SP), PCSH←M(SP+1), PCP←M(SP+2) SP←SP+3, M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
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
          exec_cycles = 12;
          break;
        }
        case 0x2: {
          // jp_c_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=1
          if (this._CF) {
            this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            this._PC = this._NPC =
              (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x3: {
          // jp_nc_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=0
          if (!this._CF) {
            this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            this._PC = this._NPC =
              (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x4: {
          // call_s
          // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP←SP-3, PCP←NPP, PCS←s7~s0
          this.set_mem((this._SP - 1) & 0xff, ((this._PC + 1) >> 8) & 0x0f);
          this.set_mem((this._SP - 2) & 0xff, ((this._PC + 1) >> 4) & 0x0f);
          this._SP = (this._SP - 3) & 0xff;
          this.set_mem(this._SP, (this._PC + 1) & 0x0f);
          this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          exec_cycles = 7;
          break;
        }
        case 0x5: {
          // calz_s
          // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP←SP-3, PCP←0, PCS←s7~s0
          this.set_mem((this._SP - 1) & 0xff, ((this._PC + 1) >> 8) & 0x0f);
          this.set_mem((this._SP - 2) & 0xff, ((this._PC + 1) >> 4) & 0x0f);
          this._SP = (this._SP - 3) & 0xff;
          this.set_mem(this._SP, (this._PC + 1) & 0x0f);
          this._PC = this._NPC = (this._NPC & 0x1000) | (opcode & 0x0ff);
          exec_cycles = 7;
          break;
        }
        case 0x6: {
          // jp_z_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=1
          if (this._ZF) {
            this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            this._PC = this._NPC =
              (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x7: {
          // jp_nz_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=0
          if (!this._ZF) {
            this._PC = (this._NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            this._PC = this._NPC =
              (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x8: {
          // ld_y_y
          // YH←y7~y4, YL←y3~y0
          this._IY = (this._IY & 0xf00) | (opcode & 0x0ff);
          this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          exec_cycles = 5;
          break;
        }
        case 0x9: {
          // lbpx_mx_l
          // M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
          this.set_mem(this._IX, opcode & 0x00f);
          this.set_mem(
            (this._IX & 0xf00) | ((this._IX + 1) & 0xff),
            (opcode >> 4) & 0x00f,
          );
          this._IX = (this._IX & 0xf00) | ((this._IX + 2) & 0xff);
          this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          exec_cycles = 5;
          break;
        }
        case 0xa: {
          switch ((opcode >> 4) & 0xf) {
            case 0x0: {
              // adc_xh_i
              // XH←XH+i3~i0+C
              const xh =
                ((this._IX >> 4) & 0x00f) + (opcode & 0x00f) + this._CF;
              this._ZF = (xh & 0xf) === 0 ? 1 : 0;
              this._CF = xh > 15 ? 1 : 0;
              this._IX = (this._IX & 0xf0f) | ((xh << 4) & 0x0f0);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // adc_xl_i
              // XL←XL+i3~i0+C
              const xl = (this._IX & 0x00f) + (opcode & 0x00f) + this._CF;
              this._ZF = (xl & 0xf) === 0 ? 1 : 0;
              this._CF = xl > 15 ? 1 : 0;
              this._IX = (this._IX & 0xff0) | (xl & 0x00f);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // adc_yh_i
              // YH←YH+i3~i0+C
              const yh =
                ((this._IY >> 4) & 0x00f) + (opcode & 0x00f) + this._CF;
              this._ZF = (yh & 0xf) === 0 ? 1 : 0;
              this._CF = yh > 15 ? 1 : 0;
              this._IY = (this._IY & 0xf0f) | ((yh << 4) & 0x0f0);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // adc_yl_i
              // YL←YL+i3~i0+C
              const yl = (this._IY & 0x00f) + (opcode & 0x00f) + this._CF;
              this._ZF = (yl & 0xf) === 0 ? 1 : 0;
              this._CF = yl > 15 ? 1 : 0;
              this._IY = (this._IY & 0xff0) | (yl & 0x00f);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x4: {
              // cp_xh_i
              // XH-i3~i0
              const cp = ((this._IX >> 4) & 0x00f) - (opcode & 0x00f);
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x5: {
              // cp_xl_i
              // XL-i3~i0
              const cp = (this._IX & 0x00f) - (opcode & 0x00f);
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x6: {
              // cp_yh_i
              // YH-i3~i0
              const cp = ((this._IY >> 4) & 0x00f) - (opcode & 0x00f);
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x7: {
              // cp_yl_i
              // YL-i3~i0
              const cp = (this._IY & 0x00f) - (opcode & 0x00f);
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x8: {
              // add_r_q
              // r←r+q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) +
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._CF = res > 15 ? 1 : 0;
              if (this._DF && res > 9) {
                res += 6;
                this._CF = 1;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x9: {
              // adc_r_q
              // r←r+q+C
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) +
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) +
                this._CF;
              this._CF = res > 15 ? 1 : 0;
              if (this._DF && res > 9) {
                res += 6;
                this._CF = 1;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xa: {
              // sub_r_q
              // r←r-q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._CF = res < 0 ? 1 : 0;
              if (this._DF && res < 0) {
                res += 10;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xb: {
              // sbc_r_q
              // r←r-q-C
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                this._CF;
              this._CF = res < 0 ? 1 : 0;
              if (this._DF && res < 0) {
                res += 10;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xc: {
              // and_r_q
              // r←r && q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) &
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xd: {
              // or_r_q
              // r←r or q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) |
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xe: {
              // xor_r_q
              // r←r xor q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) ^
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xf: {
              // rlc_r
              // d3←d2, d2←d1, d1←d0, d0←C, C←d3
              const r = opcode & 0x3;
              const res =
                ((r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) <<
                  1) +
                this._CF;
              this._CF = res > 15 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 0xb: {
          // ld_x_x
          // XH←x7~x4, XL←x3~x0
          this._IX = (this._IX & 0xf00) | (opcode & 0x0ff);
          this._PC = this._NPC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
          exec_cycles = 5;
          break;
        }
        case 0xc: {
          switch ((opcode >> 6) & 0x3) {
            case 0x0: {
              // add_r_i
              // r←r+i3~i0
              const r = (opcode >> 4) & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) +
                (opcode & 0x00f);
              this._CF = res > 15 ? 1 : 0;
              if (this._DF && res > 9) {
                res += 6;
                this._CF = 1;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // adc_r_i
              // r←r+i3~i0+C
              const r = (opcode >> 4) & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) +
                (opcode & 0x00f) +
                this._CF;
              this._CF = res > 15 ? 1 : 0;
              if (this._DF && res > 9) {
                res += 6;
                this._CF = 1;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // and_r_i
              // r←r && i3~i0
              const r = (opcode >> 4) & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) &
                opcode &
                0x00f;
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // or_r_i
              // r←r or i3~i0
              const r = (opcode >> 4) & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) |
                (opcode & 0x00f);
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 0xd: {
          switch ((opcode >> 6) & 0x3) {
            case 0x0: {
              // xor_r_i
              // r←r xor i3~i0
              const r = (opcode >> 4) & 0x3;
              const res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) ^
                (opcode & 0x00f);
              this._ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res);
              } else {
                this.set_mem(this._IY, res);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // sbc_r_i
              // r←r-i3~i0-C
              const r = (opcode >> 4) & 0x3;
              let res =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                (opcode & 0x00f) -
                this._CF;
              this._CF = res < 0 ? 1 : 0;
              if (this._DF && this._CF) {
                res += 10;
              }
              this._ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                this._A = res & 0xf & 0xf;
              } else if (r === 1) {
                this._B = res & 0xf & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, res & 0xf);
              } else {
                this.set_mem(this._IY, res & 0xf);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // fan_r_i
              // r && i3~i0
              const r = (opcode >> 4) & 0x3;
              this._ZF =
                ((r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) &
                  opcode &
                  0x00f) ===
                0
                  ? 1
                  : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // cp_r_i
              // r-i3~i0
              const r = (opcode >> 4) & 0x3;
              const cp =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                (opcode & 0x00f);
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 0xe: {
          switch ((opcode >> 6) & 0x3) {
            case 0x0: {
              // ld_r_i
              // r←i3~i0
              const r = (opcode >> 4) & 0x3;
              if (r === 0) {
                this._A = opcode & 0x00f & 0xf;
              } else if (r === 1) {
                this._B = opcode & 0x00f & 0xf;
              } else if (r === 2) {
                this.set_mem(this._IX, opcode & 0x00f);
              } else {
                this.set_mem(this._IY, opcode & 0x00f);
              }
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0x1: {
              switch ((opcode >> 4) & 0x3) {
                case 0x0: // pset_p
                case 0x1: {
                  // pset_p
                  // NBP←p4, NPP←p3~p0
                  this._if_delay = true;
                  this._NPC = (opcode << 8) & 0x1f00;
                  this._PC = (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // ldpx_mx_i
                  // M(X)←i3~i0, X←X+1
                  this.set_mem(this._IX, opcode & 0x00f);
                  this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // ldpy_my_i
                  // M(Y)←i3~i0, Y←Y+1
                  this.set_mem(this._IY, opcode & 0x00f);
                  this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 0x2: {
              switch ((opcode >> 2) & 0xf) {
                case 0x0: {
                  // ld_xp_r
                  // XP←r
                  const r = opcode & 0x3;
                  this._IX =
                    ((r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) <<
                      8) |
                    (this._IX & 0x0ff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x1: {
                  // ld_xh_r
                  // XH←r
                  const r = opcode & 0x3;
                  this._IX =
                    ((r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) <<
                      4) |
                    (this._IX & 0xf0f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // ld_xl_r
                  // XL←r
                  const r = opcode & 0x3;
                  this._IX =
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) |
                    (this._IX & 0xff0);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // rrc_r
                  // d3←C, d2←d3, d1←d2, d0←d1, C←d0
                  const r = opcode & 0x3;
                  const res =
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) +
                    (this._CF << 4);
                  this._CF = res & 0x1;
                  if (r === 0) {
                    this._A = (res >> 1) & 0xf;
                  } else if (r === 1) {
                    this._B = (res >> 1) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, res >> 1);
                  } else {
                    this.set_mem(this._IY, res >> 1);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // ld_yp_r
                  // YP←r
                  const r = opcode & 0x3;
                  this._IY =
                    ((r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) <<
                      8) |
                    (this._IY & 0x0ff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // ld_yh_r
                  // YH←r
                  const r = opcode & 0x3;
                  this._IY =
                    ((r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) <<
                      4) |
                    (this._IY & 0xf0f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // ld_yl_r
                  // YL←r
                  const r = opcode & 0x3;
                  this._IY =
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) |
                    (this._IY & 0xff0);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x7: // dummy
                case 0xb: // dummy
                case 0xf: {
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // ld_r_xp
                  // r←XP
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = (this._IX >> 8) & 0xf;
                  } else if (r === 1) {
                    this._B = (this._IX >> 8) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._IX >> 8);
                  } else {
                    this.set_mem(this._IY, this._IX >> 8);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // ld_r_xh
                  // r←XH
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = (this._IX >> 4) & 0x00f & 0xf;
                  } else if (r === 1) {
                    this._B = (this._IX >> 4) & 0x00f & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, (this._IX >> 4) & 0x00f);
                  } else {
                    this.set_mem(this._IY, (this._IX >> 4) & 0x00f);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // ld_r_xl
                  // r←XL
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = this._IX & 0x00f & 0xf;
                  } else if (r === 1) {
                    this._B = this._IX & 0x00f & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._IX & 0x00f);
                  } else {
                    this.set_mem(this._IY, this._IX & 0x00f);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xc: {
                  // ld_r_yp
                  // r←YP
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = (this._IY >> 8) & 0xf;
                  } else if (r === 1) {
                    this._B = (this._IY >> 8) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._IY >> 8);
                  } else {
                    this.set_mem(this._IY, this._IY >> 8);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xd: {
                  // ld_r_yh
                  // r←YH
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = (this._IY >> 4) & 0x00f & 0xf;
                  } else if (r === 1) {
                    this._B = (this._IY >> 4) & 0x00f & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, (this._IY >> 4) & 0x00f);
                  } else {
                    this.set_mem(this._IY, (this._IY >> 4) & 0x00f);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xe: {
                  // ld_r_yl
                  // r←YL
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = this._IY & 0x00f & 0xf;
                  } else if (r === 1) {
                    this._B = this._IY & 0x00f & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._IY & 0x00f);
                  } else {
                    this.set_mem(this._IY, this._IY & 0x00f);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 0x3: {
              switch ((opcode >> 4) & 0x3) {
                case 0x0: {
                  // ld_r_q
                  // r←q
                  const r = (opcode >> 2) & 0x3;
                  const q = opcode & 0x3;
                  if (r === 0) {
                    this._A =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 1) {
                    this._B =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(
                      this._IX,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  } else {
                    this.set_mem(
                      this._IY,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x1: {
                  // dummy
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // ldpx_r_q
                  // r←q, X←X+1
                  const r = (opcode >> 2) & 0x3;
                  const q = opcode & 0x3;
                  if (r === 0) {
                    this._A =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 1) {
                    this._B =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(
                      this._IX,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  } else {
                    this.set_mem(
                      this._IY,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  }
                  this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // ldpy_r_q
                  // r←q, Y←Y+1
                  const r = (opcode >> 2) & 0x3;
                  const q = opcode & 0x3;
                  if (r === 0) {
                    this._A =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 1) {
                    this._B =
                      (q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY)) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(
                      this._IX,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  } else {
                    this.set_mem(
                      this._IY,
                      q === 0
                        ? this._A
                        : q === 1
                          ? this._B
                          : q === 2
                            ? this.get_mem(this._IX)
                            : this.get_mem(this._IY),
                    );
                  }
                  this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
        case 0xf: {
          switch ((opcode >> 4) & 0xf) {
            case 0x0: {
              // cp_r_q
              // r-q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              const cp =
                (r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) -
                (q === 0
                  ? this._A
                  : q === 1
                    ? this._B
                    : q === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY));
              this._ZF = cp === 0 ? 1 : 0;
              this._CF = cp < 0 ? 1 : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // fan_r_q
              // r && q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              this._ZF =
                ((r === 0
                  ? this._A
                  : r === 1
                    ? this._B
                    : r === 2
                      ? this.get_mem(this._IX)
                      : this.get_mem(this._IY)) &
                  (q === 0
                    ? this._A
                    : q === 1
                      ? this._B
                      : q === 2
                        ? this.get_mem(this._IX)
                        : this.get_mem(this._IY))) ===
                0
                  ? 1
                  : 0;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              switch ((opcode >> 2) & 0x3) {
                case 0x0: // dummy
                case 0x1: {
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // acpx_mx_r
                  // M(X)←M(X)+r+C, X←X+1
                  const r = opcode & 0x3;
                  let res =
                    this.get_mem(this._IX) +
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) +
                    this._CF;
                  this._CF = res > 15 ? 1 : 0;
                  if (this._DF && res > 9) {
                    res += 6;
                    this._CF = 1;
                  }
                  this._ZF = res & (0xf === 0) ? 1 : 0;
                  this.set_mem(this._IX, res & 0xf);
                  this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
                case 0x3: {
                  // acpy_my_r
                  // M(Y)←M(Y)+r+C, Y←Y+1
                  const r = opcode & 0x3;
                  let res =
                    this.get_mem(this._IY) +
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) +
                    this._CF;
                  this._CF = res > 15 ? 1 : 0;
                  if (this._DF && res > 9) {
                    res += 6;
                    this._CF = 1;
                  }
                  this._ZF = res & (0xf === 0) ? 1 : 0;
                  this.set_mem(this._IY, res & 0xf);
                  this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 0x3: {
              switch ((opcode >> 2) & 0x3) {
                case 0x0: // dummy
                case 0x1: {
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // scpx_mx_r
                  // M(X)←M(X)-r-C, X←X+1
                  const r = opcode & 0x3;
                  let res =
                    this.get_mem(this._IX) -
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) -
                    this._CF;
                  this._CF = res < 0 ? 1 : 0;
                  if (this._DF && res < 0) {
                    res += 10;
                  }
                  this._ZF = res & (0xf === 0) ? 1 : 0;
                  this.set_mem(this._IX, res & 0xf);
                  this._IX = (this._IX & 0xf00) | ((this._IX + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
                case 0x3: {
                  // scpy_my_r
                  // M(Y)←M(Y)-r-C, Y←Y+1
                  const r = opcode & 0x3;
                  let res =
                    this.get_mem(this._IY) -
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) -
                    this._CF;
                  this._CF = res < 0 ? 1 : 0;
                  if (this._DF && res < 0) {
                    res += 10;
                  }
                  this._ZF = res & (0xf === 0) ? 1 : 0;
                  this.set_mem(this._IY, res & 0xf);
                  this._IY = (this._IY & 0xf00) | ((this._IY + 1) & 0xff);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 0x4: {
              // set_f_i
              // F←F or i3~i0
              this._CF |= opcode & 0x001;
              this._ZF |= (opcode >> 1) & 0x001;
              this._DF |= (opcode >> 2) & 0x001;
              const new_IF = (opcode >> 3) & 0x001;
              this._if_delay = new_IF && !this._IF;
              this._IF |= new_IF;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x5: {
              // rst_f_i
              // F←F && ~i3~i0
              this._CF &= opcode;
              this._ZF &= opcode >> 1;
              this._DF &= opcode >> 2;
              this._IF &= opcode >> 3;
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x6: {
              // inc_mn
              // M(n3~n0)←M(n3~n0)+1
              const mn = opcode & 0x00f;
              const res = this.get_mem(mn) + 1;
              this._ZF = res === 16 ? 1 : 0;
              this._CF = res > 15 ? 1 : 0;
              this.set_mem(mn, res & 0xf);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x7: {
              // dec_mn
              // M(n3~n0)←M(n3~n0)-1
              const mn = opcode & 0x00f;
              const res = this.get_mem(mn) - 1;
              this._ZF = res === 0 ? 1 : 0;
              this._CF = res < 0 ? 1 : 0;
              this.set_mem(mn, res & 0xf);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x8: {
              // ld_mn_a
              // M(n3~n0)←A
              this.set_mem(opcode & 0x00f, this._A & 0xf);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0x9: {
              // ld_mn_b
              // M(n3~n0)←B
              this.set_mem(opcode & 0x00f, this._B & 0xf);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0xa: {
              // ld_a_mn
              // A←M(n3~n0)
              this._A = this.get_mem(opcode & 0x00f);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0xb: {
              // ld_b_mn
              // B←M(n3~n0)
              this._B = this.get_mem(opcode & 0x00f);
              this._PC = this._NPC =
                (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0xc: {
              switch (opcode & 0xf) {
                case 0x0: // push_r
                case 0x1:
                case 0x2:
                case 0x3: {
                  // SP←SP-1, M(SP)←r
                  const r = opcode & 0x3;
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(
                    this._SP,
                    r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY),
                  );
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // push_xp
                  // SP←SP-1, M(SP)←XP
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, this._IX >> 8);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // push_xh
                  // SP←SP-1, M(SP)←XH
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, (this._IX >> 4) & 0x00f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // push_xl
                  // SP←SP-1, M(SP)←XL
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, this._IX & 0x00f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x7: {
                  // push_yp
                  // SP←SP-1, M(SP)←YP
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, this._IY >> 8);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // push_yh
                  // SP←SP-1, M(SP)←YH
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, (this._IY >> 4) & 0x00f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // push_yl
                  // SP←SP-1, M(SP)←YL
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(this._SP, this._IY & 0x00f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // push_f
                  // SP←SP-1, M(SP)←F
                  this._SP = (this._SP - 1) & 0xff;
                  this.set_mem(
                    this._SP,
                    (this._IF << 3) |
                      (this._DF << 2) |
                      (this._ZF << 1) |
                      this._CF,
                  );
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xb: {
                  // dec_sp
                  // SP←SP-1
                  this._SP = (this._SP - 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                default: {
                  // dummy
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 0xd: {
              switch (opcode & 0xf) {
                case 0x0: // pop_r
                case 0x1:
                case 0x2:
                case 0x3: {
                  // r←M(SP), SP←SP+1
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = this.get_mem(this._SP) & 0xf;
                  } else if (r === 1) {
                    this._B = this.get_mem(this._SP) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this.get_mem(this._SP));
                  } else {
                    this.set_mem(this._IY, this.get_mem(this._SP));
                  }
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // pop_xp
                  // XP←M(SP), SP←SP+1
                  this._IX = (this.get_mem(this._SP) << 8) | (this._IX & 0x0ff);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // pop_xh
                  // XH←M(SP), SP←SP+1
                  this._IX = (this.get_mem(this._SP) << 4) | (this._IX & 0xf0f);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // pop_xl
                  // XL←M(SP), SP←SP+1
                  this._IX = this.get_mem(this._SP) | (this._IX & 0xff0);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x7: {
                  // pop_yp
                  // YP←M(SP), SP←SP+1
                  this._IY = (this.get_mem(this._SP) << 8) | (this._IY & 0x0ff);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // pop_yh
                  // YH←M(SP), SP←SP+1
                  this._IY = (this.get_mem(this._SP) << 4) | (this._IY & 0xf0f);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // pop_yl
                  // YL←M(SP), SP←SP+1
                  this._IY = this.get_mem(this._SP) | (this._IY & 0xff0);
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // pop_f
                  // F←M(SP), SP←SP+1
                  const f = this.get_mem(this._SP);
                  this._CF = f & 0x1;
                  this._ZF = (f >> 1) & 0x1;
                  this._DF = (f >> 2) & 0x1;
                  const new_IF = (f >> 3) & 0x1;
                  this._if_delay = new_IF && !this._IF;
                  this._IF = new_IF;
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xb: {
                  // inc_sp
                  // SP←SP+1
                  this._SP = (this._SP + 1) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xc: // dummy
                case 0xd: {
                  exec_cycles = 5;
                  break;
                }
                case 0xe: {
                  // rets
                  // PCSL←M(SP), PCSH←M(SP+1), PCP←M(SP+2) SP←SP+3, PC←PC+1
                  this._PC =
                    (this._PC & 0x1000) |
                    this.get_mem(this._SP) |
                    (this.get_mem(this._SP + 1) << 4) |
                    (this.get_mem(this._SP + 2) << 8);
                  this._SP = (this._SP + 3) & 0xff;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 12;
                  break;
                }
                case 0xf: {
                  // ret
                  // PCSL←M(SP), PCSH←M(SP+1), PCP←M(SP+2) SP←SP+3
                  this._PC = this._NPC =
                    (this._PC & 0x1000) |
                    this.get_mem(this._SP) |
                    (this.get_mem(this._SP + 1) << 4) |
                    (this.get_mem(this._SP + 2) << 8);
                  this._SP = (this._SP + 3) & 0xff;
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 0xe: {
              switch (opcode & 0xf) {
                case 0x0: // ld_sph_r
                case 0x1:
                case 0x2:
                case 0x3: {
                  // SPH←r
                  const r = opcode & 0x3;
                  this._SP =
                    ((r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) <<
                      4) |
                    (this._SP & 0x0f);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: // ld_r_sph
                case 0x5:
                case 0x6:
                case 0x7: {
                  // r←SPH
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = (this._SP >> 4) & 0xf;
                  } else if (r === 1) {
                    this._B = (this._SP >> 4) & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._SP >> 4);
                  } else {
                    this.set_mem(this._IY, this._SP >> 4);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // jpba
                  // PCB←NBP, PCP←NPP, PCSH←B, PCSL←A
                  this._PC = (this._NPC & 0x1f00) | (this._B << 4) | this._A;
                  exec_cycles = 5;
                  break;
                }
                default: {
                  // dummy
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 0xf: {
              switch (opcode & 0xf) {
                case 0x0: // ld_spl_r
                case 0x1:
                case 0x2:
                case 0x3: {
                  // SPL←r
                  const r = opcode & 0x3;
                  this._SP =
                    (r === 0
                      ? this._A
                      : r === 1
                        ? this._B
                        : r === 2
                          ? this.get_mem(this._IX)
                          : this.get_mem(this._IY)) |
                    (this._SP & 0xf0);
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: // ld_r_spl
                case 0x5:
                case 0x6:
                case 0x7: {
                  // r←SPL
                  const r = opcode & 0x3;
                  if (r === 0) {
                    this._A = this._SP & 0x0f & 0xf;
                  } else if (r === 1) {
                    this._B = this._SP & 0x0f & 0xf;
                  } else if (r === 2) {
                    this.set_mem(this._IX, this._SP & 0x0f);
                  } else {
                    this.set_mem(this._IY, this._SP & 0x0f);
                  }
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // halt
                  this._HALT = 1;
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: // dummy
                case 0xa: {
                  exec_cycles = 5;
                  break;
                }
                case 0xb: {
                  // nop5
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xc: // dummy
                case 0xd:
                case 0xe: {
                  exec_cycles = 5;
                  break;
                }
                case 0xf: {
                  // nop7
                  this._PC = this._NPC =
                    (this._PC & 0x1000) | ((this._PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
      this._instr_counter += 1;
    }

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

    if (!(this._CTRL_OSC & IO_CLKCHG)) {
      exec_cycles *= this._OSC1_clock_div;
    }

    this._OSC1_counter -= exec_cycles;
    while (this._OSC1_counter <= 0) {
      this._OSC1_counter += this._OSC1_clock_div;
      this._clock_OSC1();
    }

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
      switch (addr - IORAM_OFFSET) {
        case 0x00: {
          const ret = this._IT;
          this._IT = 0;
          return ret;
        }
        case 0x01: {
          const ret = this._ISW;
          this._ISW = 0;
          return ret;
        }
        case 0x02: {
          const ret = this._IPT;
          this._IPT = 0;
          return ret;
        }
        case 0x03: {
          const ret = this._ISIO;
          this._ISIO = 0;
          return ret;
        }
        case 0x04: {
          const ret = this._IK0;
          this._IK0 = 0;
          return ret;
        }
        case 0x05: {
          const ret = this._IK1;
          this._IK1 = 0;
          return ret;
        }
        case 0x10:
          return this._EIT;
        case 0x11:
          return this._EISW;
        case 0x12:
          return this._EIPT;
        case 0x13:
          return this._EISIO;
        case 0x14:
          return this._EIK0;
        case 0x15:
          return this._EIK1;
        case 0x20:
          return this._TM & 0xf;
        case 0x21:
          return (this._TM >> 4) & 0xf;
        case 0x22:
          return this._SWL & 0xf;
        case 0x23:
          return this._SWH & 0xf;
        case 0x24:
          return this._PT & 0xf;
        case 0x25:
          return (this._PT >> 4) & 0xf;
        case 0x26:
          return this._PRD & 0xf; // TODO: _PRD does not exist?
        case 0x27:
          return (this._RD >> 4) & 0xf;
        case 0x30:
          return this._SD & 0xf;
        case 0x31:
          return (this._SD >> 4) & 0xf;
        case 0x40:
          return this._K0;
        case 0x41:
          return this._DFK0;
        case 0x42:
          return this._K1;
        case 0x50:
          return this._R0;
        case 0x51:
          return this._R1;
        case 0x52:
          return this._R2;
        case 0x53:
          return this._R3;
        case 0x54:
          return this._R4;
        case 0x60:
          return this._P0;
        case 0x61:
          return this._P1;
        case 0x62:
          return this._P2;
        case 0x63:
          return this._P3;
        case 0x70:
          return this._CTRL_OSC;
        case 0x71:
          return this._CTRL_LCD;
        case 0x72:
          return this._LC;
        case 0x73:
          return 0;
        case 0x74:
          return this._CTRL_BZ1;
        case 0x75: {
          const isOneShotRinging = this._sound.is_one_shot_ringing() ? 1 : 0;
          return (
            (this._CTRL_BZ2 & (IO_ENVRT | IO_ENVON)) |
            (IO_BZSHOT * isOneShotRinging)
          );
        }
        case 0x77:
          return this._CTRL_SW & IO_SWRUN;
        case 0x78:
          return this._CTRL_PT & IO_PTRUN;
        case 0x79:
          return this._PTC;
        case 0x7d:
          return this._IOC;
        case 0x7e:
          return this._PUP;
        default:
          return 0;
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
      switch (addr - IORAM_OFFSET) {
        case 0x10:
          this._EIT = value;
          break;
        case 0x11:
          this._EISW = value & 0x3;
          break;
        case 0x12:
          this._EIPT = value & 0x1;
          break;
        case 0x13:
          this._EISIO = value & 0x1;
          break;
        case 0x14:
          this._EIK0 = value;
          break;
        case 0x15:
          this._EIK1 = value;
          break;
        case 0x26:
          this._RD = (this._RD & 0xf0) | (value & 0x0f);
          break;
        case 0x27:
          this._RD = (this._RD & 0x0f) | ((value << 4) & 0xf0);
          break;
        case 0x30:
          this._SD = (this._SD & 0xf0) | (value & 0x0f);
          break;
        case 0x31:
          this._SD = (this._SD & 0x0f) | ((value << 4) & 0xf0);
          break;
        case 0x50:
          this._R0 = value;
          break;
        case 0x51:
          this._R1 = value;
          break;
        case 0x52:
          this._R2 = value;
          break;
        case 0x53:
          this._R3 = value;
          break;
        case 0x54: {
          this._R4 = value;
          if (value & IO_R43) {
            this._sound.set_buzzer_off();
          } else {
            this._sound.set_buzzer_on();
          }
          break;
        }
        case 0x60: {
          this._P0_OUTPUT_DATA = value;
          if (this._IOC & IO_IOC0) {
            this._P0 = value;
          }
          break;
        }
        case 0x61: {
          this._P1_OUTPUT_DATA = value;
          if (this._IOC & IO_IOC1) {
            this._P1 = value;
          }
          break;
        }
        case 0x62: {
          this._P2_OUTPUT_DATA = value;
          if (this._IOC & IO_IOC2) {
            this._P2 = value;
          }
          break;
        }
        case 0x63: {
          this._P3_OUTPUT_DATA = value;
          if (this._IOC & IO_IOC3 || this._p3_dedicated) {
            this._P3 = value;
          }
          break;
        }
        case 0x70:
          this._CTRL_OSC = value;
          break;
        case 0x71:
          this._CTRL_LCD = value;
          break;
        case 0x72:
          this._LC = value;
          break;
        case 0x74: {
          this._CTRL_BZ1 = value;
          this._sound.set_freq(this._CTRL_BZ1 & IO_BZFQ);
          break;
        }
        case 0x75: {
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
          break;
        }
        case 0x76: {
          if (value & IO_TMRST) {
            this._TM = 0;
          }
          break;
        }
        case 0x77: {
          if (value & IO_SWRST) {
            this._SWL = this._SWH = 0;
          }
          this._CTRL_SW = value & IO_SWRUN;
          break;
        }
        case 0x78: {
          if (value & IO_PTRST) {
            this._PT = this._RD;
          }
          this._CTRL_PT = value & IO_PTRUN;
          break;
        }
        case 0x79:
          this._PTC = value;
          break;
        case 0x7d: {
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
          break;
        }
        case 0x7e:
          this._PUP = value;
          break;
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
}
