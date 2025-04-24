"use client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // ✅ updated import
import { Search } from "lucide-react";
import { sampleTickets } from "../data/sampleTickets";
import { format } from "date-fns";
import { useState } from "react";

interface EmailListProps {
  onSearch?: (query: string) => void;
  className?: string;
  onSelectTicket?: (ticket: typeof sampleTickets[0]) => void;
  selectedTicketId?: string;
}

export function EmailList({ onSearch, className = "", onSelectTicket, selectedTicketId }: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const filteredTickets = sampleTickets.filter(ticket =>
    ticket.Subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.sender_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`border-r p-4 ${className}`}>
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

      <div className="mt-4 space-y-2">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const senderName = ticket.sender_email.split("<")[0].trim();
            const latestMessage = ticket.Thread[0];
            const isSelected = selectedTicketId === ticket._id.$oid;

            return (
              <div
                key={ticket._id.$oid}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted border border-transparent"
                }`}
                onClick={() => onSelectTicket?.(ticket)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate">{senderName}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(latestMessage.timestamp.$date), "MMM d")}
                  </div>
                </div>
                <div className="text-sm font-medium truncate mt-1">{ticket.Subject}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {latestMessage.request_description}
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