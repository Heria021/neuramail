import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfileLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function ProfileLayout({
  title,
  subtitle,
  children,
  footer,
}: ProfileLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl py-4">
        {/* <div className="mb-6 flex items-center">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div> */}
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <Card className="w-full border shadow-lg">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6 space-y-6">
            {children}
          </CardContent>

          {footer && (
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              {footer}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
