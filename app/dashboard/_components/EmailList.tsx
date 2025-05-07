"use client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import { getAllEmailQueries } from "@/lib/email/fetch";
import { Badge } from "@/components/ui/badge";

interface EmailThread {
  message_id: string;
  request_description: string;
  email_body: string;
  timestamp: string;
  Reply: string | null;
}

interface EmailTicket {
  ticket_no: string;
  sender_email: string;
  Subject: string;
  request_type: string;
  Thread: EmailThread[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailListProps {
  onSearch?: (query: string) => void;
  className?: string;
  onSelectTicket?: (ticket: EmailTicket) => void;
  selectedTicketId?: string;
}

export function EmailList({
  onSearch,
  className = "",
  onSelectTicket,
  selectedTicketId
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<EmailTicket[]>([]);

  // Function to load emails
  const loadEmails = useCallback(async () => {
    const result = await getAllEmailQueries();
    if (result?.data) {
      setTickets(result.data);
    }
  }, []);


  // Initial load of emails
  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.Subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.sender_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`border-r p-4 h-screen overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        <Input
          placeholder="Search"
          className="w-full"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Separator className="my-4" />

      <div className="mt-4 space-y-2 overflow-y-auto hide-scrollbar">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const senderName = ticket.sender_email.split("<")[0].trim();
            const latestMessage = ticket.Thread[0];
            const isSelected = selectedTicketId === ticket.ticket_no;

            return (
              <div
                key={ticket.ticket_no}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted border border-transparent"
                  }`}
                onClick={() => onSelectTicket?.(ticket)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate">{senderName}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(latestMessage.timestamp), "MMM d")}
                  </div>
                </div>
                <div className="text-sm font-medium truncate mt-1">{ticket.Subject}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {latestMessage.request_description}
                </div>
                <div className="flex justify-end mt-2">
                  {ticket.request_type != 'None' && <Badge>{ticket.request_type}</Badge>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}