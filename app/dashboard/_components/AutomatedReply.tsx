"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { checkUserProfile } from "@/lib/user/profile";
import { fetchEmails } from "@/lib/email/emails";
import { sendAutomatedReply } from "@/lib/automated/automatedRespose";

export default function AutomatedReply() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [operation, setOperation] = useState<"fetch" | "reply">("fetch");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const run = async () => {
      setStatus("running");
      setOperation("fetch");

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.warn("Missing access token");
        setStatus("error");
        return;
      }

      try {
        const profile = await checkUserProfile(accessToken);
        const isEnabled = profile?.status === "success" && profile?.hasProfile;
        const hasAutoReply = profile?.profileData?.auto_reply;
        const hasToken = !!profile?.profileData?.assistant_token;

        const emails = await fetchEmails();
        const emailCount = emails?.data?.emails?.email?.length || 0;

        if (emailCount > 0) {
          toast.success(`Fetched ${emailCount} emails`);

          if (isEnabled && hasAutoReply && hasToken) {
            setOperation("reply");
            const reply = await sendAutomatedReply();
            if (reply?.status === "success") {
              toast.success(`Auto-replied to ${emailCount} emails`);
            } else {
              toast.error("Failed to auto-reply");
            }
          } else {
            console.log("Auto-reply not enabled or missing token");
          }
        } else {
          toast.success("No new emails");
        }

        setStatus("success");
      } catch (err) {
        console.error("Automation error:", err);
        toast.error("Automation failed");
        setStatus("error");
      } finally {
        setTimeout(() => setStatus("idle"), 3000);
      }
    };

    run(); 
    interval = setInterval(run, 60000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30">
      {status === "running" && <Loader2 className="h-3 w-3 animate-spin text-amber-500" />}
      {status === "success" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
      {status === "error" && <XCircle className="h-3 w-3 text-red-500" />}

      <Badge
        variant="outline"
        className={`text-xs px-2 py-0 h-5 rounded-full font-medium flex items-center gap-2 ${
          operation === "reply"
            ? "bg-emerald-100 text-emerald-800"
            : status === "running"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        <CircleDot strokeWidth={3} className="h-3 w-3 text-blue-500" />
        {operation === "reply" ? "Auto-Reply" : "Auto-Fetch"}
      </Badge>
    </div>
  );
}
