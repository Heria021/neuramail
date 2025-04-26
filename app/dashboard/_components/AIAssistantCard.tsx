"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { processAssistantQuery, type AIResponse } from "@/lib/ai/aiService";
import { useState } from "react";
import { Bot, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAssistantCard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
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
  };

  return (
    <Card className="flex-1 flex flex-col transition-all duration-300 max-h-[calc(100vh-200px)]">
      <CardHeader className="text-sm font-medium pb-0 mb-0 flex flex-row items-center justify-between sticky top-0 z-10">
        <span className="flex flex-row items-center gap-2">
          <Bot className="h-4 w-4 mx-auto" />
          Ask your email assistant
        </span>
        {reply && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        {!reply && !error && (
          <div className="flex flex-wrap gap-2 text-xs animate-in fade-in">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery("Show me important mails")}
            >
              Show important emails?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery("Any refund-related emails?")}
            >
              Any refund updates?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery("Any complaints or misbehavior reports?")}
            >
              Was someone rude to me?
            </Button>
          </div>
        )}

        {reply && (
          <div className="space-y-4 animate-in fade-in">
            <div className="overflow-y-auto">
              <TextGenerateEffect
                duration={0.4}
                className="font-normal text-xs"
                words={reply.content}
              />
            </div>
            {reply.matchedEmails && reply.matchedEmails.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">Relevant emails:</p>
                <div className="space-y-1">
                  {reply.matchedEmails.map((email) => (
                    <div
                      key={email.ticket_no}
                      className="text-xs p-2 rounded-md bg-muted/50"
                    >
                      <p className="font-medium">{email.Subject}</p>
                      <p className="text-muted-foreground">{email.sender_email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative mt-auto">
          <Input
            placeholder="Ask AI about your emails"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleQuery();
              }
            }}
            disabled={isLoading}
            className={cn("pr-10", isLoading && "animate-pulse")}
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}