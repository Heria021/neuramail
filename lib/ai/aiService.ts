import OpenAI from 'openai';
import { getAllEmailQueries } from '../email/fetch';
import { Email, EmailQueryResponse, SimpleEmail, AIParsedResponse } from '@/types/aiServicesTypes';

// Unified interface for AI responses
export interface AIResponse {
  content: string;
  error?: string;
  matchedEmails?: Email[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true
});

/**
 * Core function to interact with OpenAI API
 * @throws Error if API call fails
 */
async function callOpenAI(prompt: string, temperature = 0.7, maxTokens = 500): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature,
      max_tokens: maxTokens,
    });
    
    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates an AI reply for an email
 */
export async function generateEmailReply(context: {
  subject: string;
  previousMessages: string[];
  tone?: 'professional' | 'casual' | 'friendly';
}): Promise<AIResponse> {
  try {
    const prompt = `Generate a professional email reply:
Subject: ${context.subject}
Previous Messages: ${context.previousMessages.join('\n')}
Tone: ${context.tone || 'professional'}`;

    const content = await callOpenAI(prompt);
    return { content };
  } catch (error) {
    return {
      content: '',
      error: `Failed to generate email reply: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Handles general AI queries about emails
 */
export async function handleEmailQuery(query: string, emailContext: {
  emails: SimpleEmail[];
}): Promise<AIResponse> {
  try {
    const prompt = `Answer based on these emails:
Question: ${query}

Email Context:
${emailContext.emails.map(email => 
  `Subject: ${email.subject}
   Date: ${email.date}
   Content: ${email.content}`
).join('\n\n')}`;

    const content = await callOpenAI(prompt);
    return { content };
  } catch (error) {
    return {
      content: '',
      error: `Failed to process your query: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Process assistant queries and find relevant emails
 */
export async function processAssistantQuery(query: string): Promise<AIResponse> {
  try {
    const response = await getAllEmailQueries() as EmailQueryResponse;
    
    if (!response || !response.data) {
      return {
        content: '',
        error: 'Failed to fetch emails. Please try again.',
      };
    }

    if (!response.data.length) {
      return {
        content: 'No emails found to analyze.',
        matchedEmails: [],
      };
    }

    const emails = response.data;
    
    // Create a simplified representation of emails for the prompt
    const emailSummaries = emails.map((email, index) => `
Email ${index + 1}:
Ticket: ${email.ticket_no}
From: ${email.sender_email}
Subject: ${email.Subject}
Type: ${email.request_type}
Status: ${email.status}
Thread: ${email.Thread.map(msg => 
  `[${msg.timestamp}] ${msg.request_description}: ${msg.email_body} ${msg.Reply ? `Reply: ${msg.Reply}` : ''}`
).join(' | ')}`).join('\n');

    const prompt = `Analyze which emails are relevant to this query:
Query: ${query}

${emailSummaries}

Respond in JSON format:
{
  "relevant_tickets": [
    {
      "ticket_number": "string",
      "relevance_score": number,
      "summary": "string"
    }
  ],
  "total_relevant": number,
  "ai_reply": "string"
}

Only include relevant emails, sorted by relevance. In ai_reply, address the query with specific details from emails without mentioning ticket numbers.`;

    const aiContent = await callOpenAI(prompt, 0.5, 1500);
    
    let parsedResponse: AIParsedResponse;
    try {
      parsedResponse = JSON.parse(aiContent) as AIParsedResponse;
      
      // Validate parsed response structure
      if (!parsedResponse || typeof parsedResponse !== 'object') {
        throw new Error('Invalid response structure');
      }
      
      if (!Array.isArray(parsedResponse.relevant_tickets)) {
        parsedResponse.relevant_tickets = [];
      }
      
      if (typeof parsedResponse.ai_reply !== 'string') {
        parsedResponse.ai_reply = 'No valid response generated';
      }
      
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return {
        content: '',
        error: `Could not parse AI response: ${e instanceof Error ? e.message : 'Unknown error'}`,
      };
    }
    
    if (!parsedResponse.relevant_tickets.length) {
      return {
        content: parsedResponse.ai_reply || 'No relevant emails found.',
        matchedEmails: [],
      };
    }

    const relevantTicketNumbers = new Set(
      parsedResponse.relevant_tickets.map(t => t.ticket_number)
    );

    const matchedEmails = emails.filter(email => 
      relevantTicketNumbers.has(email.ticket_no)
    );

    return {
      content: parsedResponse.ai_reply,
      matchedEmails,
    };

  } catch (error) {
    console.error('Error processing assistant query:', error);
    return {
      content: '',
      error: `Failed to process your query: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}