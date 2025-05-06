"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateAssistantToken } from "@/lib/user/updateAssistantToken";
import { Save, Key } from "lucide-react";

interface AssistantTokenSectionProps {
  hasProfile: boolean;
  assistantId: string | null;
  assistantToken: string | null;
  onUpdate: () => void;
}

export default function AssistantTokenSection({
  hasProfile,
  assistantId,
  assistantToken,
  onUpdate
}: AssistantTokenSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(assistantToken || "");

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast.error("Please enter an assistant token");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateAssistantToken(token);

      if (response && response.status === "success") {
        toast.success("Assistant token updated", {
          description: "Your assistant token has been updated successfully.",
        });
        onUpdate();
      } else {
        toast.error("Failed to update assistant token", {
          description: response?.message || "There was an error updating your assistant token.",
        });
      }
    } catch (error) {
      console.error("Failed to update assistant token:", error);
      toast.error("Failed to update assistant token", {
        description: "We couldn't update your assistant token. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 border p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Assistant Token</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter your OpenAI assistant token to enable AI features.
        </p>

        <div className="relative">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your OpenAI assistant token"
            type="password"
            disabled={!hasProfile || !assistantId || isLoading}
            className="pl-10"
          />
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!hasProfile || !assistantId || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                Updating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Save className="mr-2 h-4 w-4" />
                Save Token
              </span>
            )}
          </Button>
        </div>

        {!assistantId && hasProfile && (
          <p className="text-sm text-amber-500 mt-2">
            No Assistant ID yet. Set up request types first to create an assistant ID.
          </p>
        )}

        {assistantId && hasProfile && assistantToken && (
          <p className="text-sm text-green-500 mt-2">
            Assistant token is set up successfully.
          </p>
        )}
      </div>
    </div>
  );
}
