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
    // Calculate remaining time accurately
    const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));

    setTimeLeft(remaining);

    if (remaining === 0) {
      // Timer finished
      setIsActive(false);
      endTimeRef.current = null;
      // Optional: play a sound or show a notification here
    } else {
      // Continue updating using rAF for smooth visuals and accuracy
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
      // Set the end time based on current time left (handles start and resume)
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsActive(true);
    }
  };

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    // Clear the end time reference; timeLeft is already updated by updateTimer
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
      // Allow clearing the input, treat as 0
      newDuration = 0;
    } else {
      return; // Ignore invalid inputs
    }

    // Always pause when changing duration
    pauseTimer();
    setDuration(newDuration);
    setTimeLeft(newDuration);
  }

  const displayMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const displaySeconds = String(timeLeft % 60).padStart(2, '0');
  // Calculate the value to display in the input field
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
            {/* FIX: Use the calculated inputMinutesValue */}
            <Input id="minutes" type="number" value={inputMinutesValue} onChange={handleMinutesChange} className="w-32 text-center" min="0" step="1" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* FIX: Disable start if duration is 0 */}
          <Button onClick={isActive ? pauseTimer : startTimer} size="lg" className="w-32 rounded-full" disabled={duration === 0}>
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {/* FIX: Show Resume if paused mid-timer */}
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
