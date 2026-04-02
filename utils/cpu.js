const OSC1_CLOCK = 32768;
const SND_BUZZER_FREQ_DIV = [8, 10, 12, 14, 16, 20, 24, 28];
const SND_ONE_SHOT_DIV = [8 * 128, 16 * 128];
const SND_ENVELOPE_CYCLE_DIV = [16 * 128, 32 * 128];
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

// Module-level register cache — faster than object property lookup in QuickJS
// (single CPU instance assumed; no state isolation lost)
let _PC = 0;
let _NPC = 0;
let _A = 0;
let _B = 0;
let _CF = 0;
let _ZF = 0;
let _DF = 0;
let _SP = 0;
let _IX = 0;
let _IY = 0;
let _IF = 0;
let _HALT = 0;
let _RESET = 0;
let _if_delay = false;
let _instr_counter = 0;
let _ROM_data = null;
let _RAM = null;
let _ROM = null;
let _tone_generator = null;
let _snd_cycle = 0;
let _snd_one_shot = 0;
let _snd_envelope = 0;
let _snd_envelope_step = 0;
let _snd_envelope_cycle = 0;
let _snd_buzzer_freq = 0;
let _snd_on = false;
let _snd_envelope_on = false;
let _snd_active = false;
let _port_pullup = null;
let _p3_dedicated = 0;
let _OSC1_clock_div = 0;
let _OSC1_counter = 0;
let _timer_counter = 0;
let _ptimer_counter = 0;
let _stopwatch_counter = 0;

let _VRAM = null;
let _VRAM_words = null;
let _P0_OUTPUT_DATA = 0;
let _P1_OUTPUT_DATA = 0;
let _P2_OUTPUT_DATA = 0;
let _P3_OUTPUT_DATA = 0;
let _IT = 0;
let _ISW = 0;
let _IPT = 0;
let _ISIO = 0;
let _IK0 = 0;
let _IK1 = 0;
let _EIT = 0;
let _EISW = 0;
let _EIPT = 0;
let _EISIO = 0;
let _EIK0 = 0;
let _EIK1 = 0;
let _TM = 0;
let _SWL = 0;
let _SWH = 0;
let _PT = 0;
let _PRD = 0;
let _RD = 0;
let _SD = 0;
let _K0 = 0;
let _DFK0 = 0;
let _K1 = 0;
let _R0 = 0;
let _R1 = 0;
let _R2 = 0;
let _R3 = 0;
let _R4 = 0;
let _P0 = 0;
let _P1 = 0;
let _P2 = 0;
let _P3 = 0;
let _CTRL_OSC = 0;
let _CTRL_LCD = 0;
let _LC = 0;

let _CTRL_BZ1 = 0;
let _CTRL_BZ2 = 0;
let _CTRL_SW = 0;
let _CTRL_PT = 0;
let _PTC = 0;

let _IOC = 0;
let _PUP = 0;

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
  _CTRL_BZ1 = 0;
  _CTRL_BZ2 = 0;
  _CTRL_SW = 0;
  _CTRL_PT = 0;
  _PTC = 0;
  _IOC = 0;
  _PUP = 0;
}

function _clock_OSC1() {
  _snd_cycle += 1;
  if (_snd_active) {
    if (_snd_one_shot > 0) {
      _snd_one_shot -= 1;
      if (_snd_one_shot <= 0) {
        _tone_generator.stop(_snd_cycle / OSC1_CLOCK);
      }
    }
    if (_snd_envelope > 0) {
      _snd_envelope -= 1;
      if (_snd_envelope <= 0) {
        _snd_envelope_step -= 1;
        _tone_generator.play(
          _snd_buzzer_freq,
          false,
          1 / (8 - _snd_envelope_step),
          _snd_cycle / OSC1_CLOCK,
        );
        _snd_envelope = _snd_envelope_cycle;
      }
    }
    _snd_active = _snd_one_shot > 0 || _snd_envelope > 0;
  }

  if ((_PTC & IO_PTC) > 1) {
    _ptimer_counter -= 1;
    if (_ptimer_counter <= 0) {
      _ptimer_counter += PTIMER_CLOCK_DIV[_PTC & IO_PTC];
      _process_ptimer();
    }
  }

  _stopwatch_counter -= 1;
  if (_stopwatch_counter <= 0) {
    _stopwatch_counter += STOPWATCH_CLOCK_DIV;
    _process_stopwatch();
  }

  _timer_counter -= 1;
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
  _RAM[(_SP - 1) & 0xff] = (_PC >> 8) & 0x0f & 0xf;
  _RAM[(_SP - 2) & 0xff] = (_PC >> 4) & 0x0f & 0xf;
  _SP = (_SP - 3) & 0xff;
  _RAM[_SP] = _PC & 0x0f & 0xf;
  _IF = 0;
  _HALT = 0;
  _PC = _NPC = (_NPC & 0x1000) | 0x0100 | vector;
  return 13;
}

