import OpenAI from 'openai';
import { getAllEmailQueries } from '../email/fetch';

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

interface ThreadMessage {
  message_id: string;
  request_description: string;
  email_body: string;
  Reply: string | null;
  timestamp: string;
}

interface Email {
  ticket_no: string;
  sender_email: string;
  Subject: string;
  request_type: string;
  Thread: ThreadMessage[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailQueryResponse {
  status: string;
  message: string;
  data: Email[];
}

interface RelevantTicket {
  ticket_number: string;
  relevance_score: number;
  summary: string;
}

interface AIParsedResponse {
  relevant_tickets: RelevantTicket[];
  total_relevant: number;
  ai_reply: string;
}

export interface AIResponse {
  content: string;
  error?: string;
  matchedEmails?: Email[];
}

export async function processAssistantQuery(query: string): Promise<AIResponse> {
  try {
    const response = await getAllEmailQueries() as EmailQueryResponse;

    if (!response || !response.data) {
      return {
        content: '',
        error: 'Failed to fetch emails. Please try again.',
      };
    }

    const emails = response.data;
    if (!emails.length) {
      return {
        content: 'No emails found to analyze.',
        error: undefined,
      };
    }

    const prompt = `Analyze the following user query and identify which emails are relevant:
User Query: ${query}

Available Emails:
${emails.map((email: Email, index: number) => `
Email ${index + 1}:
Ticket Number: ${email.ticket_no}
From: ${email.sender_email}
Subject: ${email.Subject}
Request Type: ${email.request_type}
Status: ${email.status}
Thread Messages:
${email.Thread.map((thread, threadIndex) => `
  Message ${threadIndex + 1}:
  Description: ${thread.request_description}
  Body: ${thread.email_body}
  Reply: ${thread.Reply || 'No reply yet'}
  Timestamp: ${thread.timestamp}
`).join('\n')}
`).join('\n')}

Please provide a response in the following JSON format:
{
  "relevant_tickets": [
    {
      "ticket_number": "string", // The ticket number of the most relevant email
      "relevance_score": number, // A score from 1-10 indicating how relevant this email is
      "summary": "string" // A brief summary of why this email is relevant
    }
  ],
  "total_relevant": number, // Total number of relevant emails found
  "ai_reply": "string" // A concise but high-quality response that answers the user's query with relevant facts and insights from the emails, without mentioning ticket numbers or technical identifiers
}

Instructions:
1. Only include emails that are actually relevant to the query
2. Sort tickets by relevance_score in descending order (most relevant first)
3. Provide a clear, concise summary for each relevant email
4. If no emails are relevant, return an empty relevant_tickets array
5. Do not include any non-relevant emails in the response
5a. Do not mention ticket numbers or technical identifiers in the ai_reply
6. Generate a comprehensive, high-quality AI reply that:
   - Directly addresses the user's query with specific details and facts
   - References relevant emails by their subject and sender instead of ticket numbers
   - Includes key information from each email without technical identifiers
   - Provides concrete data points, dates, and specific content from the emails when relevant
   - Organizes information in a clear, structured manner with proper context
   - Highlights important patterns or insights across multiple emails if applicable
   - Maintains a professional and friendly tone while being thorough and precise
   - Includes quantitative information where available (dates, numbers, statistics)
   - Summarizes complex information in an easily digestible format
   - Keeps responses concise but informative (around 3-5 sentences for simple queries)
   - Focuses on the most relevant information without unnecessary details
   - Uses natural language that an end-user would understand and find helpful

Consider the following when determining relevance:
- The subject and content of the emails
- The request type and status
- The thread messages and their context
- Any replies or responses
- The timestamp and recency of the emails`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      max_tokens: 1500,
    });

    const aiContent = completion.choices[0]?.message?.content || '';

    let parsedResponse: AIParsedResponse | null = null;
    try {
      parsedResponse = JSON.parse(aiContent);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return {
        content: '',
        error: 'Could not parse AI response. Try rephrasing your query.',
      };
    }

    if (!parsedResponse || !parsedResponse.relevant_tickets.length) {
      return {
        content: parsedResponse?.ai_reply || 'No relevant emails found.',
        error: undefined,
        matchedEmails: [],
      };
    }

    const relevantTicketNumbers = new Set(
      parsedResponse.relevant_tickets.map(t => t.ticket_number)
    );
    console.log(relevantTicketNumbers)

    const matchedEmails = emails.filter(email =>
      relevantTicketNumbers.has(email.ticket_no)
    );
    console.log(matchedEmails)

    return {
      content: parsedResponse.ai_reply || 'No response generated',
      matchedEmails,
    };
  } catch (error) {
    console.error('Error processing assistant query:', error);
    return {
      content: '',
      error: 'Failed to process your query. Please try again.',
    };
  }
}