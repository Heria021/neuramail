"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { processAssistantQuery, type AIResponse } from "@/lib/ai/aiService";
import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, X, Send, AlertCircle, Mail, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AIAssistantCardProps {
  onSelectEmail?: (ticket: {
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
  }) => void;
}

export function AIAssistantCard({ onSelectEmail }: AIAssistantCardProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when new response is received
  useEffect(() => {
    if (responseRef.current && reply) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [reply]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await processAssistantQuery(query);
      if (response.error) {
        setError(response.error);
      } else {
        setReply(response);
      }
    } catch (error) {
      setError("Failed to process your query. Please try again.");
      console.error("Error processing query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuery = async (text: string) => {
    setQuery(text);
    await new Promise((resolve) => setTimeout(resolve, 10));
    handleQuery();
  };

  const handleClear = () => {
    setQuery("");
    setReply(null);
    setError(null);
    setShowSuggestions(true);

    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Card className="flex-1 gap-4 p-0 flex flex-col transition-all duration-300 h-full max-h-[calc(100vh-220px)] border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="text-sm font-medium py-3 px-4 flex flex-row items-center justify-between sticky top-0 z-10 bg-card border-b shrink-0">
        <span className="flex flex-row items-center gap-2 overflow-hidden">
          <Bot className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold truncate">Email Assistant</span>
          <Badge variant="outline" className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 shrink-0 hidden sm:flex">
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            AI Powered
          </Badge>
        </span>
        {(reply || error) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-destructive/10 shrink-0 ml-2"
            onClick={handleClear}
            title="Clear conversation"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>

      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full" >
        <CardContent className="space-y-4 p-0 px-4 min-h-[200px] max-w-full w-full" >
          {/* Welcome message when no interaction yet */}
          {!reply && !error && !isLoading && showSuggestions && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2 overflow-hidden">
                  <p className="text-sm font-medium">Hello! I'm your email assistant.</p>
                  <p className="text-xs text-muted-foreground break-words">I can help you find emails, summarize conversations, and more. What would you like to know?</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium mb-2">Try asking about:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                    onClick={() => handleQuickQuery("Show me important emails")}
                  >
                    <MessageSquare className="h-3 w-3 mr-1.5" />
                    Important emails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                    onClick={() => handleQuickQuery("Any refund-related emails?")}
                  >
                    <Mail className="h-3 w-3 mr-1.5" />
                    Refund updates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                    onClick={() => handleQuickQuery("Any complaints or misbehavior reports?")}
                  >
                    <AlertCircle className="h-3 w-3 mr-1.5" />
                    Complaints
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <div className="flex-1 space-y-2 overflow-hidden">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="space-y-2 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="bg-destructive/10 p-2 rounded-full shrink-0">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-destructive">Something went wrong</p>
                  <p className="text-xs text-muted-foreground break-words">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs h-7"
                    onClick={handleClear}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {reply && (
            <div className="space-y-4 animate-in fade-in" ref={responseRef}>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3 overflow-hidden" >
                  <div className="break-words overflow-hidden w-full">
                    <TextGenerateEffect
                      duration={0.3}
                      className="font-normal text-sm text-muted-foreground max-w-full whitespace-normal break-words overflow-wrap-anywhere"
                      words={reply.content}
                    />
                  </div>

                  {/* Matched emails section */}
                  {reply.matchedEmails && reply.matchedEmails.length > 0 && (
                    <div className="mt-3 pt-3 border-t w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <p className="text-xs font-medium">Relevant emails ({reply.matchedEmails.length})</p>
                      </div>
                      <div className="space-y-2 w-full overflow-y-auto max-h-[200px]">
                        {reply.matchedEmails.map((email) => (
                          <div
                            key={email.ticket_no}
                            className="text-xs p-3 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors border border-border/50 hover:border-primary/20 overflow-hidden w-full"
                            onClick={() => onSelectEmail?.(email)}
                          >
                            <div className="flex justify-between items-start mb-1 w-full">
                              <p className="font-medium line-clamp-1 flex-1 mr-2 overflow-ellipsis overflow-hidden">{email.Subject}</p>
                              <Badge variant="outline" className="text-[10px] h-4 shrink-0 whitespace-nowrap">
                                {email.request_type}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1 w-full overflow-hidden">
                              <span className="truncate max-w-full">{email.sender_email}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Input area */}
      <div className="p-3 border-t bg-card/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-1 w-full">
          <Input
            ref={inputRef}
            placeholder="Ask about your emails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuery();
              }
            }}
            disabled={isLoading}
            className={cn(
              "py-4 pl-4 pr-4 bg-background border-primary/20 focus-visible:ring-primary/20 text-sm w-full",
              isLoading && "opacity-70"
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !query.trim()}
            onClick={handleQuery}
            className="h-8 w-8 rounded-full flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}