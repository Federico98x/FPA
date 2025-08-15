'use client';

import { useState, useEffect } from 'react';
import type { Soundscape } from '@/lib/types';
import SoundscapeList from './SoundscapeList';
import SoundscapePlayer from './SoundscapePlayer';
import Timer from './Timer';
import AiSoundscapeGenerator from './AiSoundscapeGenerator';
import { useToast } from '@/hooks/use-toast';

const curatedSoundscapes: Soundscape[] = [
  { id: 'curated-1', name: 'Lofi Beats', category: 'lofi', description: 'Chill beats to relax/study to.', mix: 'Lofi, Vinyl Crackle', isCustom: false },
  { id: 'curated-2', name: 'Forest Rain', category: 'nature', description: 'Gentle rain in a lush forest.', mix: 'Rain, Thunder, Birds', isCustom: false },
  { id: 'curated-3', name: 'Ocean Waves', category: 'ambient', description: 'Calming waves on a sandy beach.', mix: 'Waves, Seagulls', isCustom: false },
  { id: 'curated-4', name: 'Ambient Drone', category: 'ambient', description: 'A soft, evolving atmospheric pad.', mix: 'Synth Pad, Reverb', isCustom: false },
];

const LOCAL_STORAGE_KEY = 'focusflow_soundscapes';

export default function FocusFlowApp() {
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>(curatedSoundscapes);
  const [currentSoundscape, setCurrentSoundscape] = useState<Soundscape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const savedSoundscapes = JSON.parse(saved);
        setSoundscapes(prev => [...prev, ...savedSoundscapes]);
      }
    } catch (error) {
      console.error("Failed to load soundscapes from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const customSoundscapes = soundscapes.filter(s => s.isCustom);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customSoundscapes));
      } catch (error) {
        console.error("Failed to save soundscapes to localStorage", error);
      }
    }
  }, [soundscapes, isMounted]);

  const handleSelectSoundscape = (soundscape: Soundscape) => {
    setCurrentSoundscape(soundscape);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (currentSoundscape) {
      setIsPlaying(prev => !prev);
    }
  };

  const handleGenerationComplete = (newSoundscape: Soundscape) => {
    setCurrentSoundscape(newSoundscape);
    setIsPlaying(true);
  };

  const handleSaveMix = (soundscapeToSave: Soundscape) => {
    if (soundscapes.some(s => s.id === soundscapeToSave.id)) {
        const updatedSoundscape = { ...soundscapeToSave, isCustom: true };
        setSoundscapes(prev => prev.map(s => s.id === soundscapeToSave.id ? updatedSoundscape : s));
        setCurrentSoundscape(updatedSoundscape);
        toast({ title: 'Mix Updated!', description: 'Your mix has been saved.' });
        return;
    }
    const savedSoundscape = { ...soundscapeToSave, isCustom: true };
    setSoundscapes(prev => [...prev, savedSoundscape]);
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
