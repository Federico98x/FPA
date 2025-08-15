'use client';

import { useState, useEffect } from 'react';
import { Soundscape, SoundscapeSchema } from '@/lib/types'; // Import Schema
import SoundscapeList from './SoundscapeList';
import SoundscapePlayer from './SoundscapePlayer';
import Timer from './Timer';
import AiSoundscapeGenerator from './AiSoundscapeGenerator';
import { useToast } from '@/hooks/use-toast';

// FIX: Updated initial data structure (mix: string[]) and aligned with AI vocabulary
const curatedSoundscapes: Soundscape[] = [
  { id: 'curated-1', name: 'Lofi Beats', category: 'lofi', description: 'Chill beats to relax/study to.', mix: ['Lofi Beat', 'Vinyl Crackle'], isCustom: false },
  { id: 'curated-2', name: 'Forest Rain', category: 'nature', description: 'Gentle rain in a lush forest.', mix: ['Rain', 'Thunder', 'Birds'], isCustom: false },
  { id: 'curated-3', name: 'Ocean Waves', category: 'ambient', description: 'Calming waves on a sandy beach.', mix: ['Ocean Waves', 'Seagulls'], isCustom: false },
  { id: 'curated-4', name: 'Ambient Drone', category: 'ambient', description: 'A soft, evolving atmospheric pad.', mix: ['Synth Pad'], isCustom: false },
];

const LOCAL_STORAGE_KEY = 'focusflow_soundscapes';

// FIX: Helper functions for safe localStorage access (Handles SSR)
const getLocalStorageItem = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error accessing localStorage", error);
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export default function FocusFlowApp() {
  // FIX: Use lazy initialization and Zod validation to prevent hydration mismatch and data corruption
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>(() => {
    const saved = getLocalStorageItem(LOCAL_STORAGE_KEY);
    let savedSoundscapes: Soundscape[] = [];

    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Validate the structure using Zod
        const validationResult = SoundscapeSchema.array().safeParse(parsedData);
        if (validationResult.success) {
          savedSoundscapes = validationResult.data;
        } else {
          console.error("Invalid structure in localStorage, resetting custom mixes.", validationResult.error);
        }
      } catch (e) {
        console.error("Failed to parse saved soundscapes", e);
      }
    }
    // Merge curated and validated saved custom soundscapes
    return [...curatedSoundscapes, ...savedSoundscapes];
  });

  const [currentSoundscape, setCurrentSoundscape] = useState<Soundscape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // FIX: Save custom soundscapes whenever the list changes
  useEffect(() => {
    const customSoundscapes = soundscapes.filter(s => s.isCustom);
    setLocalStorageItem(LOCAL_STORAGE_KEY, JSON.stringify(customSoundscapes));
  }, [soundscapes]);

  const handleSelectSoundscape = (soundscape: Soundscape) => {
    setCurrentSoundscape(soundscape);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (!currentSoundscape) return;
    setIsPlaying(prev => !prev);
  };

  const handleGenerationComplete = (newSoundscape: Soundscape) => {
    setSoundscapes(prev => {
      if (prev.some(s => s.id === newSoundscape.id)) return prev;
      return [...prev, newSoundscape];
    });
    setCurrentSoundscape(newSoundscape);
    setIsPlaying(true);
  };

  // FIX: Robust save logic
  const handleSaveMix = (soundscapeToSave: Soundscape) => {
    if (soundscapeToSave.isCustom) {
        toast({ title: 'Already Saved', description: 'This mix is already in your list.' });
        return;
    }

    const savedSoundscape = { ...soundscapeToSave, isCustom: true };

    setSoundscapes(prev => prev.map(s => s.id === soundscapeToSave.id ? savedSoundscape : s));
    setCurrentSoundscape(savedSoundscape);
    toast({ title: 'Mix Saved!', description: 'Added to "My Mixes".' });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SoundscapeList
            soundscapes={soundscapes}
            currentSoundscape={currentSoundscape}
            onSelectSoundscape={handleSelectSoundscape}
          />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <SoundscapePlayer
            currentSoundscape={currentSoundscape}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSaveMix={handleSaveMix}
          />
          <Timer />
          <AiSoundscapeGenerator onGenerationComplete={handleGenerationComplete} />
        </div>
      </div>
    </div>
  );
}
