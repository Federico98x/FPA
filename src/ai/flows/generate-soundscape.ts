// Use server directive is necessary for Genkit flows.
'use server';

/**
 * @fileOverview Generates a soundscape based on the user's mood description.
 *
 * - generateSoundscape - A function that generates a soundscape based on the user's mood description.
 * - GenerateSoundscapeInput - The input type for the generateSoundscape function.
 * - GenerateSoundscapeOutput - The return type for the generateSoundscape function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundscapeInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A description of the user\'s mood to generate a soundscape for.'),
});
export type GenerateSoundscapeInput = z.infer<typeof GenerateSoundscapeInputSchema>;

const GenerateSoundscapeOutputSchema = z.object({
  soundscapeDescription: z
    .string()
    .describe('A description of the generated soundscape, including the types of sounds and effects used.'),
  soundscapeMix: z
    .string()
    .describe('A list of sound elements to include in the generated soundscape mix.'),
});
export type GenerateSoundscapeOutput = z.infer<typeof GenerateSoundscapeOutputSchema>;

export async function generateSoundscape(input: GenerateSoundscapeInput): Promise<GenerateSoundscapeOutput> {
  return generateSoundscapeFlow(input);
}

const generateSoundscapePrompt = ai.definePrompt({
  name: 'generateSoundscapePrompt',
  input: {schema: GenerateSoundscapeInputSchema},
  output: {schema: GenerateSoundscapeOutputSchema},
  prompt: `You are a soundscape generator expert. Generate a soundscape mix based on the user's mood.

Mood description: {{{moodDescription}}}

Based on the mood description, create a soundscape mix with relevant music, sounds, and effects. Provide a brief description of the soundscape and a list of sound elements to include in the mix.

Output format: soundscapeDescription and soundscapeMix.
`,
});

const generateSoundscapeFlow = ai.defineFlow(
  {
    name: 'generateSoundscapeFlow',
    inputSchema: GenerateSoundscapeInputSchema,
    outputSchema: GenerateSoundscapeOutputSchema,
  },
  async input => {
    const {output} = await generateSoundscapePrompt(input);
    return output!;
  }
);
