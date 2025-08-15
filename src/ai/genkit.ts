// FIX: Modernized Genkit initialization
import { initializeGenkit } from '@genkit-ai/core';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// Initialize Genkit configuration
export const config = initializeGenkit({
  plugins: [googleAI()],
  flow: {
    sincerity: true, // Recommended for production flows
  },
  // Enable tracing/metrics only in development
  enableTracingAndMetrics: process.env.NODE_ENV !== 'production',
});

// Export the specific model reference (Gemini 1.5 Flash)
export const model = gemini15Flash;
