"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../auth/_components/AuthLayout";
import AuthFooter from "../auth/_components/AuthFooter";
import ProfileForm from "./_components/ProfileForm";
import { Loader2, ArrowLeft } from "lucide-react";


export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    try {
      const accessToken = localStorage.getItem("access_token");
      const userEmail = localStorage.getItem("user_email");

      if (!accessToken) {
        // Redirect to sign-in if not authenticated
        router.push("/auth/sign-in");
        return;
      }

      setEmail(userEmail);
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

  // If email is not available, show error
  if (!email) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-red-500 mb-4">Authentication error. Please sign in again.</p>
        <button
          onClick={() => router.push("/auth/sign-in")}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Complete Your Profile"
      subtitle="Tell us a bit more about yourself to get started">
      <ProfileForm email={email} />
    </AuthLayout>
  );
}
