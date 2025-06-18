import { ToneGenerator } from "./tone-generator";

const BUZZER_FREQ_DIV = [8, 10, 12, 14, 16, 20, 24, 28];
// const ENVELOP_STEP_DIV = [16, 20, 24, 28, 16, 20, 24, 28]; // Unused

const SOUND_CLOCK_DIV = 128;
const ONE_SHOT_PULSE_WIDTH_DIV = [8 * SOUND_CLOCK_DIV, 16 * SOUND_CLOCK_DIV];
const ENVELOPE_CYCLE_DIV = [16 * SOUND_CLOCK_DIV, 32 * SOUND_CLOCK_DIV];

// Sound for E0C6200 CPU
export class Sound {
  constructor(clock) {
    this._system_clock = clock;
    this._one_shot_counter = 0;
    this._buzzer_freq = clock / BUZZER_FREQ_DIV[0];
    this._envelope_step = 0;
    this._envelope_cycle = ENVELOPE_CYCLE_DIV[0];
    this._envelope_counter = 0;
    this._envelope_on = false;
    this._sound_on = false;
    this._cycle_counter = 0;

    this._tone_generator = new ToneGenerator();
  }

  clock() {
    this._cycle_counter += 1;
    if (this._one_shot_counter > 0) {
      this._one_shot_counter -= 1;
      if (this._one_shot_counter <= 0) {
        this._tone_generator.stop(this._cycle_counter / this._system_clock);
      }
    }
    if (this._envelope_counter > 0) {
      this._envelope_counter -= 1;
      if (this._envelope_counter <= 0) {
        this._envelope_step -= 1;
        this._tone_generator.play(
          this._buzzer_freq,
          false,
          1 / (8 - this._envelope_step),
          this._cycle_counter / this._system_clock,
        );
        this._envelope_counter = this._envelope_cycle;
      }
    }
  }

  set_freq(value) {
    this._buzzer_freq = this._system_clock / BUZZER_FREQ_DIV[value];
    if (this._sound_on) {
      this._tone_generator.play(
        this._buzzer_freq,
        false,
        0.5,
        this._cycle_counter / this._system_clock,
      );
    }
  }

  set_envelope_on() {
    this._envelope_on = true;
    this._envelope_step = 7;
  }

  set_envelope_off() {
    this._envelope_on = false;
    this._envelope_step = 0;
    this._envelope_counter = 0;
    this._tone_generator.stop(this._cycle_counter / this._system_clock);
  }

  set_envelope_cycle(cycle) {
    this._envelope_cycle = ENVELOPE_CYCLE_DIV[cycle];
  }

  reset_envelope() {
    this._envelope_step = 7;
  }

  one_shot(duration) {
    if (this._one_shot_counter == 0) {
      this._one_shot_counter = ONE_SHOT_PULSE_WIDTH_DIV[duration];
      if (!this._sound_on) {
        this._tone_generator.play(
          this._buzzer_freq,
          false,
          0.5,
          this._cycle_counter / this._system_clock,
        );
      }
    }
  }

  set_buzzer_on() {
    this._sound_on = true;
    this._one_shot_counter = 0;
    this._tone_generator.play(
      this._buzzer_freq,
      false,
      0.5,
      this._cycle_counter / this._system_clock,
    );
    if (this._envelope_on) {
      this._envelope_counter = this._envelope_cycle;
    }
  }

  set_buzzer_off() {
    this._sound_on = false;
    this._envelope_counter = 0;
    this._one_shot_counter = 0;
    this._tone_generator.stop(this._cycle_counter / this._system_clock);
  }

  is_one_shot_ringing() {
    return this._one_shot_counter > 0;
  }
}
