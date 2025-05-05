import { CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export default function AuthHeader({
  title,
  subtitle,
  icon = <Sparkles className="h-6 w-6 text-primary" />
}: AuthHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <div className="rounded-full bg-primary/10 p-2">
          {icon}
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">
        {title}
      </CardTitle>
      <CardDescription className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        {subtitle}
      </CardDescription>
    </>
  );
}