"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailLayout from "./_components/EmailLayout";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        // Redirect to sign-in if not authenticated
        console.log("No access token found, redirecting to sign-in");
        router.push("/auth/sign-in");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.push("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, show nothing (will be redirected)
  if (!isAuthenticated) {
    return null;
  }

  // Show the dashboard if authenticated
  return (
    <div className="w-full h-full">
      <EmailLayout />
    </div>
  );
}
