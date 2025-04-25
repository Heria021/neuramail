"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Forward, Clock, Pin } from "lucide-react";
import { EmailTicket } from "./EmailTicket";

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
      timestamp: { $date: string };
    }>;
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
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onForward}>
            <Forward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSchedule}>
            <Clock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onPin}>
            <Pin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden">
        {ticket ? (
          <EmailTicket ticket={ticket} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No message selected
          </div>
        )}
      </div>
    </div>
  );
}