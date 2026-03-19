import { SoundName } from './types';
import { SOUND_DEFINITIONS } from './sounds';

const MUTE_KEY = 'bible_puzzle_sound_muted';

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, String(muted));
  } catch {
    // localStorage unavailable
  }
}

export interface PlayOptions {
  readonly pitchMultiplier?: number;
}

export function play(name: SoundName, options?: PlayOptions): void {
  if (isMuted()) return;

  const ctx = getContext();
  if (!ctx) return;

  const definition = SOUND_DEFINITIONS[name];
  if (!definition) return;

  const pitchMultiplier = options?.pitchMultiplier ?? 1;
  const now = ctx.currentTime;

  for (const note of definition.notes) {
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = definition.type;
      oscillator.frequency.value = note.frequency * pitchMultiplier;

      const start = now + note.startOffset;
      const end = start + note.duration;

      // Envelope: quick attack, sustain, quick release
      gainNode.gain.setValueAtTime(0, start);
      gainNode.gain.linearRampToValueAtTime(definition.gain, start + 0.005);
      gainNode.gain.setValueAtTime(definition.gain, end - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, end);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(start);
      oscillator.stop(end + 0.01);
    } catch {
      // Graceful degradation
    }
  }
}
