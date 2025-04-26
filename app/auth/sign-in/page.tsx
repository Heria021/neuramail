'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../_components/AuthLayout";
import AuthFooter from "../_components/AuthFooter";
import SignInForm from "./_components/SignInForm";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      router.push("/overview/dashbored/bots");
    }
  }, [router]);

  return (
    <AuthLayout
      title="Sign In for NeuraMail"
      subtitle="Access your neural-enhanced email experience"
      footer={
        <AuthFooter
          text="Don't have an account?"
          links={[
            { text: "Create an account", href: "/auth/sign-up" },
            { text: "Forgot password?", href: "/auth/reset-password", className: "text-blue-600" }
          ]}
        />
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}