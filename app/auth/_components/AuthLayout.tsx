import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";
import AuthHeader from "./AuthHeader";
import Image from "next/image";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  logoUrl?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <AuthHeader title={title} subtitle={subtitle} />
          </CardHeader>

          <CardContent className="px-6 py-4">
            {children}
          </CardContent>

          {footer && (
            <CardFooter className="flex flex-col items-center gap-1 border-t px-6 py-4">
              {footer}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}