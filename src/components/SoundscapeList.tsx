'use client';

import type { Soundscape, SoundscapeCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Leaf, Waves, Radio, Sparkles, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SoundscapeListProps {
  soundscapes: Soundscape[];
  currentSoundscape: Soundscape | null;
  onSelectSoundscape: (soundscape: Soundscape) => void;
}

interface SoundscapeItemProps {
  soundscape: Soundscape;
  isActive: boolean;
  onSelect: () => void;
}

const categoryIcons: Record<SoundscapeCategory, React.ReactNode> = {
  nature: <Leaf className="h-5 w-5 flex-shrink-0" />,
  lofi: <Radio className="h-5 w-5 flex-shrink-0" />,
  ambient: <Waves className="h-5 w-5 flex-shrink-0" />,
  ai: <Sparkles className="h-5 w-5 flex-shrink-0" />,
};

const SoundscapeItem = ({ soundscape, isActive, onSelect }: SoundscapeItemProps) => (
  <Button
    variant={isActive ? 'secondary' : 'ghost'}
    className="w-full justify-start h-auto py-2 px-3"
    onClick={onSelect}
  >
    <div className="flex items-center gap-3 w-full overflow-hidden">
      <div className="text-primary">{categoryIcons[soundscape.category]}</div>
      <span className="truncate text-left">{soundscape.name}</span>
    </div>
  </Button>
);

export default function SoundscapeList({ soundscapes, currentSoundscape, onSelectSoundscape }: SoundscapeListProps) {
  const curated = soundscapes.filter(s => !s.isCustom);
  const custom = soundscapes.filter(s => s.isCustom);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Soundscapes</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          <div className="p-4 pt-0 space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-2 px-3 text-muted-foreground">Curated</h3>
              <div className="space-y-1">
                {curated.map((s) => (
                  <SoundscapeItem 
                    key={s.id} 
                    soundscape={s} 
                    isActive={currentSoundscape?.id === s.id}
                    onSelect={() => onSelectSoundscape(s)}
                  />
                ))}
              </div>
            </div>
            
            {custom.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 px-3 flex items-center gap-2 text-muted-foreground">
                  <Save className="h-4 w-4" />
                  My Mixes
                </h3>
                <div className="space-y-1">
                  {custom.map((s) => (
                     <SoundscapeItem 
                        key={s.id} 
                        soundscape={s} 
                        isActive={currentSoundscape?.id === s.id}
                        onSelect={() => onSelectSoundscape(s)}
                      />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
