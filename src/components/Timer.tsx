'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const DEFAULT_MINUTES = 25;

export default function Timer() {
  // FIX: Consolidated state management (duration and timeLeft in seconds)
  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  // FIX: Refs for accurate timing using Date.now() and requestAnimationFrame (rAF)
  const endTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  // FIX: Function to update the time left based on Date.now() (prevents drift)
  const updateTimer = useCallback(() => {
    if (!isActive || !endTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));

    setTimeLeft(remaining);

    if (remaining === 0) {
      setIsActive(false);
      endTimeRef.current = null;
    } else {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isActive]);

  // FIX: Effect to manage the animation frame loop
  useEffect(() => {
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, updateTimer]);

  const startTimer = () => {
    if (timeLeft > 0 && !isActive) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsActive(true);
    }
  };

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    endTimeRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(duration);
  }, [duration, pauseTimer]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    let newDuration = 0;

    if (!isNaN(newMinutes) && newMinutes >= 0) {
      newDuration = newMinutes * 60;
    } else if (e.target.value === '') {
      newDuration = 0;
    } else {
      return;
    }

    pauseTimer();
    setDuration(newDuration);
    setTimeLeft(newDuration);
  }

  const displayMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const displaySeconds = String(timeLeft % 60).padStart(2, '0');
  const inputMinutesValue = duration / 60;

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
            <Input id="minutes" type="number" value={inputMinutesValue} onChange={handleMinutesChange} className="w-32 text-center" min="0" step="1" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={isActive ? pauseTimer : startTimer} size="lg" className="w-32 rounded-full" disabled={duration === 0}>
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pause' : (timeLeft === duration ? 'Start' : 'Resume')}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon" className="rounded-full" aria-label="Reset timer">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
