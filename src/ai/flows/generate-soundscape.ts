'use server';

/**
 * @fileOverview Generates a soundscape based on the user's mood description.
 */

import { z } from 'zod';
import { ai, model } from '@/ai/genkit'; // Import the Genkit instance and model reference

// FIX: Define the available sound assets vocabulary (Crucial for mapping to audio files)
const AvailableSounds = z.enum([
  'Lofi Beat',
  'Rain',
  'Thunder',
  'Birds',
  'Ocean Waves',
  'Vinyl Crackle',
  'Synth Pad',
  'Seagulls',
] as const);

const GenerateSoundscapeInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A description of the user\'s mood.'),
});
export type GenerateSoundscapeInput = z.infer<typeof GenerateSoundscapeInputSchema>;

// FIX: Refactored Output Schema for structured data and constrained vocabulary
const GenerateSoundscapeOutputSchema = z.object({
  soundscapeName: z
    .string()
    .describe('A short, evocative name for the generated soundscape.'),
  soundscapeDescription: z
    .string()
    .describe('A description of the generated soundscape.'),
  // FIX: Changed to array of constrained sounds
  soundscapeMix: z
    .array(AvailableSounds)
    .describe('A list of sound elements to include in the mix, from the vocabulary.'),
});
export type GenerateSoundscapeOutput = z.infer<typeof GenerateSoundscapeOutputSchema>;

// FIX: Define the flow using the modern approach
export const generateSoundscapeFlow = ai.defineFlow(
  {
    name: 'generateSoundscapeFlow',
    inputSchema: GenerateSoundscapeInputSchema,
    outputSchema: GenerateSoundscapeOutputSchema,
  },
  async (input: GenerateSoundscapeInput) => {
    // FIX: Improved prompt engineering for structured, constrained output
    const prompt = `You are an expert sound designer creating focus soundscapes.

    Mood description: ${input.moodDescription}

    Available Sounds Vocabulary:
    ${AvailableSounds.options.join(', ')}

    Instructions:
    1. Analyze the mood.
    2. Select 1-4 relevant sound elements ONLY from the Vocabulary.
    3. Create an evocative name (soundscapeName).
    4. Provide a brief description (soundscapeDescription).
    5. Output the elements as an array (soundscapeMix).

    Ensure the output strictly adheres to the required JSON schema.
    `;

    // FIX: Use the 'generate' function from the Genkit instance
    const { output } = await ai.generate({
      model: model,
      prompt: prompt,
      output: { schema: GenerateSoundscapeOutputSchema },
      config: {
        temperature: 0.7,
      }
    });

    if (!output) throw new Error('Failed to generate soundscape');

    return output;
  }
);

// Helper function for server action compatibility
export async function generateSoundscape(input: GenerateSoundscapeInput): Promise<GenerateSoundscapeOutput> {
  return generateSoundscapeFlow(input);
}
