"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { checkUserProfile } from "@/lib/user/profile";
import { fetchEmails } from "@/lib/email/emails";

export default function AutomatedReply() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkProfileAndSetup = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.warn("No access token found.");
        setIsActive(false);
        return;
      }

      const profileResponse = await checkUserProfile(accessToken);
      console.log("Profile response:", profileResponse);

      if (
        profileResponse.status === "success" &&
        profileResponse.hasProfile &&
        profileResponse.profileData
      ) {
        const { auto_reply, assistant_token } = profileResponse.profileData;
        const shouldActivate = auto_reply && !!assistant_token;
        console.log("Should activate:", shouldActivate);
        setIsActive(shouldActivate);
      } else {
        console.warn("Invalid profile data");
        setIsActive(false);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const runAutomatedReply = async () => {
    console.log("runAutomatedReply called - isActive:", isActive);
    if (!isActive) return;

    setStatus("running");
    try {
      console.log("Calling fetchEmails...");
      const result = await fetchEmails();
      console.log("Fetched emails result:", result);
      setStatus("success");

      if (result && result.data && result.data.length > 0) {
        toast.success(`Fetched ${result.data.length} emails successfully`);
      } else {
        toast.success("Email check completed. No new emails found.");
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setStatus("error");
      toast.error("Failed to fetch emails");
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const scheduleNextRun = () => {
    timeoutRef.current = setTimeout(() => {
      runAutomatedReply().finally(() => {
        if (isActive) {
          scheduleNextRun(); // continue only if still active
        }
      });
    }, 60000); // 1 minute after previous run completes
  };

  useEffect(() => {
    checkProfileAndSetup();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      runAutomatedReply().finally(() => {
        scheduleNextRun();
      });
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30">
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}

      {status === "running" && (
        <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
      )}
      {status === "success" && (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      )}
      {status === "error" && (
        <XCircle className="h-3 w-3 text-red-500" />
      )}

      <Badge
        variant={isActive ? "default" : "outline"}
        className={`text-xs px-2 py-0 h-5 ${isActive ? "bg-green-500 hover:bg-green-600" : "text-muted-foreground"}`}
      >
        {isActive ? "Auto-fetch" : "Disabled"}
      </Badge>
    </div>
  );
}