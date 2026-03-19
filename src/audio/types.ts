export type SoundName =
  | 'word-place'
  | 'correct'
  | 'wrong'
  | 'xp-gain'
  | 'level-up'
  | 'achievement'
  | 'combo'
  | 'button-tap';

export interface NoteStep {
  readonly frequency: number;
  readonly startOffset: number; // seconds from sound start
  readonly duration: number;    // seconds
}

export interface SoundDefinition {
  readonly type: OscillatorType;
  readonly notes: readonly NoteStep[];
  readonly gain: number; // 0-1
}
