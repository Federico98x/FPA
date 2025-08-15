import { z } from 'zod';

export type SoundscapeCategory = 'nature' | 'lofi' | 'ambient' | 'ai';

export const SoundscapeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['nature', 'lofi', 'ambient', 'ai']),
  description: z.string(),
  mix: z.array(z.string()),
  isCustom: z.boolean(),
});

export type Soundscape = z.infer<typeof SoundscapeSchema>;