function get_mem(addr) {
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
    switch (addr - IORAM_OFFSET) {
      case 0x00: {
        const ret = _IT;
        _IT = 0;
        return ret;
      }
      case 0x01: {
        const ret = _ISW;
        _ISW = 0;
        return ret;
      }
      case 0x02: {
        const ret = _IPT;
        _IPT = 0;
        return ret;
      }
      case 0x03: {
        const ret = _ISIO;
        _ISIO = 0;
        return ret;
      }
      case 0x04: {
        const ret = _IK0;
        _IK0 = 0;
        return ret;
      }
      case 0x05: {
        const ret = _IK1;
        _IK1 = 0;
        return ret;
      }
      case 0x10:
        return _EIT;
      case 0x11:
        return _EISW;
      case 0x12:
        return _EIPT;
      case 0x13:
        return _EISIO;
      case 0x14:
        return _EIK0;
      case 0x15:
        return _EIK1;
      case 0x20:
        return _TM & 0xf;
      case 0x21:
        return (_TM >> 4) & 0xf;
      case 0x22:
        return _SWL & 0xf;
      case 0x23:
        return _SWH & 0xf;
      case 0x24:
        return _PT & 0xf;
      case 0x25:
        return (_PT >> 4) & 0xf;
      case 0x26:
        return _PRD & 0xf; // TODO: _PRD does not exist?
      case 0x27:
        return (_RD >> 4) & 0xf;
      case 0x30:
        return _SD & 0xf;
      case 0x31:
        return (_SD >> 4) & 0xf;
      case 0x40:
        return _K0;
      case 0x41:
        return _DFK0;
      case 0x42:
        return _K1;
      case 0x50:
        return _R0;
      case 0x51:
        return _R1;
      case 0x52:
        return _R2;
      case 0x53:
        return _R3;
      case 0x54:
        return _R4;
      case 0x60:
        return _P0;
      case 0x61:
        return _P1;
      case 0x62:
        return _P2;
      case 0x63:
        return _P3;
      case 0x70:
        return _CTRL_OSC;
      case 0x71:
        return _CTRL_LCD;
      case 0x72:
        return _LC;
      case 0x73:
        return 0;
      case 0x74:
        return _CTRL_BZ1;
      case 0x75: {
        const isOneShotRinging = _snd_one_shot > 0 ? 1 : 0;
        return (
          (_CTRL_BZ2 & (IO_ENVRT | IO_ENVON)) | (IO_BZSHOT * isOneShotRinging)
        );
      }
      case 0x77:
        return _CTRL_SW & IO_SWRUN;
      case 0x78:
        return _CTRL_PT & IO_PTRUN;
      case 0x79:
        return _PTC;
      case 0x7d:
        return _IOC;
      case 0x7e:
        return _PUP;
      default:
        return 0;
    }
  }

  return 0;
}

function set_mem(addr, value) {
  if (addr < RAM_SIZE) {
    _RAM[addr] = value & 0xf;
  } else if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
    _VRAM[addr - VRAM_PART1_OFFSET] = value & 0xf;
  } else if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
    _VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE] = value & 0xf;
  } else if (addr >= IORAM_OFFSET && addr < IORAM_END) {
    switch (addr - IORAM_OFFSET) {
      case 0x10:
        _EIT = value;
        break;
      case 0x11:
        _EISW = value & 0x3;
        break;
      case 0x12:
        _EIPT = value & 0x1;
        break;
      case 0x13:
        _EISIO = value & 0x1;
        break;
      case 0x14:
        _EIK0 = value;
        break;
      case 0x15:
        _EIK1 = value;
        break;
      case 0x26:
        _RD = (_RD & 0xf0) | (value & 0x0f);
        break;
      case 0x27:
        _RD = (_RD & 0x0f) | ((value << 4) & 0xf0);
        break;
      case 0x30:
        _SD = (_SD & 0xf0) | (value & 0x0f);
        break;
      case 0x31:
        _SD = (_SD & 0x0f) | ((value << 4) & 0xf0);
        break;
      case 0x50:
        _R0 = value;
        break;
      case 0x51:
        _R1 = value;
        break;
      case 0x52:
        _R2 = value;
        break;
      case 0x53:
        _R3 = value;
        break;
      case 0x54: {
        _R4 = value;
        if (value & IO_R43) {
          _snd_set_buzzer_off();
        } else {
          _snd_set_buzzer_on();
        }
        break;
      }
      case 0x60: {
        _P0_OUTPUT_DATA = value;
        if (_IOC & IO_IOC0) {
          _P0 = value;
        }
        break;
      }
      case 0x61: {
        _P1_OUTPUT_DATA = value;
        if (_IOC & IO_IOC1) {
          _P1 = value;
        }
        break;
      }
      case 0x62: {
        _P2_OUTPUT_DATA = value;
        if (_IOC & IO_IOC2) {
          _P2 = value;
        }
        break;
      }
      case 0x63: {
        _P3_OUTPUT_DATA = value;
        if (_IOC & IO_IOC3 || _p3_dedicated) {
          _P3 = value;
        }
        break;
      }
      case 0x70:
        _CTRL_OSC = value;
        break;
      case 0x71:
        _CTRL_LCD = value;
        break;
      case 0x72:
        _LC = value;
        break;
      case 0x74: {
        _CTRL_BZ1 = value;
        _snd_set_freq(_CTRL_BZ1 & IO_BZFQ);
        break;
      }
      case 0x75: {
        _CTRL_BZ2 = value & (IO_ENVRT | IO_ENVON);
        const cycle = (value & IO_ENVRT) > 0 ? 1 : 0;
        _snd_set_envelope_cycle(cycle);
        if (value & IO_BZSHOT) {
          const duration = (_CTRL_BZ1 & IO_SHOTPW) > 0 ? 1 : 0;
          _snd_one_shot_start(duration);
        }
        if (value & IO_ENVON) {
          _snd_set_envelope_on();
        } else {
          _snd_set_envelope_off();
        }
        if (value & IO_ENVRST) {
          _snd_reset_envelope();
        }
        break;
      }
      case 0x76: {
        if (value & IO_TMRST) {
          _TM = 0;
        }
        break;
      }
      case 0x77: {
        if (value & IO_SWRST) {
          _SWL = _SWH = 0;
        }
        _CTRL_SW = value & IO_SWRUN;
        break;
      }
      case 0x78: {
        if (value & IO_PTRST) {
          _PT = _RD;
        }
        _CTRL_PT = value & IO_PTRUN;
        break;
      }
      case 0x79:
        _PTC = value;
        break;
      case 0x7d: {
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
        break;
      }
      case 0x7e:
        _PUP = value;
        break;
    }
  }
}

