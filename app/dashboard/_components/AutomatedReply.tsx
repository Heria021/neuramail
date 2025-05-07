"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { checkUserProfile } from "@/lib/user/profile";
import { fetchEmails } from "@/lib/email/emails";
import { sendAutomatedReply } from "@/lib/automated/automatedRespose";

export default function AutomatedReply() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [operationType, setOperationType] = useState<"fetch" | "reply">("fetch");
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [hasAutoReply, setHasAutoReply] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialCheckDone = useRef<boolean>(false);

  const checkProfileAndSetup = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.warn("No access token found.");
        setHasAutoReply(false);
        setHasValidToken(false);
        return false;
      }

      const profileResponse = await checkUserProfile(accessToken);
      console.log("Profile response:", profileResponse);

      if (
        profileResponse.status === "success" &&
        profileResponse.hasProfile &&
        profileResponse.profileData
      ) {
        const { auto_reply, assistant_token } = profileResponse.profileData;

        // Set premium status based on profile data
        const hasValidAssistantToken = !!assistant_token;
        const hasAutoReplyEnabled = auto_reply;
        console.log("hasValidToken", hasValidAssistantToken);
        console.log("hasAutoReply", hasAutoReplyEnabled);
        setHasValidToken(hasValidAssistantToken);
        setHasAutoReply(hasAutoReplyEnabled);

        // Log the premium feature state to help debug
        console.log("Premium feature state:", {
          hasValidToken: hasValidAssistantToken,
          auto_reply: hasAutoReplyEnabled,
        });

        return { hasValidToken: hasValidAssistantToken, hasAutoReply: hasAutoReplyEnabled };
      } else {
        console.warn("Invalid profile data");
        setHasAutoReply(false);
        setHasValidToken(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setHasAutoReply(false);
      setHasValidToken(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const runAutomatedReply = async (profileSettings?: { hasValidToken: boolean, hasAutoReply: boolean }) => {
    setOperationType("fetch");
    setStatus("running");

    try {
      const result = await fetchEmails();
      console.log(result);

      // Use the passed profile settings or fall back to state values
      const settings = profileSettings || { hasValidToken, hasAutoReply };

      if (result && result.success && result.data.emails.email.length > 0) {
        const emailCount = result.data.emails.email.length;
        toast.success(`Fetched ${emailCount} emails successfully`);

        // Log the current state to debug why automated reply might not be triggering
        console.log("Automated reply check:", {
          "hasValidToken": settings.hasValidToken,
          "hasAutoReply": settings.hasAutoReply,
        });

        if (settings.hasValidToken && settings.hasAutoReply) {
          setOperationType("reply");

          try {
            const replyResult = await sendAutomatedReply();
            console.log("Automated reply result:", replyResult);
            toast.success(`Processed ${emailCount} emails with automated replies`);
            setStatus("success");
          } catch (replyError) {
            console.error("Error in automated reply:", replyError);
            toast.error("Failed to send automated replies");
            setStatus("error");
          }
        } else {
          console.log("Not sending automated reply because:", {
            "hasValidToken": settings.hasValidToken,
            "hasAutoReply": settings.hasAutoReply,
          });
          setStatus("success");
        }
      } else {
        toast.success("Email check completed. No new emails found.");
        setStatus("success");
      }

    } catch (error) {
      setStatus("error");
      toast.error("Failed to fetch emails");
    } finally {
      setTimeout(() => {
        setOperationType("fetch");
        setStatus("idle");
      }, 2000);
    }
  };

  const scheduleNextRun = () => {
    timeoutRef.current = setTimeout(() => {
      runAutomatedReply().finally(() => {
        scheduleNextRun();
      });
    }, 60000); // 1 minute
  };

  useEffect(() => {
    const initialize = async () => {
      const profileSettings = await checkProfileAndSetup();

      if (profileSettings) {
        await runAutomatedReply(profileSettings);
      } else {
        await runAutomatedReply({ hasValidToken: false, hasAutoReply: false });
      }

      scheduleNextRun();
      initialCheckDone.current = true;
    };

    initialize();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30">
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}

      {status === "running" && (
        <Loader2 className={`h-3 w-3 animate-spin ${operationType === "fetch" ? "text-amber-500" : "text-green-500"}`} />
      )}

      {status === "success" && (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      )}

      {status === "error" && (
        <XCircle className="h-3 w-3 text-red-500" />
      )}

      {hasValidToken && (
        <CircleDot className={`h-3 w-3 ${!hasAutoReply ? "text-red-500" : "text-blue-500"}`} />
      )}

      <Badge
        variant="outline"
        className={`text-xs px-2 py-0 h-5 transition-colors duration-300 ${
          operationType === "reply"
            ? "bg-green-500 text-white hover:bg-green-600"
            : status === "running"
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "text-muted-foreground"
        }`}
      >
        {operationType === "fetch" ? "Auto-Fetch" : "Auto-Reply"}
      </Badge>
    </div>
  );
}