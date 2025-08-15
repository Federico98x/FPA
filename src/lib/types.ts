import { z } from 'zod';

export type SoundscapeCategory = 'nature' | 'lofi' | 'ambient' | 'ai';

// Define Zod schema for runtime validation (e.g., localStorage)
export const SoundscapeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['nature', 'lofi', 'ambient', 'ai']),
  description: z.string(),
  // FIX: Changed from string to string[] for robust mixing
  mix: z.array(z.string()),
  isCustom: z.boolean(),
});

export type Soundscape = z.infer<typeof SoundscapeSchema>;
