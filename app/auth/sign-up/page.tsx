"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../_components/AuthLayout";
import AuthFooter from "../_components/AuthFooter";
import OTPConfirmation from "./_components/Otp";
import SignUpForm from "./_components/SignUp";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type SignUpStep = "signup" | "verification";

type SignUpState = {
    currentStep: SignUpStep;
    email: string | null;
    password?: string;
};

export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<SignUpState>({
        currentStep: "signup",
        email: null
    });

    useEffect(() => {
        // Check if user is already logged in
        try {
            const accessToken = localStorage.getItem("access_token");
            // if (accessToken) {
            //     router.push("/dashboard");
            // }
            setIsLoading(false);
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            // Always set loading to false, even if there's an error
            setIsLoading(false);
        }
    }, [router]);

    const handleSignUpSuccess = (email: string, password: string) => {
        setState(prev => ({
            ...prev,
            currentStep: "verification",
            email,
            password
        }));
    };

    const handleVerificationSuccess = () => {
        // Redirect to profile page after successful verification
        router.push("/profile");
    };

    const handleBackToSignUp = () => {
        setState(prev => ({
            ...prev,
            currentStep: "signup"
        }));
    };

    const { currentStep, email } = state;

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Determine title and subtitle based on current step
    let title = "Create Your Account";
    let subtitle = "Sign up for NeuraMail to access your neural-enhanced email experience";

    if (currentStep === "verification") {
        title = "Verify Your Account";
        subtitle = "Enter the verification code we sent to your email";
    }

    // Determine footer based on current step
    let footer = null;

    if (currentStep === "signup") {
        footer = (
            <AuthFooter
                text="Already have an account?"
                links={[
                    {
                        text: "Sign in to your account",
                        href: "/auth/sign-in"
                    }
                ]}
            />
        );
    } else if (currentStep === "verification") {
        footer = (
            <Button
                variant="ghost"
                className="text-xs"
                onClick={handleBackToSignUp}
            >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back to sign up
            </Button>
        );
    }

    return (
        <AuthLayout
            title={title}
            subtitle={subtitle}
            footer={footer}
        >
            {currentStep === "signup" && (
                <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
            )}

            {currentStep === "verification" && email && (
                <OTPConfirmation
                    email={email}
                    password={state.password}
                    onVerificationSuccess={handleVerificationSuccess}
                />
            )}
        </AuthLayout>
    );
}