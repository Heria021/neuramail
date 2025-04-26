import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";
import AuthHeader from "./AuthHeader";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mb-0 sm:mb-40 w-full max-w-sm shadow-md border rounded-lg">
        <CardHeader className="text-center">
          <AuthHeader title={title} subtitle={subtitle} />
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <div className="text-center my-4 flex flex-col items-center gap-1">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
} 