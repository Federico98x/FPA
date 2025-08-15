'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
// FIX: Import types and initialState from actions
import { generateSoundscapeAction, initialState, GenerationState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { Soundscape } from '@/lib/types';

interface AiSoundscapeGeneratorProps {
  onGenerationComplete: (soundscape: Soundscape) => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        Generate
      </Button>
    );
  }

export default function AiSoundscapeGenerator({ onGenerationComplete }: AiSoundscapeGeneratorProps) {
  // FIX: Explicitly type the state
  const [state, formAction] = useActionState<GenerationState, FormData>(generateSoundscapeAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // FIX: TypeScript now correctly understands state types
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: state.error,
      });
    }
    if (state.data) {
      const result = state.data;
      // FIX: Adapt to the new structured output (name and array mix)
      const newSoundscape: Soundscape = {
        id: `ai-${Date.now()}`,
        name: result.soundscapeName, // Use the AI-generated name
        category: 'ai',
        description: result.soundscapeDescription,
        mix: result.soundscapeMix, // Mix is now an array
        isCustom: false,
      };
      onGenerationComplete(newSoundscape);
      toast({
        title: 'Soundscape Generated!',
        description: 'Your new mix is ready to play.',
      });
      formRef.current?.reset();
    }
  }, [state, toast, onGenerationComplete]);

  return (
    // ... (JSX remains the same)
    <Card>
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle>AI Soundscape Generator</CardTitle>
          <CardDescription>Describe your mood, and we'll create a soundscape for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            name="moodDescription"
            placeholder="e.g., 'calm and focused for a late night study session'"
            rows={3}
            required
            className="text-base"
          />
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
