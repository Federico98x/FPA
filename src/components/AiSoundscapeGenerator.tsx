'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { generateSoundscapeAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { Soundscape } from '@/lib/types';
import type { GenerateSoundscapeOutput } from '@/ai/flows/generate-soundscape';

interface AiSoundscapeGeneratorProps {
  onGenerationComplete: (soundscape: Soundscape) => void;
}

const initialState = {
  error: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-full">
      {pending ? <LoaderCircle className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
      Generate
    </Button>
  );
}

export default function AiSoundscapeGenerator({ onGenerationComplete }: AiSoundscapeGeneratorProps) {
  const [state, formAction] = useActionState(generateSoundscapeAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: state.error,
      });
    }
    if (state.data) {
      const result = state.data as GenerateSoundscapeOutput;
      const newSoundscape: Soundscape = {
        id: `ai-${Date.now()}`,
        name: `AI: ${result.soundscapeMix.split(',')[0].trim()}`,
        category: 'ai',
        description: result.soundscapeDescription,
        mix: result.soundscapeMix,
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
