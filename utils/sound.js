const BUZZER_FREQ_DIV = [8, 10, 12, 14, 16, 20, 24, 28];
// const ENVELOP_STEP_DIV = [16, 20, 24, 28, 16, 20, 24, 28]; // Unused

const SOUND_CLOCK_DIV = 128;
const ONE_SHOT_PULSE_WIDTH_DIV = [8 * SOUND_CLOCK_DIV, 16 * SOUND_CLOCK_DIV];
const ENVELOPE_CYCLE_DIV = [16 * SOUND_CLOCK_DIV, 32 * SOUND_CLOCK_DIV];

let _system_clock;
let _one_shot_counter;
let _buzzer_freq;
let _envelope_step;
let _envelope_cycle;
let _envelope_counter;
let _envelope_on;
let _sound_on;
let _cycle_counter;
let _tone_generator;

export function initSound(clock, toneGenerator) {
  _system_clock = clock;
  _one_shot_counter = 0;
  _buzzer_freq = clock / BUZZER_FREQ_DIV[0];
  _envelope_step = 0;
  _envelope_cycle = ENVELOPE_CYCLE_DIV[0];
  _envelope_counter = 0;
  _envelope_on = false;
  _sound_on = false;
  _cycle_counter = 0;
  _tone_generator = toneGenerator;
}

// Advance n OSC1 ticks at once.
// Precondition: n must be small enough that each active counter fires at most
// once (i.e. n < min(ONE_SHOT_PULSE_WIDTH_DIV[*], ENVELOPE_CYCLE_DIV[*])).
// In practice n is a single instruction's exec_cycles (5–12), and the
// smallest divisor is 1024, so the invariant always holds.
export function clockBatch(n) {
  _cycle_counter += n;
  if (_one_shot_counter > 0) {
    _one_shot_counter -= n;
    if (_one_shot_counter <= 0) {
      _tone_generator.stop(_cycle_counter / _system_clock);
    }
  }
  if (_envelope_counter > 0) {
    _envelope_counter -= n;
    if (_envelope_counter <= 0) {
      _envelope_step -= 1;
      _tone_generator.play(
        _buzzer_freq,
        false,
        1 / (8 - _envelope_step),
        _cycle_counter / _system_clock,
      );
      _envelope_counter = _envelope_cycle;
    }
  }
}

export function set_freq(value) {
  _buzzer_freq = _system_clock / BUZZER_FREQ_DIV[value];
  if (_sound_on) {
    _tone_generator.play(
      _buzzer_freq,
      false,
      0.5,
      _cycle_counter / _system_clock,
    );
  }
}

export function set_envelope_on() {
  _envelope_on = true;
  _envelope_step = 7;
}

export function set_envelope_off() {
  _envelope_on = false;
  _envelope_step = 0;
  _envelope_counter = 0;
  _tone_generator.stop(_cycle_counter / _system_clock);
}

export function set_envelope_cycle(cycle) {
  _envelope_cycle = ENVELOPE_CYCLE_DIV[cycle];
}

export function reset_envelope() {
  _envelope_step = 7;
}

export function one_shot(duration) {
  if (_one_shot_counter == 0) {
    _one_shot_counter = ONE_SHOT_PULSE_WIDTH_DIV[duration];
    if (!_sound_on) {
      _tone_generator.play(
        _buzzer_freq,
        false,
        0.5,
        _cycle_counter / _system_clock,
      );
    }
  }
}

export function set_buzzer_on() {
  _sound_on = true;
  _one_shot_counter = 0;
  _tone_generator.play(
    _buzzer_freq,
    false,
    0.5,
    _cycle_counter / _system_clock,
  );
  if (_envelope_on) {
    _envelope_counter = _envelope_cycle;
  }
}

export function set_buzzer_off() {
  _sound_on = false;
  _envelope_counter = 0;
  _one_shot_counter = 0;
  _tone_generator.stop(_cycle_counter / _system_clock);
}

export function is_one_shot_ringing() {
  return _one_shot_counter > 0;
}
