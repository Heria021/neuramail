"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AIAssistantCard() {
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
          <Input placeholder="Ask AI anything about your emails" />
        </div>
      </CardContent>
    </Card>
  );
} 