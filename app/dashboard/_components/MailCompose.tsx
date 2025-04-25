"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send, X, Upload, Save, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateEmailReply } from "@/lib/ai";

interface MailComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MailCompose({ open, onOpenChange }: MailComposeProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log("Sending email:", { to, subject, body, attachments });
    onOpenChange(false);
    toast.success("Email sent successfully");
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft:", { to, subject, body, attachments });
    toast.success("Draft saved successfully");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments([...attachments, ...Array.from(files)]);
      toast.success(`${files.length} file(s) attached successfully`);
    }
  };

  const handleAIWrite = async () => {
    setIsGeneratingAI(true);
    const toastId = toast.loading("Generating email content...");
    try {
      const response = await generateEmailReply({
        subject: subject || "New Email",
        previousMessages: [body],
        tone: "professional"
      });

      if (response.error) {
        toast.error(response.error, { id: toastId });
      } else {
        setBody(response.content);
        toast.success("Email content generated successfully", { id: toastId });
      }
    } catch (error) {
      console.error("Error generating email content:", error);
      toast.error("Failed to generate email content. Please try again.", { id: toastId });
    } finally {
      setIsGeneratingAI(false);
      setIsAIMode(false);
    }
  };

  const handleAIClick = () => {
    setIsAIMode(true);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>New Message</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 min-h-[200px]"
          />
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md"
                >
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={() =>
                      setAttachments(attachments.filter((_, i) => i !== index))
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm" onClick={handleAIClick} disabled={isGeneratingAI}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI Write
              </Button>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Attach Files
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={isAIMode ? handleAIWrite : handleSend} disabled={isGeneratingAI}>
                {isGeneratingAI ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : isAIMode ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 