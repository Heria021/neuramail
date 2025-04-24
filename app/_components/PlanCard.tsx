"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PlanCard() {
  return (
    <Card className="bg-muted">
      <CardHeader className="text-sm font-medium">Basic Plan</CardHeader>
      <CardContent>
        <p className="text-sm">0 / 15 messages remaining</p>
        <p className="text-xs mt-2 text-muted-foreground">Upgrade to pro to ask as many questions as you want</p>
        <Button className="mt-3 w-full">Upgrade Plan</Button>
      </CardContent>
    </Card>
  );
} 