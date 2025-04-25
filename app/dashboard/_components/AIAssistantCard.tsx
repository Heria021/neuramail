"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { processAssistantQuery } from "@/lib/ai/aiService";
import { useState } from "react";

export function AIAssistantCard() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await processAssistantQuery(query);
      console.log("AI Response:", response.content);
      if (response.error) {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Error processing query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="">
      <CardHeader className="text-sm font-medium">Ask AI anything about your emails</CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-xs">
          <Button variant="outline" size="sm">What can I ask?</Button>
          <Button variant="outline" size="sm">When is my next flight?</Button>
          <Button variant="outline" size="sm">When is my next meeting?</Button>
        </div>
        <div className="mt-3">
          <Input 
            placeholder="Ask AI anything about your emails" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleQuery();
              }
            }}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
} 