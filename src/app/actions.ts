'use server';

import { generateSoundscape, GenerateSoundscapeInput, GenerateSoundscapeOutput } from '@/ai/flows/generate-soundscape';
import { z } from 'zod';

const inputSchema = z.object({
  moodDescription: z.string().min(3, 'Please describe your mood a bit more.'),
});

// FIX: Define the expected state structure for strong typing
export type GenerationState = {
  error: string | null;
  data: GenerateSoundscapeOutput | null;
};

export const initialState: GenerationState = {
  error: null,
  data: null,
};

// FIX: Strongly type prevState and the return type
export async function generateSoundscapeAction(prevState: GenerationState, formData: FormData): Promise<GenerationState> {
  const validatedFields = inputSchema.safeParse({
    moodDescription: formData.get('moodDescription'),
  });

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.flatten().fieldErrors.moodDescription?.[0] || 'Invalid input.';
    return {
      error: errorMessage,
      data: null,
    };
  }

  try {
    const input: GenerateSoundscapeInput = {
      moodDescription: validatedFields.data.moodDescription,
    };
    const result = await generateSoundscape(input);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error generating soundscape:', error);
    return { error: 'Failed to generate soundscape. Please try again.', data: null };
  }
}
