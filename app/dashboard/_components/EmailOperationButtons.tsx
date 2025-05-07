"use client";
import { Button } from "@/components/ui/button";
import { Trash2, Forward, Clock, Pin } from "lucide-react";

interface EmailOperationButtonsProps {
  onDelete?: () => void;
  onForward?: () => void;
  onSchedule?: () => void;
  onPin?: () => void;
  className?: string;
}

export function EmailOperationButtons({
  onDelete,
  onForward,
  onSchedule,
  onPin,
  className = ""
}: EmailOperationButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onForward}>
        <Forward className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onSchedule}>
        <Clock className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onPin}>
        <Pin className="h-4 w-4" />
      </Button>
    </div>
  );
}