function _snd_set_freq(value) {
  _snd_buzzer_freq = OSC1_CLOCK / SND_BUZZER_FREQ_DIV[value];
  if (_snd_on) {
    _tone_generator.play(_snd_buzzer_freq, false, 0.5, _snd_cycle / OSC1_CLOCK);
  }
}

function _snd_set_buzzer_on() {
  _snd_on = true;
  _snd_one_shot = 0;
  _tone_generator.play(_snd_buzzer_freq, false, 0.5, _snd_cycle / OSC1_CLOCK);
  if (_snd_envelope_on) {
    _snd_envelope = _snd_envelope_cycle;
    _snd_active = true;
  }
}

function _snd_set_buzzer_off() {
  _snd_on = false;
  _snd_envelope = 0;
  _snd_one_shot = 0;
  _snd_active = false;
  _tone_generator.stop(_snd_cycle / OSC1_CLOCK);
}

function _snd_one_shot_start(duration) {
  if (_snd_one_shot === 0) {
    _snd_one_shot = SND_ONE_SHOT_DIV[duration];
    _snd_active = true;
    if (!_snd_on) {
      _tone_generator.play(
        _snd_buzzer_freq,
        false,
        0.5,
        _snd_cycle / OSC1_CLOCK,
      );
    }
  }
}

function _snd_set_envelope_on() {
  _snd_envelope_on = true;
  _snd_envelope_step = 7;
}

function _snd_set_envelope_off() {
  _snd_envelope_on = false;
  _snd_envelope_step = 0;
  _snd_envelope = 0;
  _snd_active = _snd_one_shot > 0;
  _tone_generator.stop(_snd_cycle / OSC1_CLOCK);
}

function _snd_set_envelope_cycle(cycle) {
  _snd_envelope_cycle = SND_ENVELOPE_CYCLE_DIV[cycle];
}

function _snd_reset_envelope() {
  _snd_envelope_step = 7;
}

// E0C6200
export class CPU {
  constructor(rom, clock, toneGenerator) {
    _ROM = rom;
    _ROM_data = rom._data;
    _tone_generator = toneGenerator;
    _snd_buzzer_freq = OSC1_CLOCK / SND_BUZZER_FREQ_DIV[0];
    _snd_envelope_cycle = SND_ENVELOPE_CYCLE_DIV[0];

    _port_pullup = mask.port_pullup;

    _p3_dedicated = mask.p3_dedicated;

    _initRegisters();

    _OSC1_clock_div = clock / OSC1_CLOCK;

    _OSC1_counter = 0;
    _timer_counter = 0;
    _ptimer_counter = 0;
    _stopwatch_counter = 0;
    _instr_counter = 0;

    _if_delay = false;

    _RESET = 0;
  }

