(() => {
  // utils/rom.js
  var ROM = class {
    constructor(data) {
      this._data = data;
    }
    getWord(address) {
      return this._data[address] << 8 | this._data[address + 1];
    }
    size() {
      return this._data.length;
    }
  };

  // utils/cpu.js
  var OSC1_CLOCK = 32768;
  var SND_BUZZER_FREQ_DIV = [8, 10, 12, 14, 16, 20, 24, 28];
  var SND_ONE_SHOT_DIV = [8 * 128, 16 * 128];
  var SND_ENVELOPE_CYCLE_DIV = [16 * 128, 32 * 128];
  var TIMER_CLOCK_DIV = OSC1_CLOCK / 256;
  var STOPWATCH_CLOCK_DIV = OSC1_CLOCK / 100;
  var PTIMER_CLOCK_DIV = new Uint8Array([
    0,
    0,
    OSC1_CLOCK / 256,
    OSC1_CLOCK / 512,
    OSC1_CLOCK / 1024,
    OSC1_CLOCK / 2048,
    OSC1_CLOCK / 4096,
    OSC1_CLOCK / 8192
  ]);
  var RAM_SIZE = 768;
  var VRAM_SIZE = 160;
  var VRAM_PART_SIZE = 80;
  var VRAM_PART1_OFFSET = 3584;
  var VRAM_PART2_OFFSET = 3712;
  var VRAM_PART1_END = VRAM_PART1_OFFSET + VRAM_PART_SIZE;
  var VRAM_PART2_END = VRAM_PART2_OFFSET + VRAM_PART_SIZE;
  var IORAM_OFFSET = 3840;
  var IORAM_SIZE = 127;
  var IORAM_END = IORAM_OFFSET + IORAM_SIZE;
  var EMPTY_VRAM = new Uint8Array(VRAM_SIZE);
  var EMPTY_VRAM_WORDS = new Uint16Array(EMPTY_VRAM.buffer);
  var FULL_VRAM = new Uint8Array(VRAM_SIZE).fill(1);
  var FULL_VRAM_WORDS = new Uint16Array(FULL_VRAM.buffer);
  var IO_IT1 = 8;
  var IO_IT2 = 4;
  var IO_IT8 = 2;
  var IO_IT32 = 1;
  var IO_ISW0 = 2;
  var IO_ISW1 = 1;
  var IO_IPT = 1;
  var IO_IK0 = 1;
  var IO_IK1 = 1;
  var IO_TM2 = 4;
  var IO_TM7 = 8;
  var IO_TM6 = 4;
  var IO_TM4 = 1;
  var IO_R33 = 8;
  var IO_R43 = 8;
  var IO_CLKCHG = 8;
  var IO_ALOFF = 8;
  var IO_ALON = 4;
  var IO_SHOTPW = 8;
  var IO_BZFQ = 7;
  var IO_BZSHOT = 8;
  var IO_ENVRST = 4;
  var IO_ENVRT = 2;
  var IO_ENVON = 1;
  var IO_TMRST = 2;
  var IO_SWRST = 2;
  var IO_SWRUN = 1;
  var IO_PTRST = 2;
  var IO_PTRUN = 1;
  var IO_PTCOUT = 8;
  var IO_PTC = 7;
  var IO_IOC3 = 8;
  var IO_IOC2 = 4;
  var IO_IOC1 = 2;
  var IO_IOC0 = 1;
  var IO_PUP3 = 8;
  var IO_PUP2 = 4;
  var IO_PUP1 = 2;
  var IO_PUP0 = 1;
  var mask = {
    port_pullup: {
      K0: 15,
      K1: 15
    },
    p3_dedicated: 0
  };
  var _PC = 0;
  var _NPC = 0;
  var _A = 0;
  var _B = 0;
  var _CF = 0;
  var _ZF = 0;
  var _DF = 0;
  var _SP = 0;
  var _IX = 0;
  var _IY = 0;
  var _IF = 0;
  var _HALT = 0;
  var _RESET = 0;
  var _if_delay = false;
  var _instr_counter = 0;
  var _ROM_data = null;
  var _RAM = null;
  var _ROM = null;
  var _tone_generator = null;
  var _snd_cycle = 0;
  var _snd_one_shot = 0;
  var _snd_envelope = 0;
  var _snd_envelope_step = 0;
  var _snd_envelope_cycle = 0;
  var _snd_buzzer_freq = 0;
  var _snd_on = false;
  var _snd_envelope_on = false;
  var _snd_active = false;
  var _port_pullup = null;
  var _p3_dedicated = 0;
  var _OSC1_clock_div = 0;
  var _OSC1_counter = 0;
  var _timer_counter = 0;
  var _ptimer_counter = 0;
  var _stopwatch_counter = 0;
  var _VRAM = null;
  var _VRAM_words = null;
  var _P0_OUTPUT_DATA = 0;
  var _P1_OUTPUT_DATA = 0;
  var _P2_OUTPUT_DATA = 0;
  var _P3_OUTPUT_DATA = 0;
  var _IT = 0;
  var _ISW = 0;
  var _IPT = 0;
  var _ISIO = 0;
  var _IK0 = 0;
  var _IK1 = 0;
  var _EIT = 0;
  var _EISW = 0;
  var _EIPT = 0;
  var _EISIO = 0;
  var _EIK0 = 0;
  var _EIK1 = 0;
  var _TM = 0;
  var _SWL = 0;
  var _SWH = 0;
  var _PT = 0;
  var _PRD = 0;
  var _RD = 0;
  var _SD = 0;
  var _K0 = 0;
  var _DFK0 = 0;
  var _K1 = 0;
  var _R0 = 0;
  var _R1 = 0;
  var _R2 = 0;
  var _R3 = 0;
  var _R4 = 0;
  var _P0 = 0;
  var _P1 = 0;
  var _P2 = 0;
  var _P3 = 0;
  var _CTRL_OSC = 0;
  var _CTRL_LCD = 0;
  var _LC = 0;
  var _CTRL_BZ1 = 0;
  var _CTRL_BZ2 = 0;
  var _CTRL_SW = 0;
  var _CTRL_PT = 0;
  var _PTC = 0;
  var _IOC = 0;
  var _PUP = 0;
  function _initRegisters() {
    _A = 0;
    _B = 0;
    _IX = 0;
    _IY = 0;
    _SP = 0;
    _PC = 256;
    _NPC = 256;
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
    _DFK0 = 15;
    _K1 = _port_pullup.K1;
    _R0 = 0;
    _R1 = 0;
    _R2 = 0;
    _R3 = 0;
    _R4 = 15;
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
            _snd_cycle / OSC1_CLOCK
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
    _PT = _PT - 1 & 255;
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
    const new_TM = _TM + 1 & 255;
    if ((new_TM & IO_TM2) < (_TM & IO_TM2)) {
      _IT |= IO_IT32;
    }
    if ((new_TM >> 4 & IO_TM4) < (_TM >> 4 & IO_TM4)) {
      _IT |= IO_IT8;
    }
    if ((new_TM >> 4 & IO_TM6) < (_TM >> 4 & IO_TM6)) {
      _IT |= IO_IT2;
    }
    if ((new_TM >> 4 & IO_TM7) < (_TM >> 4 & IO_TM7)) {
      _IT |= IO_IT1;
    }
    _TM = new_TM;
  }
  function _interrupt(vector) {
    _RAM[_SP - 1 & 255] = _PC >> 8 & 15 & 15;
    _RAM[_SP - 2 & 255] = _PC >> 4 & 15 & 15;
    _SP = _SP - 3 & 255;
    _RAM[_SP] = _PC & 15 & 15;
    _IF = 0;
    _HALT = 0;
    _PC = _NPC = _NPC & 4096 | 256 | vector;
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
        case 0: {
          const ret = _IT;
          _IT = 0;
          return ret;
        }
        case 1: {
          const ret = _ISW;
          _ISW = 0;
          return ret;
        }
        case 2: {
          const ret = _IPT;
          _IPT = 0;
          return ret;
        }
        case 3: {
          const ret = _ISIO;
          _ISIO = 0;
          return ret;
        }
        case 4: {
          const ret = _IK0;
          _IK0 = 0;
          return ret;
        }
        case 5: {
          const ret = _IK1;
          _IK1 = 0;
          return ret;
        }
        case 16:
          return _EIT;
        case 17:
          return _EISW;
        case 18:
          return _EIPT;
        case 19:
          return _EISIO;
        case 20:
          return _EIK0;
        case 21:
          return _EIK1;
        case 32:
          return _TM & 15;
        case 33:
          return _TM >> 4 & 15;
        case 34:
          return _SWL & 15;
        case 35:
          return _SWH & 15;
        case 36:
          return _PT & 15;
        case 37:
          return _PT >> 4 & 15;
        case 38:
          return _PRD & 15;
        // TODO: _PRD does not exist?
        case 39:
          return _RD >> 4 & 15;
        case 48:
          return _SD & 15;
        case 49:
          return _SD >> 4 & 15;
        case 64:
          return _K0;
        case 65:
          return _DFK0;
        case 66:
          return _K1;
        case 80:
          return _R0;
        case 81:
          return _R1;
        case 82:
          return _R2;
        case 83:
          return _R3;
        case 84:
          return _R4;
        case 96:
          return _P0;
        case 97:
          return _P1;
        case 98:
          return _P2;
        case 99:
          return _P3;
        case 112:
          return _CTRL_OSC;
        case 113:
          return _CTRL_LCD;
        case 114:
          return _LC;
        case 115:
          return 0;
        case 116:
          return _CTRL_BZ1;
        case 117: {
          const isOneShotRinging = _snd_one_shot > 0 ? 1 : 0;
          return _CTRL_BZ2 & (IO_ENVRT | IO_ENVON) | IO_BZSHOT * isOneShotRinging;
        }
        case 119:
          return _CTRL_SW & IO_SWRUN;
        case 120:
          return _CTRL_PT & IO_PTRUN;
        case 121:
          return _PTC;
        case 125:
          return _IOC;
        case 126:
          return _PUP;
        default:
          return 0;
      }
    }
    return 0;
  }
  function set_mem(addr, value) {
    if (addr < RAM_SIZE) {
      _RAM[addr] = value & 15;
    } else if (addr >= VRAM_PART1_OFFSET && addr < VRAM_PART1_END) {
      _VRAM[addr - VRAM_PART1_OFFSET] = value & 15;
    } else if (addr >= VRAM_PART2_OFFSET && addr < VRAM_PART2_END) {
      _VRAM[addr - VRAM_PART2_OFFSET + VRAM_PART_SIZE] = value & 15;
    } else if (addr >= IORAM_OFFSET && addr < IORAM_END) {
      switch (addr - IORAM_OFFSET) {
        case 16:
          _EIT = value;
          break;
        case 17:
          _EISW = value & 3;
          break;
        case 18:
          _EIPT = value & 1;
          break;
        case 19:
          _EISIO = value & 1;
          break;
        case 20:
          _EIK0 = value;
          break;
        case 21:
          _EIK1 = value;
          break;
        case 38:
          _RD = _RD & 240 | value & 15;
          break;
        case 39:
          _RD = _RD & 15 | value << 4 & 240;
          break;
        case 48:
          _SD = _SD & 240 | value & 15;
          break;
        case 49:
          _SD = _SD & 15 | value << 4 & 240;
          break;
        case 80:
          _R0 = value;
          break;
        case 81:
          _R1 = value;
          break;
        case 82:
          _R2 = value;
          break;
        case 83:
          _R3 = value;
          break;
        case 84: {
          _R4 = value;
          if (value & IO_R43) {
            _snd_set_buzzer_off();
          } else {
            _snd_set_buzzer_on();
          }
          break;
        }
        case 96: {
          _P0_OUTPUT_DATA = value;
          if (_IOC & IO_IOC0) {
            _P0 = value;
          }
          break;
        }
        case 97: {
          _P1_OUTPUT_DATA = value;
          if (_IOC & IO_IOC1) {
            _P1 = value;
          }
          break;
        }
        case 98: {
          _P2_OUTPUT_DATA = value;
          if (_IOC & IO_IOC2) {
            _P2 = value;
          }
          break;
        }
        case 99: {
          _P3_OUTPUT_DATA = value;
          if (_IOC & IO_IOC3 || _p3_dedicated) {
            _P3 = value;
          }
          break;
        }
        case 112:
          _CTRL_OSC = value;
          break;
        case 113:
          _CTRL_LCD = value;
          break;
        case 114:
          _LC = value;
          break;
        case 116: {
          _CTRL_BZ1 = value;
          _snd_set_freq(_CTRL_BZ1 & IO_BZFQ);
          break;
        }
        case 117: {
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
        case 118: {
          if (value & IO_TMRST) {
            _TM = 0;
          }
          break;
        }
        case 119: {
          if (value & IO_SWRST) {
            _SWL = _SWH = 0;
          }
          _CTRL_SW = value & IO_SWRUN;
          break;
        }
        case 120: {
          if (value & IO_PTRST) {
            _PT = _RD;
          }
          _CTRL_PT = value & IO_PTRUN;
          break;
        }
        case 121:
          _PTC = value;
          break;
        case 125: {
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
        case 126:
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
          _snd_cycle / OSC1_CLOCK
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
  function _clock() {
    let exec_cycles = 7;
    if (_RESET) {
      return exec_cycles;
    }
    if (!_HALT) {
      _if_delay = false;
      const pcAddr = _PC * 2;
      const opcode = _ROM_data[pcAddr] << 8 | _ROM_data[pcAddr + 1];
      switch (opcode >> 8) {
        case 0: {
          _PC = _NPC & 7936 | opcode & 255;
          exec_cycles = 5;
          break;
        }
        case 1: {
          _PC = _NPC = _PC & 4096 | _RAM[_SP + 2] << 8 | _RAM[_SP + 1] << 4 | _RAM[_SP];
          _SP = _SP + 3 & 255;
          _IX < RAM_SIZE ? _RAM[_IX] = opcode & 15 & 15 : set_mem(_IX, opcode & 15);
          set_mem(_IX & 3840 | _IX + 1 & 255, opcode >> 4 & 15);
          _IX = _IX & 3840 | _IX + 2 & 255;
          exec_cycles = 12;
          break;
        }
        case 2: {
          if (_CF) {
            _PC = _NPC & 7936 | opcode & 255;
          } else {
            _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          }
          exec_cycles = 5;
          break;
        }
        case 3: {
          if (!_CF) {
            _PC = _NPC & 7936 | opcode & 255;
          } else {
            _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          }
          exec_cycles = 5;
          break;
        }
        case 4: {
          _RAM[_SP - 1 & 255] = _PC + 1 >> 8 & 15 & 15;
          _RAM[_SP - 2 & 255] = _PC + 1 >> 4 & 15 & 15;
          _SP = _SP - 3 & 255;
          _RAM[_SP] = _PC + 1 & 15 & 15;
          _PC = _NPC & 7936 | opcode & 255;
          exec_cycles = 7;
          break;
        }
        case 5: {
          _RAM[_SP - 1 & 255] = _PC + 1 >> 8 & 15 & 15;
          _RAM[_SP - 2 & 255] = _PC + 1 >> 4 & 15 & 15;
          _SP = _SP - 3 & 255;
          _RAM[_SP] = _PC + 1 & 15 & 15;
          _PC = _NPC = _NPC & 4096 | opcode & 255;
          exec_cycles = 7;
          break;
        }
        case 6: {
          if (_ZF) {
            _PC = _NPC & 7936 | opcode & 255;
          } else {
            _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          }
          exec_cycles = 5;
          break;
        }
        case 7: {
          if (!_ZF) {
            _PC = _NPC & 7936 | opcode & 255;
          } else {
            _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          }
          exec_cycles = 5;
          break;
        }
        case 8: {
          _IY = _IY & 3840 | opcode & 255;
          _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          exec_cycles = 5;
          break;
        }
        case 9: {
          _IX < RAM_SIZE ? _RAM[_IX] = opcode & 15 & 15 : set_mem(_IX, opcode & 15);
          set_mem(_IX & 3840 | _IX + 1 & 255, opcode >> 4 & 15);
          _IX = _IX & 3840 | _IX + 2 & 255;
          _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          exec_cycles = 5;
          break;
        }
        case 10: {
          switch (opcode >> 4 & 15) {
            case 0: {
              const xh = (_IX >> 4 & 15) + (opcode & 15) + _CF;
              _ZF = (xh & 15) === 0 ? 1 : 0;
              _CF = xh > 15 ? 1 : 0;
              _IX = _IX & 3855 | xh << 4 & 240;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 1: {
              const xl = (_IX & 15) + (opcode & 15) + _CF;
              _ZF = (xl & 15) === 0 ? 1 : 0;
              _CF = xl > 15 ? 1 : 0;
              _IX = _IX & 4080 | xl & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 2: {
              const yh = (_IY >> 4 & 15) + (opcode & 15) + _CF;
              _ZF = (yh & 15) === 0 ? 1 : 0;
              _CF = yh > 15 ? 1 : 0;
              _IY = _IY & 3855 | yh << 4 & 240;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 3: {
              const yl = (_IY & 15) + (opcode & 15) + _CF;
              _ZF = (yl & 15) === 0 ? 1 : 0;
              _CF = yl > 15 ? 1 : 0;
              _IY = _IY & 4080 | yl & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 4: {
              const cp = (_IX >> 4 & 15) - (opcode & 15);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 5: {
              const cp = (_IX & 15) - (opcode & 15);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 6: {
              const cp = (_IY >> 4 & 15) - (opcode & 15);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 7: {
              const cp = (_IY & 15) - (opcode & 15);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 8: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 9: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + _CF;
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 10: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _CF = res < 0 ? 1 : 0;
              if (_DF && res < 0) {
                res += 10;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 11: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - _CF;
              _CF = res < 0 ? 1 : 0;
              if (_DF && res < 0) {
                res += 10;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 12: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 13: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) | (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 14: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) ^ (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 15: {
              const r = opcode & 3;
              const res = ((r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 1) + _CF;
              _CF = res > 15 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 11: {
          _IX = _IX & 3840 | opcode & 255;
          _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
          exec_cycles = 5;
          break;
        }
        case 12: {
          switch (opcode >> 6 & 3) {
            case 0: {
              const r = opcode >> 4 & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (opcode & 15);
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 1: {
              const r = opcode >> 4 & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (opcode & 15) + _CF;
              _CF = res > 15 ? 1 : 0;
              if (_DF && res > 9) {
                res += 6;
                _CF = 1;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 2: {
              const r = opcode >> 4 & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & opcode & 15;
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 3: {
              const r = opcode >> 4 & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) | opcode & 15;
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 13: {
          switch (opcode >> 6 & 3) {
            case 0: {
              const r = opcode >> 4 & 3;
              const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) ^ opcode & 15;
              _ZF = res === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15;
              } else if (r === 1) {
                _B = res & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 : set_mem(_IX, res);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 : set_mem(_IY, res);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 1: {
              const r = opcode >> 4 & 3;
              let res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (opcode & 15) - _CF;
              _CF = res < 0 ? 1 : 0;
              if (_DF && _CF) {
                res += 10;
              }
              _ZF = (res & 15) === 0 ? 1 : 0;
              if (r === 0) {
                _A = res & 15 & 15;
              } else if (r === 1) {
                _B = res & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 2: {
              const r = opcode >> 4 & 3;
              _ZF = ((r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & opcode & 15) === 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 3: {
              const r = opcode >> 4 & 3;
              const cp = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (opcode & 15);
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
          }
          break;
        }
        case 14: {
          switch (opcode >> 6 & 3) {
            case 0: {
              const r = opcode >> 4 & 3;
              if (r === 0) {
                _A = opcode & 15 & 15;
              } else if (r === 1) {
                _B = opcode & 15 & 15;
              } else if (r === 2) {
                _IX < RAM_SIZE ? _RAM[_IX] = opcode & 15 & 15 : set_mem(_IX, opcode & 15);
              } else {
                _IY < RAM_SIZE ? _RAM[_IY] = opcode & 15 & 15 : set_mem(_IY, opcode & 15);
              }
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 5;
              break;
            }
            case 1: {
              switch (opcode >> 4 & 3) {
                case 0:
                // pset_p
                case 1: {
                  _if_delay = true;
                  _NPC = opcode << 8 & 7936;
                  _PC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 2: {
                  _IX < RAM_SIZE ? _RAM[_IX] = opcode & 15 & 15 : set_mem(_IX, opcode & 15);
                  _IX = _IX & 3840 | _IX + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 3: {
                  _IY < RAM_SIZE ? _RAM[_IY] = opcode & 15 & 15 : set_mem(_IY, opcode & 15);
                  _IY = _IY & 3840 | _IY + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 2: {
              switch (opcode >> 2 & 15) {
                case 0: {
                  const r = opcode & 3;
                  _IX = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 8 | _IX & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 1: {
                  const r = opcode & 3;
                  _IX = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 4 | _IX & 3855;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 2: {
                  const r = opcode & 3;
                  _IX = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) | _IX & 4080;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 3: {
                  const r = opcode & 3;
                  const res = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (_CF << 4);
                  _CF = res & 1;
                  if (r === 0) {
                    _A = res >> 1 & 15;
                  } else if (r === 1) {
                    _B = res >> 1 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = res >> 1 & 15 : set_mem(_IX, res >> 1);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = res >> 1 & 15 : set_mem(_IY, res >> 1);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 4: {
                  const r = opcode & 3;
                  _IY = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 8 | _IY & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 5: {
                  const r = opcode & 3;
                  _IY = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 4 | _IY & 3855;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 6: {
                  const r = opcode & 3;
                  _IY = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) | _IY & 4080;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 7:
                // dummy
                case 11:
                // dummy
                case 15: {
                  exec_cycles = 5;
                  break;
                }
                case 8: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IX >> 8 & 15;
                  } else if (r === 1) {
                    _B = _IX >> 8 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IX >> 8 & 15 : set_mem(_IX, _IX >> 8);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IX >> 8 & 15 : set_mem(_IY, _IX >> 8);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 9: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IX >> 4 & 15 & 15;
                  } else if (r === 1) {
                    _B = _IX >> 4 & 15 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IX >> 4 & 15 & 15 : set_mem(_IX, _IX >> 4 & 15);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IX >> 4 & 15 & 15 : set_mem(_IY, _IX >> 4 & 15);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 10: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IX & 15 & 15;
                  } else if (r === 1) {
                    _B = _IX & 15 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IX & 15 & 15 : set_mem(_IX, _IX & 15);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IX & 15 & 15 : set_mem(_IY, _IX & 15);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 12: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IY >> 8 & 15;
                  } else if (r === 1) {
                    _B = _IY >> 8 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IY >> 8 & 15 : set_mem(_IX, _IY >> 8);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IY >> 8 & 15 : set_mem(_IY, _IY >> 8);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 13: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IY >> 4 & 15 & 15;
                  } else if (r === 1) {
                    _B = _IY >> 4 & 15 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IY >> 4 & 15 & 15 : set_mem(_IX, _IY >> 4 & 15);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IY >> 4 & 15 & 15 : set_mem(_IY, _IY >> 4 & 15);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 14: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _IY & 15 & 15;
                  } else if (r === 1) {
                    _B = _IY & 15 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _IY & 15 & 15 : set_mem(_IX, _IY & 15);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _IY & 15 & 15 : set_mem(_IY, _IY & 15);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 3: {
              switch (opcode >> 4 & 3) {
                case 0: {
                  const r = opcode >> 2 & 3;
                  const q = opcode & 3;
                  if (r === 0) {
                    _A = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 1) {
                    _B = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 1: {
                  exec_cycles = 5;
                  break;
                }
                case 2: {
                  const r = opcode >> 2 & 3;
                  const q = opcode & 3;
                  if (r === 0) {
                    _A = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 1) {
                    _B = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  }
                  _IX = _IX & 3840 | _IX + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 3: {
                  const r = opcode >> 2 & 3;
                  const q = opcode & 3;
                  if (r === 0) {
                    _A = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 1) {
                    _B = (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & 15;
                  } else if (r === 2) {
                    set_mem(
                      _IX,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  } else {
                    set_mem(
                      _IY,
                      q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                    );
                  }
                  _IY = _IY & 3840 | _IY + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
        case 15: {
          switch (opcode >> 4 & 15) {
            case 0: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              const cp = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY));
              _ZF = cp === 0 ? 1 : 0;
              _CF = cp < 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 1: {
              const r = opcode >> 2 & 3;
              const q = opcode & 3;
              _ZF = ((r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) & (q === 0 ? _A : q === 1 ? _B : q === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY))) === 0 ? 1 : 0;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 2: {
              switch (opcode >> 2 & 3) {
                case 0:
                // dummy
                case 1: {
                  exec_cycles = 5;
                  break;
                }
                case 2: {
                  const r = opcode & 3;
                  let res = (_IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX)) + (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + _CF;
                  _CF = res > 15 ? 1 : 0;
                  if (_DF && res > 9) {
                    res += 6;
                    _CF = 1;
                  }
                  _ZF = res & false ? 1 : 0;
                  _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
                  _IX = _IX & 3840 | _IX + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 7;
                  break;
                }
                case 3: {
                  const r = opcode & 3;
                  let res = (_IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) + _CF;
                  _CF = res > 15 ? 1 : 0;
                  if (_DF && res > 9) {
                    res += 6;
                    _CF = 1;
                  }
                  _ZF = res & false ? 1 : 0;
                  _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
                  _IY = _IY & 3840 | _IY + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 3: {
              switch (opcode >> 2 & 3) {
                case 0:
                // dummy
                case 1: {
                  exec_cycles = 5;
                  break;
                }
                case 2: {
                  const r = opcode & 3;
                  let res = (_IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX)) - (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - _CF;
                  _CF = res < 0 ? 1 : 0;
                  if (_DF && res < 0) {
                    res += 10;
                  }
                  _ZF = res & false ? 1 : 0;
                  _IX < RAM_SIZE ? _RAM[_IX] = res & 15 & 15 : set_mem(_IX, res & 15);
                  _IX = _IX & 3840 | _IX + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 7;
                  break;
                }
                case 3: {
                  const r = opcode & 3;
                  let res = (_IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) - _CF;
                  _CF = res < 0 ? 1 : 0;
                  if (_DF && res < 0) {
                    res += 10;
                  }
                  _ZF = res & false ? 1 : 0;
                  _IY < RAM_SIZE ? _RAM[_IY] = res & 15 & 15 : set_mem(_IY, res & 15);
                  _IY = _IY & 3840 | _IY + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 4: {
              _CF |= opcode & 1;
              _ZF |= opcode >> 1 & 1;
              _DF |= opcode >> 2 & 1;
              const new_IF = opcode >> 3 & 1;
              _if_delay = new_IF && !_IF;
              _IF |= new_IF;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 5: {
              _CF &= opcode;
              _ZF &= opcode >> 1;
              _DF &= opcode >> 2;
              _IF &= opcode >> 3;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 6: {
              const mn = opcode & 15;
              const res = _RAM[mn] + 1;
              _ZF = res === 16 ? 1 : 0;
              _CF = res > 15 ? 1 : 0;
              _RAM[mn] = res & 15 & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 7: {
              const mn = opcode & 15;
              const res = _RAM[mn] - 1;
              _ZF = res === 0 ? 1 : 0;
              _CF = res < 0 ? 1 : 0;
              _RAM[mn] = res & 15 & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 7;
              break;
            }
            case 8: {
              _RAM[opcode & 15] = _A & 15 & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 5;
              break;
            }
            case 9: {
              _RAM[opcode & 15] = _B & 15 & 15;
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 5;
              break;
            }
            case 10: {
              _A = _RAM[opcode & 15];
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 5;
              break;
            }
            case 11: {
              _B = _RAM[opcode & 15];
              _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
              exec_cycles = 5;
              break;
            }
            case 12: {
              switch (opcode & 15) {
                case 0:
                // push_r
                case 1:
                case 2:
                case 3: {
                  const r = opcode & 3;
                  _SP = _SP - 1 & 255;
                  set_mem(
                    _SP,
                    r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)
                  );
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 4: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IX >> 8 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 5: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IX >> 4 & 15 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 6: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IX & 15 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 7: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IY >> 8 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 8: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IY >> 4 & 15 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 9: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = _IY & 15 & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 10: {
                  _SP = _SP - 1 & 255;
                  _RAM[_SP] = (_IF << 3 | _DF << 2 | _ZF << 1 | _CF) & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 11: {
                  _SP = _SP - 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                default: {
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 13: {
              switch (opcode & 15) {
                case 0:
                // pop_r
                case 1:
                case 2:
                case 3: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _RAM[_SP] & 15;
                  } else if (r === 1) {
                    _B = _RAM[_SP] & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _RAM[_SP] & 15 : set_mem(_IX, _RAM[_SP]);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _RAM[_SP] & 15 : set_mem(_IY, _RAM[_SP]);
                  }
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 4: {
                  _IX = _RAM[_SP] << 8 | _IX & 255;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 5: {
                  _IX = _RAM[_SP] << 4 | _IX & 3855;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 6: {
                  _IX = _RAM[_SP] | _IX & 4080;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 7: {
                  _IY = _RAM[_SP] << 8 | _IY & 255;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 8: {
                  _IY = _RAM[_SP] << 4 | _IY & 3855;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 9: {
                  _IY = _RAM[_SP] | _IY & 4080;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 10: {
                  const f = _RAM[_SP];
                  _CF = f & 1;
                  _ZF = f >> 1 & 1;
                  _DF = f >> 2 & 1;
                  const new_IF = f >> 3 & 1;
                  _if_delay = new_IF && !_IF;
                  _IF = new_IF;
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 11: {
                  _SP = _SP + 1 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 12:
                // dummy
                case 13: {
                  exec_cycles = 5;
                  break;
                }
                case 14: {
                  _PC = _PC & 4096 | _RAM[_SP] | _RAM[_SP + 1] << 4 | _RAM[_SP + 2] << 8;
                  _SP = _SP + 3 & 255;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 12;
                  break;
                }
                case 15: {
                  _PC = _NPC = _PC & 4096 | _RAM[_SP] | _RAM[_SP + 1] << 4 | _RAM[_SP + 2] << 8;
                  _SP = _SP + 3 & 255;
                  exec_cycles = 7;
                  break;
                }
              }
              break;
            }
            case 14: {
              switch (opcode & 15) {
                case 0:
                // ld_sph_r
                case 1:
                case 2:
                case 3: {
                  const r = opcode & 3;
                  _SP = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) << 4 | _SP & 15;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 4:
                // ld_r_sph
                case 5:
                case 6:
                case 7: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _SP >> 4 & 15;
                  } else if (r === 1) {
                    _B = _SP >> 4 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _SP >> 4 & 15 : set_mem(_IX, _SP >> 4);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _SP >> 4 & 15 : set_mem(_IY, _SP >> 4);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 8: {
                  _PC = _NPC & 7936 | _B << 4 | _A;
                  exec_cycles = 5;
                  break;
                }
                default: {
                  exec_cycles = 5;
                  break;
                }
              }
              break;
            }
            case 15: {
              switch (opcode & 15) {
                case 0:
                // ld_spl_r
                case 1:
                case 2:
                case 3: {
                  const r = opcode & 3;
                  _SP = (r === 0 ? _A : r === 1 ? _B : r === 2 ? _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX) : _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY)) | _SP & 240;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 4:
                // ld_r_spl
                case 5:
                case 6:
                case 7: {
                  const r = opcode & 3;
                  if (r === 0) {
                    _A = _SP & 15 & 15;
                  } else if (r === 1) {
                    _B = _SP & 15 & 15;
                  } else if (r === 2) {
                    _IX < RAM_SIZE ? _RAM[_IX] = _SP & 15 & 15 : set_mem(_IX, _SP & 15);
                  } else {
                    _IY < RAM_SIZE ? _RAM[_IY] = _SP & 15 & 15 : set_mem(_IY, _SP & 15);
                  }
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 8: {
                  _HALT = 1;
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 9:
                // dummy
                case 10: {
                  exec_cycles = 5;
                  break;
                }
                case 11: {
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
                  exec_cycles = 5;
                  break;
                }
                case 12:
                // dummy
                case 13:
                case 14: {
                  exec_cycles = 5;
                  break;
                }
                case 15: {
                  _PC = _NPC = _PC & 4096 | _PC + 1 & 4095;
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
        exec_cycles += _interrupt(12);
      } else if (_ISIO & _EISIO) {
        exec_cycles += _interrupt(10);
      } else if (_IK1) {
        exec_cycles += _interrupt(8);
      } else if (_IK0) {
        exec_cycles += _interrupt(6);
      } else if (_ISW & _EISW) {
        exec_cycles += _interrupt(4);
      } else if (_IT & _EIT) {
        exec_cycles += _interrupt(2);
      }
    }
    if (!(_CTRL_OSC & IO_CLKCHG)) {
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
              _snd_cycle / OSC1_CLOCK
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
      _OSC1_counter -= exec_cycles;
      while (_OSC1_counter <= 0) {
        _OSC1_counter += _OSC1_clock_div;
        _clock_OSC1();
      }
    }
    return exec_cycles;
  }
  var CPU = class {
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
        const new_K0 = ~(1 << pin) & _K0 | level << pin;
        if (_EIK0 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
          _IK0 |= IO_IK0;
        }
        if (pin === 3 && (_PTC & IO_PTC) < 2 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
          _process_ptimer();
        }
        _K0 = new_K0;
      }
      if (port === "K1") {
        const new_K1 = ~(1 << pin) & _K1 | level << pin;
        if (_EIK1 && level === 0 && _K1 >> pin !== level) {
          _IK1 |= IO_IK1;
        }
        _K1 = new_K1;
      } else if (port === "P0") {
        if (!(_IOC & IO_IOC0)) {
          _P0 = ~(1 << pin) & _P0 | level << pin;
        }
      } else if (port === "P1") {
        if (!(_IOC & IO_IOC1)) {
          _P1 = ~(1 << pin) & _P1 | level << pin;
        }
      } else if (port === "P2") {
        if (!(_IOC & IO_IOC2)) {
          _P2 = ~(1 << pin) & _P2 | level << pin;
        }
      } else if (port === "P3") {
        if (!(_IOC & IO_IOC3) && !_p3_dedicated) {
          _P3 = ~(1 << pin) & _P3 | level << pin;
        }
      } else if (port === "RES") {
        this.reset();
        _RESET = 1;
      }
    }
    pin_release(port, pin) {
      if (port === "K0") {
        const level = _port_pullup.K0 >> pin & 1;
        const new_K0 = ~(1 << pin) & _K0 | level << pin;
        if (_EIK0 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
          _IK0 |= IO_IK0;
        }
        if (pin === 3 && (_PTC & IO_PTC) < 2 && _DFK0 >> pin !== level && _K0 >> pin !== level) {
          _process_ptimer();
        }
        _K0 = new_K0;
      }
      if (port === "K1") {
        const level = _port_pullup.K1 >> pin & 1;
        const new_K1 = ~(1 << pin) & _K1 | level << pin;
        if (_EIK1 && level === 0 && _K1 >> pin !== level) {
          _IK1 |= IO_IK1;
        }
        _K1 = new_K1;
      } else if (port === "P0") {
        if (!(_IOC & IO_IOC0)) {
          _P0 = ~(1 << pin) & _P0 | _PUP & IO_PUP0;
        }
      } else if (port === "P1") {
        if (!(_IOC & IO_IOC1)) {
          _P1 = ~(1 << pin) & _P1 | _PUP & IO_PUP1;
        }
      } else if (port === "P2") {
        if (!(_IOC & IO_IOC2)) {
          _P2 = ~(1 << pin) & _P2 | _PUP & IO_PUP2;
        }
      } else if (port === "P3") {
        if (!(_IOC & IO_IOC3) && !_p3_dedicated) {
          _P3 = ~(1 << pin) & _P3 | _PUP & IO_PUP3;
        }
      } else if (port === "RES") {
        _RESET = 0;
      }
    }
    pc() {
      return _PC & 8191;
    }
    get_VRAM() {
      if (_CTRL_LCD & IO_ALOFF | _RESET) {
        return EMPTY_VRAM;
      }
      if (_CTRL_LCD & IO_ALON) {
        return FULL_VRAM;
      }
      return _VRAM;
    }
    get_VRAM_words() {
      if (_CTRL_LCD & IO_ALOFF | _RESET) {
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
        if (_HALT && !_RESET && (!_IF || _if_delay || !(_IPT & _EIPT) && !(_ISIO & _EISIO) && !_IK1 && !_IK0 && !(_ISW & _EISW) && !(_IT & _EIT))) {
          const has_ptimer = (_PTC & IO_PTC) > 1;
          const skip = Math.min(
            _timer_counter,
            _stopwatch_counter,
            has_ptimer ? _ptimer_counter : 2147483647
          ) - 1;
          if (skip > 7) {
            for (let t = 0; t < skip; t += 1) {
              _clock_OSC1();
            }
            continue;
          }
        }
        _clock();
      }
    }
    clock() {
      return _clock();
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
      _A = value & 15;
    }
    get_B() {
      return _B;
    }
    set_B(value) {
      _B = value & 15;
    }
    get_MX() {
      return _IX < RAM_SIZE ? _RAM[_IX] : get_mem(_IX);
    }
    set_MX(value) {
      _IX < RAM_SIZE ? _RAM[_IX] = value & 15 : set_mem(_IX, value);
    }
    get_MY() {
      return _IY < RAM_SIZE ? _RAM[_IY] : get_mem(_IY);
    }
    set_MY(value) {
      _IY < RAM_SIZE ? _RAM[_IY] = value & 15 : set_mem(_IY, value);
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
  };

  // utils/display.js
  var DISPLAY_PIXEL_COUNT_X = 32;
  var vramOffsets = new Uint16Array([
    // "col_0
    0 | 40 << 8,
    // "col_1
    1 | 41 << 8,
    // "col_2
    2 | 42 << 8,
    // "col_3
    3 | 43 << 8,
    // "col_4
    4 | 44 << 8,
    // "col_5
    5 | 45 << 8,
    // "col_6
    6 | 46 << 8,
    // "col_7
    7 | 47 << 8,
    // "col_8
    9 | 49 << 8,
    // "col_9
    10 | 50 << 8,
    // "col_10
    11 | 51 << 8,
    // "col_11
    12 | 52 << 8,
    // "col_12
    13 | 53 << 8,
    // "col_13
    14 | 54 << 8,
    // "col_14
    15 | 55 << 8,
    // "col_15
    16 | 56 << 8,
    // "col_16
    36 | 76 << 8,
    // "col_17
    35 | 75 << 8,
    // "col_18
    34 | 74 << 8,
    // "col_19
    33 | 73 << 8,
    // "col_20
    32 | 72 << 8,
    // "col_21
    31 | 71 << 8,
    // "col_22
    30 | 70 << 8,
    // "col_23
    29 | 69 << 8,
    // "col_24
    27 | 67 << 8,
    // "col_25
    26 | 66 << 8,
    // "col_26
    25 | 65 << 8,
    // "col_27
    24 | 64 << 8,
    // "col_28
    23 | 63 << 8,
    // "col_29
    22 | 62 << 8,
    // "col_30
    21 | 61 << 8,
    // "col_31
    20 | 60 << 8
  ]);
  function packVram(vramWords, buf) {
    for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
      const offset = vramOffsets[x];
      const word0 = vramWords[offset & 255];
      const word1 = vramWords[offset >> 8];
      const byte0 = word0 >> 4 | word0 & 15;
      const byte1 = word1 >> 4 | word1 & 15;
      buf[x] = byte1 << 8 | byte0;
    }
  }

  // benchmark/qjs-bench.mjs
  var noopToneGenerator = { play() {
  }, stop() {
  } };
  var ROM_SIZE = 16384;
  function makeRom(opcode) {
    const data = new Uint8Array(ROM_SIZE);
    const hi = opcode >> 8 & 15;
    const lo = opcode & 255;
    for (let i = 0; i < ROM_SIZE; i += 2) {
      data[i] = hi;
      data[i + 1] = lo;
    }
    return new ROM(data);
  }
  var OPCODE_JP_LOOP = 0;
  var OPCODE_NOP5 = 4091;
  function bench(label, fn, timeMs = 2e3, batchSize = 1e3) {
    const warmEnd = Date.now() + 200;
    while (Date.now() < warmEnd) {
      for (let i = 0; i < batchSize; i += 1) {
        fn();
      }
    }
    let totalCount = 0;
    const start = Date.now();
    const end = start + timeMs;
    while (Date.now() < end) {
      for (let i = 0; i < batchSize; i += 1) {
        fn();
      }
      totalCount += batchSize;
    }
    const elapsed = Date.now() - start;
    const opsPerSec = Math.round(totalCount / elapsed * 1e3);
    const usPerOp = Math.round(elapsed / totalCount * 1e6) / 1e3;
    console.log(
      "  " + label + ": " + opsPerSec + " ops/s  (" + usPerOp + " \xB5s/op)"
    );
  }
  {
    const rom = makeRom(OPCODE_JP_LOOP);
    const addrs = new Uint16Array(1024);
    for (let i = 0; i < 1024; i += 1) {
      addrs[i] = (Math.random() * 8192 | 0) & ~1;
    }
    let ai = 0;
    console.log("\n\u2500\u2500 ROM.getWord()");
    bench("fixed address 0x200", () => {
      rom.getWord(512);
    });
    bench("random address (cache pressure)", () => {
      rom.getWord(addrs[ai++ & 1023]);
    });
  }
  {
    const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 16e5, noopToneGenerator);
    console.log("\n\u2500\u2500 CPU.get_mem()");
    bench("RAM  addr 0x000", () => {
      cpu.get_mem(0);
    });
    bench("RAM  addr 0x2ff", () => {
      cpu.get_mem(767);
    });
    bench("VRAM addr 0xe00 (part 1)", () => {
      cpu.get_mem(3584);
    });
    bench("VRAM addr 0xe80 (part 2)", () => {
      cpu.get_mem(3712);
    });
    bench("IO   addr 0xf00 (interrupt flags)", () => {
      cpu.get_mem(3840);
    });
    bench("IO   addr 0xf40 (port K0)", () => {
      cpu.get_mem(3904);
    });
  }
  {
    const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 16e5, noopToneGenerator);
    console.log("\n\u2500\u2500 CPU.set_mem()");
    bench("RAM  addr 0x000", () => {
      cpu.set_mem(0, 5);
    });
    bench("VRAM addr 0xe00 (part 1)", () => {
      cpu.set_mem(3584, 5);
    });
    bench("VRAM addr 0xe80 (part 2)", () => {
      cpu.set_mem(3712, 5);
    });
    bench("IO   addr 0xf76 (timer ctrl)", () => {
      cpu.set_mem(3958, 2);
    });
  }
  {
    const cpuJp = new CPU(makeRom(OPCODE_JP_LOOP), 16e5, noopToneGenerator);
    const cpuNop = new CPU(makeRom(OPCODE_NOP5), 16e5, noopToneGenerator);
    console.log("\n\u2500\u2500 CPU.clock()");
    bench(
      "jp loop  (opcode 0x000, 5 cycles)",
      () => {
        cpuJp.clock();
      },
      2e3,
      100
    );
    bench(
      "nop5 loop (opcode 0xFFB, 5 cycles)",
      () => {
        cpuNop.clock();
      },
      2e3,
      100
    );
  }
  {
    const cpu = new CPU(makeRom(OPCODE_JP_LOOP), 16e5, noopToneGenerator);
    const displayBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);
    const prevBuf = new Uint16Array(DISPLAY_PIXEL_COUNT_X);
    console.log("\n\u2500\u2500 Display");
    bench("packVram (32 columns)", () => {
      packVram(cpu.get_VRAM_words(), displayBuf);
    });
    bench("diff-check 32-column buffer", () => {
      let hasDiff = false;
      for (let x = 0; x < DISPLAY_PIXEL_COUNT_X; x += 1) {
        if (displayBuf[x] !== prevBuf[x]) {
          hasDiff = true;
          break;
        }
      }
      return hasDiff;
    });
  }
  console.log("\nDone.");
})();
