"use client";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReplyBox } from "./ReplyBox";

interface EmailTicketProps {
  ticket: {
    ticket_no: string;
    sender_email: string;
    Subject: string;
    request_type: string;
    Thread: Array<{
      message_id: string;
      request_description: string;
      email_body: string;
      timestamp: { $date: string };
    }>;
  };
}

export function EmailTicket({ ticket }: EmailTicketProps) {
  const latestMessage = ticket.Thread[0];
  const senderFull = ticket.sender_email.split("<")[0].trim();
  const senderEmail = ticket.sender_email.match(/<([^>]+)>/)?.[1] || "";
  const formattedDate = format(
    new Date(latestMessage.timestamp.$date),
    "PPpp"
  );

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) return words[0][0] + words[1][0];
    return words[0][0];
  };

  const handleSendReply = (message: string, attachments: File[]) => {
    // TODO: Implement send reply functionality
    console.log("Sending reply:", { message, attachments });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b gap-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(senderFull).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-base font-semibold">{ticket.Subject}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {senderFull} &lt;{senderEmail}&gt;
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formattedDate}
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 text-sm">
        <p className="whitespace-pre-wrap">{latestMessage.request_description}</p>
        <p className="whitespace-pre-wrap">{latestMessage.email_body}</p>
      </div>

      {/* Reply Box */}
      <ReplyBox recipientName={senderFull} onSend={handleSendReply} />
    </div>
  );
}
