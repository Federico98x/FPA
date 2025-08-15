// src/lib/audio-map.ts
// Maps the names defined in the AI vocabulary (AvailableSounds) and curated mixes to actual audio files.

// NOTE: Ensure corresponding MP3 files exist in /public/audio
export const AudioMap: Record<string, string> = {
  'Lofi Beat': '/audio/lofi-beat.mp3',
  'Vinyl Crackle': '/audio/vinyl-crackle.mp3',
  'Rain': '/audio/rain.mp3',
  'Thunder': '/audio/thunder.mp3',
  'Birds': '/audio/birds.mp3',
  'Ocean Waves': '/audio/waves.mp3',
  'Seagulls': '/audio/seagulls.mp3',
  'Synth Pad': '/audio/synth-pad.mp3',
};

// Helper function to get the audio source URL
export const getAudioSrc = (elementName: string): string | null => {
  // Perform a case-insensitive search for robustness
  const normalizedName = Object.keys(AudioMap).find(key => key.toLowerCase() === elementName.toLowerCase());
  return normalizedName ? AudioMap[normalizedName] : null;
};
