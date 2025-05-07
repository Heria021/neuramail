"use client"
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar } from "./Sidebar";
import { EmailList } from "./EmailList";
import { EmailContent } from "./EmailContent";
import { MailCompose } from "./MailCompose";
import { getAllEmailQueries } from "@/lib/email/fetch";

interface EmailTicket {
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
}

export default function EmailLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [tickets, setTickets] = useState<EmailTicket[]>([]);

  useEffect(() => {
    async function loadEmails() {
      const result = await getAllEmailQueries();
      if (result?.data) {
        setTickets(result.data);
      }
    }
    loadEmails();
  }, []);

  // Add keyboard shortcut for Command+O
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "o") {
        event.preventDefault();
        setIsComposeOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectTicket = (ticket: EmailTicket) => {
    setSelectedTicketId(ticket.ticket_no);
  };

  const handleDelete = () => {
    console.log("Delete ticket:", selectedTicketId);
  };

  const handleForward = () => {
    console.log("Forward ticket:", selectedTicketId);
  };

  const handleSchedule = () => {
    console.log("Schedule ticket:", selectedTicketId);
  };

  const handlePin = () => {
    console.log("Pin ticket:", selectedTicketId);
  };

  const selectedTicket = tickets.find(ticket => ticket.ticket_no === selectedTicketId);

  return (
      <div className="flex h-screen w-full">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          onComposeClick={() => setIsComposeOpen(true)}
          onSelectEmail={(ticket) => setSelectedTicketId(ticket.ticket_no)}
        />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <EmailList
              onSearch={handleSearch}
              onSelectTicket={handleSelectTicket}
              selectedTicketId={selectedTicketId}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <EmailContent
              onDelete={handleDelete}
              onForward={handleForward}
              onSchedule={handleSchedule}
              onPin={handlePin}
              ticket={selectedTicket}
            />
          </ResizablePanel>
        </ResizablePanelGroup>

        <MailCompose open={isComposeOpen} onOpenChange={setIsComposeOpen} />
      </div>
  );
}
