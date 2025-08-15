// src/hooks/use-audio-engine.ts
import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler'; // Requires 'npm install howler @types/howler'
import type { Soundscape } from '@/lib/types';
import { getAudioSrc } from '@/lib/audio-map';

export const useAudioEngine = (currentSoundscape: Soundscape | null, isPlaying: boolean) => {
  // Store active Howl instances mapped by their mix element name
  const activeSounds = useRef<Record<string, Howl>>({});

  // Function to load and potentially play a sound element
  const loadAndPlaySound = useCallback((elementName: string) => {
    // If already loaded, ensure its playback state matches the global state
    if (activeSounds.current[elementName]) {
        const sound = activeSounds.current[elementName];
        if (isPlaying && !sound.playing()) {
            sound.play();
        }
        return;
    }

    const src = getAudioSrc(elementName);
    if (!src) {
      console.warn(`Audio source not found for element: ${elementName}`);
      return;
    }

    const sound = new Howl({
      src: [src],
      loop: true,
      volume: 0.7, // Default volume
      // Autoplay only if the global state is already playing
      autoplay: isPlaying,
    });

    activeSounds.current[elementName] = sound;
  }, [isPlaying]);

  // Function to stop and unload a sound element
  const unloadSound = useCallback((elementName: string) => {
    const sound = activeSounds.current[elementName];
    if (sound) {
      sound.fade(sound.volume(), 0, 500); // Fade out before stopping
      sound.once('fade', () => {
        sound.stop();
        sound.unload();
      });
      delete activeSounds.current[elementName];
    }
  }, []);

  // Function to pause all active sounds (for the global pause button)
  const pauseAll = useCallback(() => {
    Object.values(activeSounds.current).forEach(sound => {
        if (sound.playing()) {
            sound.pause();
        }
    });
  }, []);

  // Effect to manage the mix when the soundscape changes
  useEffect(() => {
    if (!currentSoundscape) {
      // Unload everything if no soundscape is selected
      Object.keys(activeSounds.current).forEach(unloadSound);
      return;
    }

    const desiredMix = currentSoundscape.mix;
    const currentMix = Object.keys(activeSounds.current);

    // 1. Unload sounds not in the desired mix
    currentMix.forEach(element => {
      if (!desiredMix.includes(element)) {
        unloadSound(element);
      }
    });

    // 2. Load sounds in the desired mix (playback handled by loadAndPlaySound)
    desiredMix.forEach(element => {
        loadAndPlaySound(element);
    });

  }, [currentSoundscape, unloadSound, loadAndPlaySound]);

  // Effect to handle the master play/pause state
  useEffect(() => {
    if (isPlaying) {
        // Resume or start all sounds currently loaded in the mix
        Object.values(activeSounds.current).forEach(sound => {
            if (!sound.playing()) {
                sound.play();
            }
        });
    } else {
        pauseAll();
    }
  }, [isPlaying, pauseAll]);


  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(activeSounds.current).forEach(sound => {
        sound.stop();
        sound.unload();
      });
    };
  }, []);

  return {
    activeSounds: activeSounds.current,
  };
};
