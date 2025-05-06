"use client";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReplyBox } from "./ReplyBox";
import { toast } from "sonner";
import { getFullEmailThread } from "@/lib/email/response";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ThreadMessage {
  message_id: string;
  request_description: string;
  email_body: string;
  timestamp: string;
  Reply: string | null;
}

interface ThreadData {
  data: {
    sender_email: string;
    thread_summary: ThreadMessage[];
    ticket_no: string;
  };
  message: string;
  status: string;
}

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
      timestamp: string;
      Reply: string | null;
    }>;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function EmailTicket({ ticket }: EmailTicketProps) {
  const [fullThread, setFullThread] = useState<ThreadData | null>(null);
  const [loading, setLoading] = useState(true);

  const latestMessage = ticket.Thread[0];
  const senderFull = ticket.sender_email.split("<")[0].trim();
  const senderEmail = ticket.sender_email.match(/<([^>]+)>/)?.[1] || "";
  const formattedDate = format(
    new Date(latestMessage.timestamp),
    "PPpp"
  );

  useEffect(() => {
    async function fetchThreadData() {
      try {
        setLoading(true);
        const threadData = await getFullEmailThread(ticket.ticket_no);
        console.log("Fetched thread data:", threadData);
        setFullThread(threadData);
      } catch (error) {
        console.error("Error fetching thread data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchThreadData();
  }, [ticket.ticket_no]);

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) return words[0][0] + words[1][0];
    return words[0][0];
  };

  const handleSendReply = (message: string, attachments: File[]) => {
    console.log("Sending reply:", { message, attachments });
    toast.success("Reply sent successfully");
  };

  // Use the fetched thread data for previous messages if available, otherwise fallback to ticket.Thread
  const previousMessages = fullThread && fullThread.data && fullThread.data.thread_summary && fullThread.data.thread_summary.length > 0
    ? fullThread.data.thread_summary.map(msg =>
        `Request: ${msg.request_description}\n\nMessage: ${msg.email_body}`
      )
    : ticket.Thread.map(msg =>
        `Request: ${msg.request_description}\n\nMessage: ${msg.email_body}`
      ).reverse();

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
        <div className="space-y-6">
          {/* Latest Message */}
          <div className="space-y-2">
            <p className="whitespace-pre-wrap font-medium">Request: {latestMessage.request_description}</p>
            <p className="whitespace-pre-wrap">{latestMessage.email_body}</p>
          </div>

          {/* Thread History */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading thread history...</span>
              </div>
            ) : fullThread && fullThread.data && fullThread.data.thread_summary && fullThread.data.thread_summary.length > 0 ? (
              fullThread.data.thread_summary.map((msg, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-muted">
                  <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-muted-foreground -ml-1" />
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(msg.timestamp), "PPpp")}
                    </div>
                    <p className="whitespace-pre-wrap font-medium">Request: {msg.request_description}</p>
                    <p className="whitespace-pre-wrap">{msg.email_body}</p>
                    {msg.Reply && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <p className="text-xs font-medium mb-1">Reply:</p>
                        <p className="whitespace-pre-wrap text-sm">{msg.Reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback to original thread data if API call fails
              [...ticket.Thread].reverse().map((msg, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-muted">
                  <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-muted-foreground -ml-1" />
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(msg.timestamp), "PPpp")}
                    </div>
                    <p className="whitespace-pre-wrap font-medium">Request: {msg.request_description}</p>
                    <p className="whitespace-pre-wrap">{msg.email_body}</p>
                    {msg.Reply && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <p className="text-xs font-medium mb-1">Reply:</p>
                        <p className="whitespace-pre-wrap text-sm">{msg.Reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reply Box */}
      <ReplyBox
        recipientName={senderFull}
        subject={ticket.Subject}
        previousMessages={previousMessages}
        ticket_id={ticket.ticket_no}
        message_id={latestMessage.message_id}
        to_email={senderEmail}
        onSend={handleSendReply}
      />
    </div>
  );
}
