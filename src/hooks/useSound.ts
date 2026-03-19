import { useState, useCallback } from 'react';
import { SoundName } from '../audio/types';
import { play as enginePlay, PlayOptions, isMuted as engineIsMuted, setMuted as engineSetMuted } from '../audio/soundEngine';

interface UseSoundReturn {
  readonly play: (name: SoundName, options?: PlayOptions) => void;
  readonly isMuted: boolean;
  readonly toggleMute: () => void;
}

export function useSound(): UseSoundReturn {
  const [muted, setMuted] = useState(() => engineIsMuted());

  const play = useCallback((name: SoundName, options?: PlayOptions) => {
    enginePlay(name, options);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    engineSetMuted(next);
    setMuted(next);
  }, [muted]);

  return { play, isMuted: muted, toggleMute };
}
