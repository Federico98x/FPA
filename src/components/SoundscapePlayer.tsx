'use client';

import type { Soundscape } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SoundscapePlayerProps {
  currentSoundscape: Soundscape | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSaveMix: (soundscape: Soundscape) => void;
}

export default function SoundscapePlayer({ currentSoundscape, isPlaying, onPlayPause, onSaveMix }: SoundscapePlayerProps) {
  const canBeSaved = currentSoundscape?.category === 'ai' && !currentSoundscape.isCustom;
  const isSaved = currentSoundscape?.category === 'ai' && currentSoundscape.isCustom;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Now Playing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[180px] text-center">
        {currentSoundscape ? (
          <>
            <div>
              <p className="text-xl font-semibold text-primary">{currentSoundscape.name}</p>
              <CardDescription className="mt-1">{currentSoundscape.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onPlayPause} size="lg" className="w-36 rounded-full">
                {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              {canBeSaved && (
                <Button onClick={() => onSaveMix(currentSoundscape!)} variant="outline" size="icon" className="rounded-full" aria-label="Save mix">
                  <Save className="h-5 w-5" />
                </Button>
              )}
               {isSaved && (
                <Button variant="outline" size="icon" className="rounded-full" disabled>
                  <Save className="h-5 w-5 text-primary" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
             <p>Select a soundscape to begin.</p>
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
