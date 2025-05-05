'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../_components/AuthLayout";
import AuthFooter from "../_components/AuthFooter";
import SignInForm from "./_components/SignInForm";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        router.push("/dashboard");
      }
      setIsLoading(false);

    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      // Always set loading to false, even if there's an error
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

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your NeuraMail account to access your neural-enhanced email experience"
      footer={
        <AuthFooter
          text="Don't have an account?"
          links={[
            {
              text: "Create an account",
              href: "/auth/sign-up"
            },
            {
              text: "Forgot password?",
              href: "/auth/reset-password",
              className: "text-blue-600"
            }
          ]}
        />
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}