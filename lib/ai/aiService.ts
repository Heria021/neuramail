import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true // Only for development, should be handled differently in production
});

export interface AIResponse {
  content: string;
  error?: string;
}

/**
 * Generates an AI reply for an email based on the context
 * @param context The email context including subject, previous messages, etc.
 * @returns Promise<AIResponse> The generated reply or error
 */
export async function generateEmailReply(context: {
  subject: string;
  previousMessages: string[];
  tone?: 'professional' | 'casual' | 'friendly';
}): Promise<AIResponse> {
  try {
    const prompt = `Generate a professional email reply for the following context:
Subject: ${context.subject}
Previous Messages: ${context.previousMessages.join('\n')}
Tone: ${context.tone || 'professional'}

Please generate a concise and appropriate reply:`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      content: completion.choices[0]?.message?.content || 'No response generated',
    };
  } catch (error) {
    console.error('Error generating email reply:', error);
    return {
      content: '',
      error: 'Failed to generate email reply. Please try again.',
    };
  }
}

/**
 * Handles general AI queries about emails
 * @param query The user's question about their emails
 * @param emailContext The relevant email context to answer the question
 * @returns Promise<AIResponse> The AI's response or error
 */
export async function handleEmailQuery(query: string, emailContext: {
  emails: Array<{
    subject: string;
    content: string;
    date: string;
  }>;
}): Promise<AIResponse> {
  try {
    const prompt = `Based on the following email context, answer the user's question:
User Question: ${query}

Email Context:
${emailContext.emails.map(email => `
Subject: ${email.subject}
Date: ${email.date}
Content: ${email.content}
`).join('\n')}

Please provide a clear and concise answer:`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      content: completion.choices[0]?.message?.content || 'No response generated',
    };
  } catch (error) {
    console.error('Error handling email query:', error);
    return {
      content: '',
      error: 'Failed to process your query. Please try again.',
    };
  }
} 