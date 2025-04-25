import { AI_CONFIG } from './config';

/**
 * Truncates text to a maximum length while preserving word boundaries
 * @param text The text to truncate
 * @param maxLength Maximum length of the text
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = AI_CONFIG.maxContextLength): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Formats email context for AI processing
 * @param subject Email subject
 * @param messages Array of previous messages
 * @returns Formatted context string
 */
export function formatEmailContext(subject: string, messages: string[]): string {
  const formattedMessages = messages
    .map((msg, index) => `Message ${index + 1}:\n${msg}`)
    .join('\n\n');
  
  return `Subject: ${subject}\n\nPrevious Messages:\n${formattedMessages}`;
}

/**
 * Validates if the input is suitable for AI processing
 * @param input The input to validate
 * @returns boolean indicating if the input is valid
 */
export function validateAIInput(input: string): boolean {
  if (!input || input.trim().length === 0) return false;
  if (input.length > AI_CONFIG.maxContextLength) return false;
  return true;
}

/**
 * Sanitizes text for AI processing
 * @param text The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
} 