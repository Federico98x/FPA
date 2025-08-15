export type SoundscapeCategory = 'nature' | 'lofi' | 'ambient' | 'ai';

export interface Soundscape {
  id: string;
  name: string;
  category: SoundscapeCategory;
  description: string;
  mix: string;
  isCustom: boolean;
}
