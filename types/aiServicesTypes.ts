  export interface ThreadMessage {
    message_id: string;
    request_description: string;
    email_body: string;
    Reply: string | null;
    timestamp: string;
  }
  
  export interface Email {
    ticket_no: string;
    sender_email: string;
    Subject: string;
    request_type: string;
    Thread: ThreadMessage[];
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EmailQueryResponse {
    status: string;
    message: string;
    data: Email[];
  }
  
  export interface SimpleEmail {
    subject: string;
    content: string;
    date: string;
  }
  
  export interface RelevantTicket {
    ticket_number: string;
    relevance_score: number;
    summary: string;
  }
  
  export interface AIParsedResponse {
    relevant_tickets: RelevantTicket[];
    total_relevant: number;
    ai_reply: string;
  }
  