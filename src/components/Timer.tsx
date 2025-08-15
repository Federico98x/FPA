'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    if (timerId.current) {
      clearInterval(timerId.current);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      timerId.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            pauseTimer();
            // Optional: play a sound or show a notification
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [isActive, pauseTimer]);
  
  const startTimer = () => setIsActive(true);

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(minutes * 60);
  }, [minutes, pauseTimer]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    if (!isNaN(newMinutes) && newMinutes >= 0) {
      pauseTimer();
      setMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
    } else if (e.target.value === '') {
      pauseTimer();
      setMinutes(0);
      setTimeLeft(0);
    }
  }

  const displayMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const displaySeconds = String(timeLeft % 60).padStart(2, '0');

  useEffect(() => {
    document.title = isActive ? `FocusFlow | ${displayMinutes}:${displaySeconds}` : 'FocusFlow';
  }, [timeLeft, isActive, displayMinutes, displaySeconds]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-6xl font-bold font-mono tracking-tighter text-primary">
          {displayMinutes}:{displaySeconds}
        </div>
        <div className="w-full max-w-xs">
          <Label htmlFor="minutes" className="text-muted-foreground text-sm font-medium mb-2 block text-center">Set Duration (minutes)</Label>
          <div className="flex items-center justify-center">
            <Input id="minutes" type="number" value={minutes} onChange={handleMinutesChange} className="w-32 text-center" min="0" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={isActive ? pauseTimer : startTimer} size="lg" className="w-32 rounded-full">
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon" className="rounded-full" aria-label="Reset timer">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
