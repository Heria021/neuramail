"use client"
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar } from "./Sidebar";
import { EmailList } from "./EmailList";
import { EmailContent } from "./EmailContent";
import { MailCompose } from "./MailCompose";
import { sampleTickets } from "../data/sampleTickets";
import { Separator } from "@radix-ui/react-separator";

export default function EmailLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Add keyboard shortcut for Command+O
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Command+O (Mac) or Ctrl+O (Windows/Linux)
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

  const handleSelectTicket = (ticket: typeof sampleTickets[0]) => {
    setSelectedTicketId(ticket._id.$oid);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete ticket:", selectedTicketId);
  };

  const handleForward = () => {
    // TODO: Implement forward functionality
    console.log("Forward ticket:", selectedTicketId);
  };

  const handleSchedule = () => {
    // TODO: Implement schedule functionality
    console.log("Schedule ticket:", selectedTicketId);
  };

  const handlePin = () => {
    // TODO: Implement pin functionality
    console.log("Pin ticket:", selectedTicketId);
  };

  const selectedTicket = sampleTickets.find(ticket => ticket._id.$oid === selectedTicketId);

  return (
    <div className="flex h-screen w-full">
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
        onComposeClick={() => setIsComposeOpen(true)}
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
