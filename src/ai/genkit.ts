// FIX: Modernized Genkit initialization using the primary `genkit` entry point
import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// Initialize Genkit configuration
export const ai = genkit({
  plugins: [googleAI()],
  // Tracing and metrics can be enabled via environment or plugin configuration
});

// Export the specific model reference (Gemini 1.5 Flash)
export const model = gemini15Flash;
