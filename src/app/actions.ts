'use server';

import { generateSoundscape, GenerateSoundscapeInput } from '@/ai/flows/generate-soundscape';
import { z } from 'zod';

const inputSchema = z.object({
  moodDescription: z.string().min(3, 'Please describe your mood a bit more.'),
});

export async function generateSoundscapeAction(prevState: any, formData: FormData) {
  const validatedFields = inputSchema.safeParse({
    moodDescription: formData.get('moodDescription'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.moodDescription?.[0] || 'Invalid input.',
    };
  }

  try {
    const input: GenerateSoundscapeInput = {
      moodDescription: validatedFields.data.moodDescription,
    };
    const result = await generateSoundscape(input);
    return { data: result };
  } catch (error) {
    console.error('Error generating soundscape:', error);
    return { error: 'Failed to generate soundscape. Please try again.' };
  }
}
