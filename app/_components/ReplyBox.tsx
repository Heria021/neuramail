"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Upload, Wand2 } from "lucide-react";

interface ReplyBoxProps {
  recipientName: string;
  onSend?: (message: string, attachments: File[]) => void;
}

export function ReplyBox({ recipientName, onSend }: ReplyBoxProps) {
  const [message, setMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const generateAIReply = async () => {
    setIsGeneratingAI(true);
    try {
      // TODO: Implement AI reply generation
      const aiResponse = "AI-generated response will appear here...";
      setMessage(aiResponse);
    } catch (error) {
      console.error("Error generating AI reply:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="border-t p-4 bg-background sticky bottom-0">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Reply to ${recipientName}...`}
          className="mb-2 resize-none min-h-[96px]"
        />
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={generateAIReply}
            disabled={isGeneratingAI}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Draft</Button>
          <Button
            onClick={() => onSend?.(message, attachments)}
            disabled={!message.trim()}
          >
            Send
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 