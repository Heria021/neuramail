import { CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-center mb-2">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="text-2xl font-semibold">
        {title}
      </CardTitle>
      <p className="text-sm font-semibold text-muted-foreground mt-2">
        {subtitle}
      </p>
    </>
  );
} 