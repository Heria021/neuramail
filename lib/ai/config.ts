export const AI_CONFIG = {
  // Default model settings
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,

  // Response settings
  defaultTone: 'professional' as const,
  maxContextLength: 2000, // Maximum characters to include in context

  // Error messages
  errorMessages: {
    apiKeyMissing: 'OpenAI API key is missing. Please check your environment variables.',
    generationFailed: 'Failed to generate response. Please try again.',
    queryFailed: 'Failed to process your query. Please try again.',
  },
};

// Validate environment variables
export function validateEnv() {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.error(AI_CONFIG.errorMessages.apiKeyMissing);
    return false;
  }
  return true;
} 