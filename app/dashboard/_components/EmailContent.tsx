"use client";
import { Separator } from "@/components/ui/separator";
import { EmailTicket } from "./EmailTicket";
import AutomatedReply from "./AutomatedReply";

interface EmailContentProps {
  title?: string;
  className?: string;
  onDelete?: () => void;
  onForward?: () => void;
  onSchedule?: () => void;
  onPin?: () => void;
  ticket?: {
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

export function EmailContent({
  title = "Inbox",
  className = "",
  onDelete,
  onForward,
  onSchedule,
  onPin,
  ticket
}: EmailContentProps) {
  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex items-center gap-4">
          <AutomatedReply />
        </div>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden">
        {ticket ? (
          <EmailTicket
            ticket={ticket}
            onDelete={onDelete}
            onForward={onForward}
            onSchedule={onSchedule}
            onPin={onPin}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No message selected
          </div>
        )}
      </div>
    </div>
  );
}