  /*
  examine() {
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

  reset() {
    _initRegisters();

    _OSC1_counter = 0;
    _timer_counter = 0;
    _stopwatch_counter = 0;

    _snd_set_buzzer_off();
    _snd_set_envelope_off();
  }

  pin_set(port, pin, level) {
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
      this.reset();
      _RESET = 1;
    }
  }

  pin_release(port, pin) {
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

  pc() {
    return _PC & 0x1fff;
  }

  get_VRAM() {
    if ((_CTRL_LCD & IO_ALOFF) | _RESET) {
      return EMPTY_VRAM;
    }
    if (_CTRL_LCD & IO_ALON) {
      return FULL_VRAM;
    }
    return _VRAM;
  }

  get_VRAM_words() {
    if ((_CTRL_LCD & IO_ALOFF) | _RESET) {
      return EMPTY_VRAM_WORDS;
    }
    if (_CTRL_LCD & IO_ALON) {
      return FULL_VRAM_WORDS;
    }
    return _VRAM_words;
  }

  get_ROM() {
    return _ROM;
  }

  istr_counter() {
    return _instr_counter;
  }

  clockBatch(n) {
    for (let i = 0; i < n; i += 1) {
      if (
        _HALT &&
        !_RESET &&
        (!_IF ||
          _if_delay ||
          (!(_IPT & _EIPT) &&
            !(_ISIO & _EISIO) &&
            !_IK1 &&
            !_IK0 &&
            !(_ISW & _EISW) &&
            !(_IT & _EIT)))
      ) {
        const has_ptimer = (_PTC & IO_PTC) > 1;
        const skip =
          Math.min(
            _timer_counter,
            _stopwatch_counter,
            has_ptimer ? _ptimer_counter : 2147483647,
          ) - 1;
        if (skip > 7) {
          for (let t = 0; t < skip; t += 1) {
            _clock_OSC1();
          }
          continue;
        }
      }
      this.clock();
    }
  }

  clock() {
    let exec_cycles = 7;

    if (_RESET) {
      return exec_cycles;
    }

    if (!_HALT) {
      _if_delay = false;
      const pcAddr = _PC * 2;
      const opcode = (_ROM_data[pcAddr] << 8) | _ROM_data[pcAddr + 1];

      switch (opcode >> 8) {
        case 0x0: {
          // jp_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0
          _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          exec_cycles = 5;
          break;
        }
        case 0x1: {
          // retd_l
          // PCSL←M(SP), PCSH←M(SP+1), PCP←M(SP+2) SP←SP+3, M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
          _PC = _NPC =
            (_PC & 0x1000) |
            (_RAM[_SP + 2] << 8) |
            (_RAM[_SP + 1] << 4) |
            _RAM[_SP];
          _SP = (_SP + 3) & 0xff;
          _IX < RAM_SIZE
            ? (_RAM[_IX] = opcode & 0x00f & 0xf)
            : set_mem(_IX, opcode & 0x00f);
          set_mem((_IX & 0xf00) | ((_IX + 1) & 0xff), (opcode >> 4) & 0x00f);
          _IX = (_IX & 0xf00) | ((_IX + 2) & 0xff);
          exec_cycles = 12;
          break;
        }
        case 0x2: {
          // jp_c_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=1
          if (_CF) {
            _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x3: {
          // jp_nc_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if C=0
          if (!_CF) {
            _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x4: {
          // call_s
          // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP←SP-3, PCP←NPP, PCS←s7~s0
          _RAM[(_SP - 1) & 0xff] = ((_PC + 1) >> 8) & 0x0f & 0xf;
          _RAM[(_SP - 2) & 0xff] = ((_PC + 1) >> 4) & 0x0f & 0xf;
          _SP = (_SP - 3) & 0xff;
          _RAM[_SP] = (_PC + 1) & 0x0f & 0xf;
          _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          exec_cycles = 7;
          break;
        }
        case 0x5: {
          // calz_s
          // M(SP-1)←PCP, M(SP-2)←PCSH, M(SP-3)←PCSL+1 SP←SP-3, PCP←0, PCS←s7~s0
          _RAM[(_SP - 1) & 0xff] = ((_PC + 1) >> 8) & 0x0f & 0xf;
          _RAM[(_SP - 2) & 0xff] = ((_PC + 1) >> 4) & 0x0f & 0xf;
          _SP = (_SP - 3) & 0xff;
          _RAM[_SP] = (_PC + 1) & 0x0f & 0xf;
          _PC = _NPC = (_NPC & 0x1000) | (opcode & 0x0ff);
          exec_cycles = 7;
          break;
        }
        case 0x6: {
          // jp_z_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=1
          if (_ZF) {
            _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x7: {
          // jp_nz_s
          // PCB←NBP, PCP←NPP, PCS←s7~s0 if Z=0
          if (!_ZF) {
            _PC = (_NPC & 0x1f00) | (opcode & 0x0ff);
          } else {
            _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          }
          exec_cycles = 5;
          break;
        }
        case 0x8: {
          // ld_y_y
          // YH←y7~y4, YL←y3~y0
          _IY = (_IY & 0xf00) | (opcode & 0x0ff);
          _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          exec_cycles = 5;
          break;
        }
        case 0x9: {
          // lbpx_mx_l
          // M(X)←l3~l0, M(X+1)←l7~l4, X←X+2
          _IX < RAM_SIZE
            ? (_RAM[_IX] = opcode & 0x00f & 0xf)
            : set_mem(_IX, opcode & 0x00f);
          set_mem((_IX & 0xf00) | ((_IX + 1) & 0xff), (opcode >> 4) & 0x00f);
          _IX = (_IX & 0xf00) | ((_IX + 2) & 0xff);
          _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
          exec_cycles = 5;
          break;
        }
        case 0xa: {
          switch ((opcode >> 4) & 0xf) {
            case 0x0: {
              // adc_xh_i
              // XH←XH+i3~i0+C
              const xh = ((_IX >> 4) & 0x00f) + (opcode & 0x00f) + _CF;
              _ZF = (xh & 0xf) === 0 ? 1 : 0;
              _CF = xh > 15 ? 1 : 0;
              _IX = (_IX & 0xf0f) | ((xh << 4) & 0x0f0);
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // adc_xl_i
              // XL←XL+i3~i0+C
              const xl = (_IX & 0x00f) + (opcode & 0x00f) + _CF;
              _ZF = (xl & 0xf) === 0 ? 1 : 0;
              _CF = xl > 15 ? 1 : 0;
              _IX = (_IX & 0xff0) | (xl & 0x00f);
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // adc_yh_i
              // YH←YH+i3~i0+C
              const yh = ((_IY >> 4) & 0x00f) + (opcode & 0x00f) + _CF;
              _ZF = (yh & 0xf) === 0 ? 1 : 0;
              _CF = yh > 15 ? 1 : 0;
              _IY = (_IY & 0xf0f) | ((yh << 4) & 0x0f0);
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // adc_yl_i
              // YL←YL+i3~i0+C
              const yl = (_IY & 0x00f) + (opcode & 0x00f) + _CF;
              _ZF = (yl & 0xf) === 0 ? 1 : 0;
              _CF = yl > 15 ? 1 : 0;
              _IY = (_IY & 0xff0) | (yl & 0x00f);
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x4: {
              // cp_xh_i
              // XH-i3~i0
              const cp = ((_IX >> 4) & 0x00f) - (opcode & 0x00f);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x5: {
              // cp_xl_i
              // XL-i3~i0
              const cp = (_IX & 0x00f) - (opcode & 0x00f);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x6: {
              // cp_yh_i
              // YH-i3~i0
              const cp = ((_IY >> 4) & 0x00f) - (opcode & 0x00f);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x7: {
              // cp_yl_i
              // YL-i3~i0
              const cp = (_IY & 0x00f) - (opcode & 0x00f);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) +
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) +
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) +
                _CF;
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _CF = res < 0 ? 1 : 0;
              if (_DF && res < 0) {
                res += 10;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                _CF;
              _CF = res < 0 ? 1 : 0;
              if (_DF && res < 0) {
                res += 10;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) &
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) |
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) ^
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0xf: {
              // rlc_r
              // d3←d2, d2←d1, d1←d0, d0←C, C←d3
              const r = opcode & 0x3;
              const res =
                ((r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) <<
                  1) +
                _CF;
              _CF = res > 15 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 0xb: {
          // ld_x_x
          // XH←x7~x4, XL←x3~x0
          _IX = (_IX & 0xf00) | (opcode & 0x0ff);
          _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) +
                (opcode & 0x00f);
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // adc_r_i
              // r←r+i3~i0+C
              const r = (opcode >> 4) & 0x3;
              let res =
                (r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) +
                (opcode & 0x00f) +
                _CF;
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // and_r_i
              // r←r && i3~i0
              const r = (opcode >> 4) & 0x3;
              const res =
                (r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) &
                opcode &
                0x00f;
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // or_r_i
              // r←r or i3~i0
              const r = (opcode >> 4) & 0x3;
              const res =
                (r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) |
                (opcode & 0x00f);
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) ^
                (opcode & 0x00f);
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf;
              } else if (r === 1) {
                _B = res & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE ? (_RAM[_IX] = res & 0xf) : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? (_RAM[_IY] = res & 0xf) : set_mem(_IY, res);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // sbc_r_i
              // r←r-i3~i0-C
              const r = (opcode >> 4) & 0x3;
              let res =
                (r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                (opcode & 0x00f) -
                _CF;
              _CF = res < 0 ? 1 : 0;
              if (_DF && _CF) {
                res += 10;
              }
              _ZF = (res & 0xf) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 0xf & 0xf;
              } else if (r === 1) {
                _B = res & 0xf & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = res & 0xf & 0xf)
                  : set_mem(_IX, res & 0xf);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = res & 0xf & 0xf)
                  : set_mem(_IY, res & 0xf);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x2: {
              // fan_r_i
              // r && i3~i0
              const r = (opcode >> 4) & 0x3;
              _ZF =
                ((r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) &
                  opcode &
                  0x00f) ===
                0
                  ? 1
                  : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x3: {
              // cp_r_i
              // r-i3~i0
              const r = (opcode >> 4) & 0x3;
              const cp =
                (r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                (opcode & 0x00f);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                _A = opcode & 0x00f & 0xf;
              } else if (r === 1) {
                _B = opcode & 0x00f & 0xf;
              } else if (r === 2) {
                _IX < RAM_SIZE
                  ? (_RAM[_IX] = opcode & 0x00f & 0xf)
                  : set_mem(_IX, opcode & 0x00f);
              } else {
                _IY < RAM_SIZE
                  ? (_RAM[_IY] = opcode & 0x00f & 0xf)
                  : set_mem(_IY, opcode & 0x00f);
              }
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0x1: {
              switch ((opcode >> 4) & 0x3) {
                case 0x0: // pset_p
                case 0x1: {
                  // pset_p
                  // NBP←p4, NPP←p3~p0
                  _if_delay = true;
                  _NPC = (opcode << 8) & 0x1f00;
                  _PC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // ldpx_mx_i
                  // M(X)←i3~i0, X←X+1
                  _IX < RAM_SIZE
                    ? (_RAM[_IX] = opcode & 0x00f & 0xf)
                    : set_mem(_IX, opcode & 0x00f);
                  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // ldpy_my_i
                  // M(Y)←i3~i0, Y←Y+1
                  _IY < RAM_SIZE
                    ? (_RAM[_IY] = opcode & 0x00f & 0xf)
                    : set_mem(_IY, opcode & 0x00f);
                  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  _IX =
                    ((r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) <<
                      8) |
                    (_IX & 0x0ff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x1: {
                  // ld_xh_r
                  // XH←r
                  const r = opcode & 0x3;
                  _IX =
                    ((r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) <<
                      4) |
                    (_IX & 0xf0f);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x2: {
                  // ld_xl_r
                  // XL←r
                  const r = opcode & 0x3;
                  _IX =
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) |
                    (_IX & 0xff0);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // rrc_r
                  // d3←C, d2←d3, d1←d2, d0←d1, C←d0
                  const r = opcode & 0x3;
                  const res =
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) +
                    (_CF << 4);
                  _CF = res & 0x1;
                  if (r === 0) {
                    _A = (res >> 1) & 0xf;
                  } else if (r === 1) {
                    _B = (res >> 1) & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (res >> 1) & 0xf)
                      : set_mem(_IX, res >> 1);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (res >> 1) & 0xf)
                      : set_mem(_IY, res >> 1);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // ld_yp_r
                  // YP←r
                  const r = opcode & 0x3;
                  _IY =
                    ((r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) <<
                      8) |
                    (_IY & 0x0ff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // ld_yh_r
                  // YH←r
                  const r = opcode & 0x3;
                  _IY =
                    ((r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) <<
                      4) |
                    (_IY & 0xf0f);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // ld_yl_r
                  // YL←r
                  const r = opcode & 0x3;
                  _IY =
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) |
                    (_IY & 0xff0);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A = (_IX >> 8) & 0xf;
                  } else if (r === 1) {
                    _B = (_IX >> 8) & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (_IX >> 8) & 0xf)
                      : set_mem(_IX, _IX >> 8);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (_IX >> 8) & 0xf)
                      : set_mem(_IY, _IX >> 8);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // ld_r_xh
                  // r←XH
                  const r = opcode & 0x3;
                  if (r === 0) {
                    _A = (_IX >> 4) & 0x00f & 0xf;
                  } else if (r === 1) {
                    _B = (_IX >> 4) & 0x00f & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (_IX >> 4) & 0x00f & 0xf)
                      : set_mem(_IX, (_IX >> 4) & 0x00f);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (_IX >> 4) & 0x00f & 0xf)
                      : set_mem(_IY, (_IX >> 4) & 0x00f);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // ld_r_xl
                  // r←XL
                  const r = opcode & 0x3;
                  if (r === 0) {
                    _A = _IX & 0x00f & 0xf;
                  } else if (r === 1) {
                    _B = _IX & 0x00f & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = _IX & 0x00f & 0xf)
                      : set_mem(_IX, _IX & 0x00f);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = _IX & 0x00f & 0xf)
                      : set_mem(_IY, _IX & 0x00f);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xc: {
                  // ld_r_yp
                  // r←YP
                  const r = opcode & 0x3;
                  if (r === 0) {
                    _A = (_IY >> 8) & 0xf;
                  } else if (r === 1) {
                    _B = (_IY >> 8) & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (_IY >> 8) & 0xf)
                      : set_mem(_IX, _IY >> 8);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (_IY >> 8) & 0xf)
                      : set_mem(_IY, _IY >> 8);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xd: {
                  // ld_r_yh
                  // r←YH
                  const r = opcode & 0x3;
                  if (r === 0) {
                    _A = (_IY >> 4) & 0x00f & 0xf;
                  } else if (r === 1) {
                    _B = (_IY >> 4) & 0x00f & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (_IY >> 4) & 0x00f & 0xf)
                      : set_mem(_IX, (_IY >> 4) & 0x00f);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (_IY >> 4) & 0x00f & 0xf)
                      : set_mem(_IY, (_IY >> 4) & 0x00f);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xe: {
                  // ld_r_yl
                  // r←YL
                  const r = opcode & 0x3;
                  if (r === 0) {
                    _A = _IY & 0x00f & 0xf;
                  } else if (r === 1) {
                    _B = _IY & 0x00f & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = _IY & 0x00f & 0xf)
                      : set_mem(_IX, _IY & 0x00f);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = _IY & 0x00f & 0xf)
                      : set_mem(_IY, _IY & 0x00f);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 1) {
                    _B =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 1) {
                    _B =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  }
                  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x3: {
                  // ldpy_r_q
                  // r←q, Y←Y+1
                  const r = (opcode >> 2) & 0x3;
                  const q = opcode & 0x3;
                  if (r === 0) {
                    _A =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 1) {
                    _B =
                      (q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY)) & 0xf;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0
                        ? _A
                        : q === 1
                          ? _B
                          : q === 2
                            ? _IX < RAM_SIZE
                              ? _RAM[_IX]
                              : get_mem(_IX)
                            : _IY < RAM_SIZE
                              ? _RAM[_IY]
                              : get_mem(_IY),
                    );
                  }
                  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) -
                (q === 0
                  ? _A
                  : q === 1
                    ? _B
                    : q === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY));
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x1: {
              // fan_r_q
              // r && q
              const r = (opcode >> 2) & 0x3;
              const q = opcode & 0x3;
              _ZF =
                ((r === 0
                  ? _A
                  : r === 1
                    ? _B
                    : r === 2
                      ? _IX < RAM_SIZE
                        ? _RAM[_IX]
                        : get_mem(_IX)
                      : _IY < RAM_SIZE
                        ? _RAM[_IY]
                        : get_mem(_IY)) &
                  (q === 0
                    ? _A
                    : q === 1
                      ? _B
                      : q === 2
                        ? _IX < RAM_SIZE
                          ? _RAM[_IX]
                          : get_mem(_IX)
                        : _IY < RAM_SIZE
                          ? _RAM[_IY]
                          : get_mem(_IY))) ===
                0
                  ? 1
                  : 0;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    (_IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX)) +
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) +
                    _CF;
                  _CF = res > 15 ? 1 : 0;
                  if (_DF && res > 9) {
                    res += 6;
                    _CF = 1;
                  }
                  _ZF = res & (0xf === 0) ? 1 : 0;
                  _IX < RAM_SIZE
                    ? (_RAM[_IX] = res & 0xf & 0xf)
                    : set_mem(_IX, res & 0xf);
                  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
                case 0x3: {
                  // acpy_my_r
                  // M(Y)←M(Y)+r+C, Y←Y+1
                  const r = opcode & 0x3;
                  let res =
                    (_IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) +
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) +
                    _CF;
                  _CF = res > 15 ? 1 : 0;
                  if (_DF && res > 9) {
                    res += 6;
                    _CF = 1;
                  }
                  _ZF = res & (0xf === 0) ? 1 : 0;
                  _IY < RAM_SIZE
                    ? (_RAM[_IY] = res & 0xf & 0xf)
                    : set_mem(_IY, res & 0xf);
                  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    (_IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX)) -
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) -
                    _CF;
                  _CF = res < 0 ? 1 : 0;
                  if (_DF && res < 0) {
                    res += 10;
                  }
                  _ZF = res & (0xf === 0) ? 1 : 0;
                  _IX < RAM_SIZE
                    ? (_RAM[_IX] = res & 0xf & 0xf)
                    : set_mem(_IX, res & 0xf);
                  _IX = (_IX & 0xf00) | ((_IX + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
                case 0x3: {
                  // scpy_my_r
                  // M(Y)←M(Y)-r-C, Y←Y+1
                  const r = opcode & 0x3;
                  let res =
                    (_IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) -
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) -
                    _CF;
                  _CF = res < 0 ? 1 : 0;
                  if (_DF && res < 0) {
                    res += 10;
                  }
                  _ZF = res & (0xf === 0) ? 1 : 0;
                  _IY < RAM_SIZE
                    ? (_RAM[_IY] = res & 0xf & 0xf)
                    : set_mem(_IY, res & 0xf);
                  _IY = (_IY & 0xf00) | ((_IY + 1) & 0xff);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 0x4: {
              // set_f_i
              // F←F or i3~i0
              _CF |= opcode & 0x001;
              _ZF |= (opcode >> 1) & 0x001;
              _DF |= (opcode >> 2) & 0x001;
              const new_IF = (opcode >> 3) & 0x001;
              _if_delay = new_IF && !_IF;
              _IF |= new_IF;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x5: {
              // rst_f_i
              // F←F && ~i3~i0
              _CF &= opcode;
              _ZF &= opcode >> 1;
              _DF &= opcode >> 2;
              _IF &= opcode >> 3;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x6: {
              // inc_mn
              // M(n3~n0)←M(n3~n0)+1
              const mn = opcode & 0x00f;
              const res = _RAM[mn] + 1;
              _ZF = res === 16 ? 1 : 0;
              _CF = res > 15 ? 1 : 0;
              _RAM[mn] = res & 0xf & 0xf;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x7: {
              // dec_mn
              // M(n3~n0)←M(n3~n0)-1
              const mn = opcode & 0x00f;
              const res = _RAM[mn] - 1;
              _ZF = res === 0 ? 1 : 0;
              _CF = res < 0 ? 1 : 0;
              _RAM[mn] = res & 0xf & 0xf;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 7;
              break;
            }
            case 0x8: {
              // ld_mn_a
              // M(n3~n0)←A
              _RAM[opcode & 0x00f] = _A & 0xf & 0xf;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0x9: {
              // ld_mn_b
              // M(n3~n0)←B
              _RAM[opcode & 0x00f] = _B & 0xf & 0xf;
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0xa: {
              // ld_a_mn
              // A←M(n3~n0)
              _A = _RAM[opcode & 0x00f];
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
              exec_cycles = 5;
              break;
            }
            case 0xb: {
              // ld_b_mn
              // B←M(n3~n0)
              _B = _RAM[opcode & 0x00f];
              _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  _SP = (_SP - 1) & 0xff;
                  set_mem(
                    _SP,
                    r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY),
                  );
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // push_xp
                  // SP←SP-1, M(SP)←XP
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = (_IX >> 8) & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // push_xh
                  // SP←SP-1, M(SP)←XH
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = (_IX >> 4) & 0x00f & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // push_xl
                  // SP←SP-1, M(SP)←XL
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = _IX & 0x00f & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x7: {
                  // push_yp
                  // SP←SP-1, M(SP)←YP
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = (_IY >> 8) & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // push_yh
                  // SP←SP-1, M(SP)←YH
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = (_IY >> 4) & 0x00f & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // push_yl
                  // SP←SP-1, M(SP)←YL
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] = _IY & 0x00f & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // push_f
                  // SP←SP-1, M(SP)←F
                  _SP = (_SP - 1) & 0xff;
                  _RAM[_SP] =
                    ((_IF << 3) | (_DF << 2) | (_ZF << 1) | _CF) & 0xf;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xb: {
                  // dec_sp
                  // SP←SP-1
                  _SP = (_SP - 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A = _RAM[_SP] & 0xf;
                  } else if (r === 1) {
                    _B = _RAM[_SP] & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = _RAM[_SP] & 0xf)
                      : set_mem(_IX, _RAM[_SP]);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = _RAM[_SP] & 0xf)
                      : set_mem(_IY, _RAM[_SP]);
                  }
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x4: {
                  // pop_xp
                  // XP←M(SP), SP←SP+1
                  _IX = (_RAM[_SP] << 8) | (_IX & 0x0ff);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x5: {
                  // pop_xh
                  // XH←M(SP), SP←SP+1
                  _IX = (_RAM[_SP] << 4) | (_IX & 0xf0f);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x6: {
                  // pop_xl
                  // XL←M(SP), SP←SP+1
                  _IX = _RAM[_SP] | (_IX & 0xff0);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x7: {
                  // pop_yp
                  // YP←M(SP), SP←SP+1
                  _IY = (_RAM[_SP] << 8) | (_IY & 0x0ff);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // pop_yh
                  // YH←M(SP), SP←SP+1
                  _IY = (_RAM[_SP] << 4) | (_IY & 0xf0f);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x9: {
                  // pop_yl
                  // YL←M(SP), SP←SP+1
                  _IY = _RAM[_SP] | (_IY & 0xff0);
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xa: {
                  // pop_f
                  // F←M(SP), SP←SP+1
                  const f = _RAM[_SP];
                  _CF = f & 0x1;
                  _ZF = (f >> 1) & 0x1;
                  _DF = (f >> 2) & 0x1;
                  const new_IF = (f >> 3) & 0x1;
                  _if_delay = new_IF && !_IF;
                  _IF = new_IF;
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0xb: {
                  // inc_sp
                  // SP←SP+1
                  _SP = (_SP + 1) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  _PC =
                    (_PC & 0x1000) |
                    _RAM[_SP] |
                    (_RAM[_SP + 1] << 4) |
                    (_RAM[_SP + 2] << 8);
                  _SP = (_SP + 3) & 0xff;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 12;
                  break;
                }
                case 0xf: {
                  // ret
                  // PCSL←M(SP), PCSH←M(SP+1), PCP←M(SP+2) SP←SP+3
                  _PC = _NPC =
                    (_PC & 0x1000) |
                    _RAM[_SP] |
                    (_RAM[_SP + 1] << 4) |
                    (_RAM[_SP + 2] << 8);
                  _SP = (_SP + 3) & 0xff;
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
                  _SP =
                    ((r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) <<
                      4) |
                    (_SP & 0x0f);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A = (_SP >> 4) & 0xf;
                  } else if (r === 1) {
                    _B = (_SP >> 4) & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = (_SP >> 4) & 0xf)
                      : set_mem(_IX, _SP >> 4);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = (_SP >> 4) & 0xf)
                      : set_mem(_IY, _SP >> 4);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // jpba
                  // PCB←NBP, PCP←NPP, PCSH←B, PCSL←A
                  _PC = (_NPC & 0x1f00) | (_B << 4) | _A;
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
                  _SP =
                    (r === 0
                      ? _A
                      : r === 1
                        ? _B
                        : r === 2
                          ? _IX < RAM_SIZE
                            ? _RAM[_IX]
                            : get_mem(_IX)
                          : _IY < RAM_SIZE
                            ? _RAM[_IY]
                            : get_mem(_IY)) |
                    (_SP & 0xf0);
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                    _A = _SP & 0x0f & 0xf;
                  } else if (r === 1) {
                    _B = _SP & 0x0f & 0xf;
                  } else if (r === 2) {
                    _IX < RAM_SIZE
                      ? (_RAM[_IX] = _SP & 0x0f & 0xf)
                      : set_mem(_IX, _SP & 0x0f);
                  } else {
                    _IY < RAM_SIZE
                      ? (_RAM[_IY] = _SP & 0x0f & 0xf)
                      : set_mem(_IY, _SP & 0x0f);
                  }
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
                  exec_cycles = 5;
                  break;
                }
                case 0x8: {
                  // halt
                  _HALT = 1;
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
                  _PC = _NPC = (_PC & 0x1000) | ((_PC + 1) & 0xfff);
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
      _instr_counter += 1;
    }

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

    if (!(_CTRL_OSC & IO_CLKCHG)) {
      // Normal mode: exec_cycles == number of OSC1 ticks elapsed.
      // Batch all counter updates instead of calling _clock_OSC1() exec_cycles times.
      _snd_cycle += exec_cycles;
      if (_snd_active) {
        if (_snd_one_shot > 0) {
          _snd_one_shot -= exec_cycles;
          if (_snd_one_shot <= 0) {
            _tone_generator.stop(_snd_cycle / OSC1_CLOCK);
          }
        }
        if (_snd_envelope > 0) {
          _snd_envelope -= exec_cycles;
          if (_snd_envelope <= 0) {
            _snd_envelope_step -= 1;
            _tone_generator.play(
              _snd_buzzer_freq,
              false,
              1 / (8 - _snd_envelope_step),
              _snd_cycle / OSC1_CLOCK,
            );
            _snd_envelope = _snd_envelope_cycle;
          }
        }
        _snd_active = _snd_one_shot > 0 || _snd_envelope > 0;
      }

      if ((_PTC & IO_PTC) > 1) {
        _ptimer_counter -= exec_cycles;
        if (_ptimer_counter <= 0) {
          _ptimer_counter += PTIMER_CLOCK_DIV[_PTC & IO_PTC];
          _process_ptimer();
        }
      }

      _stopwatch_counter -= exec_cycles;
      if (_stopwatch_counter <= 0) {
        _stopwatch_counter += STOPWATCH_CLOCK_DIV;
        _process_stopwatch();
      }

      _timer_counter -= exec_cycles;
      if (_timer_counter <= 0) {
        _timer_counter += TIMER_CLOCK_DIV;
        _process_timer();
      }

      exec_cycles *= _OSC1_clock_div;
    } else {
      // IO_CLKCHG mode: CPU runs on high-frequency oscillator; OSC1 advances
      // fractionally per CPU cycle, so use the original counter-based approach.
      _OSC1_counter -= exec_cycles;
      while (_OSC1_counter <= 0) {
        _OSC1_counter += _OSC1_clock_div;
        _clock_OSC1();
      }
    }

    return exec_cycles;
  }

  get_mem(addr) {
    return get_mem(addr);
  }

  set_mem(addr, value) {
    set_mem(addr, value);
  }

  get_A() {
    return _A;
  }

  set_A(value) {
    _A = value & 0xf;
  }

  get_B() {
    return _B;
  }

  set_B(value) {
    _B = value & 0xf;
  }

  get_MX() {
    return _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX);
  }

  set_MX(value) {
    _IX < RAM_SIZE ? (_RAM[_IX] = value & 0xf) : set_mem(_IX, value);
  }

  get_MY() {
    return _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY);
  }

  set_MY(value) {
    _IY < RAM_SIZE ? (_RAM[_IY] = value & 0xf) : set_mem(_IY, value);
  }

  get_NPC() {
    return _NPC;
  }

  get_SP() {
    return _SP;
  }

  get_IX() {
    return _IX;
  }

  get_IY() {
    return _IY;
  }
}
