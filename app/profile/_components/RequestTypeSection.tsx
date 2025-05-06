"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { update_req_types } from "@/lib/user/requestType";
import { Save, Plus, X } from "lucide-react";

interface RequestTypeSectionProps {
  hasProfile: boolean;
  assistantId: string | null;
  onUpdate: () => void;
}

export default function RequestTypeSection({
  hasProfile,
  assistantId,
  onUpdate
}: RequestTypeSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [requestTypes, setRequestTypes] = useState<string[]>([""]);

  const addRequestType = () => {
    setRequestTypes([...requestTypes, ""]);
  };

  const removeRequestType = (index: number) => {
    const newTypes = [...requestTypes];
    newTypes.splice(index, 1);
    setRequestTypes(newTypes);
  };

  const updateRequestType = (index: number, value: string) => {
    const newTypes = [...requestTypes];
    newTypes[index] = value;
    setRequestTypes(newTypes);
  };

  const handleSubmit = async () => {
    // Filter out empty request types
    const filteredTypes = requestTypes.filter(type => type.trim() !== "");

    if (filteredTypes.length === 0) {
      toast.error("Please add at least one request type");
      return;
    }

    setIsLoading(true);
    try {
      const response = await update_req_types(filteredTypes);

      if (response && response.status === "success") {
        toast.success("Request types updated", {
          description: "Your request types have been updated successfully.",
        });
        onUpdate();
      } else {
        toast.error("Failed to update request types", {
          description: response?.message || "There was an error updating your request types.",
        });
      }
    } catch (error) {
      console.error("Failed to update request types:", error);
      toast.error("Failed to update request types", {
        description: "We couldn't update your request types. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 border p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Request Types</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add request types that will be used to categorize emails.
        </p>

        {requestTypes.map((type, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={type}
              onChange={(e) => updateRequestType(index, e.target.value)}
              placeholder="Enter request type"
              disabled={!hasProfile || isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => removeRequestType(index)}
              disabled={requestTypes.length <= 1 || !hasProfile || isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={addRequestType}
            disabled={!hasProfile || isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Type
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!hasProfile || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                Updating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Save className="mr-2 h-4 w-4" />
                Save Types
              </span>
            )}
          </Button>
        </div>

        {assistantId && hasProfile && (
          <p className="text-sm text-green-500 mt-2">
            Assistant ID has been created.
          </p>
        )}
      </div>
    </div>
  );
}
