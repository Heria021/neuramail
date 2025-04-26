"use client";

import { useState } from "react";
import AuthLayout from "../_components/AuthLayout";
import AuthFooter from "../_components/AuthFooter";
import OTPConfirmation from "./_components/Otp";
import SignUpForm from "./_components/SignUp";

type SignUpState = {
    isSignUpSuccessful: boolean;
    email: string | null;
};

export default function SignUp() {
    const [state, setState] = useState<SignUpState>({
        isSignUpSuccessful: false,
        email: null
    });

    const handleSignUpSuccess = (email: string) => {
        setState(prev => ({
            ...prev,
            isSignUpSuccessful: true,
            email
        }));
    };

    const { isSignUpSuccessful, email } = state;

    return (
        <AuthLayout
            title={isSignUpSuccessful ? "Confirm Your Account" : "Sign Up for NeuraMail"}
            subtitle={isSignUpSuccessful 
                ? "Enter the verification code sent to your email" 
                : "Create your neural-enhanced email account"}
            footer={!isSignUpSuccessful && (
                <AuthFooter
                    text="Already have an account?"
                    links={[
                        { text: "Continue to Your Account", href: "/auth/sign-in" }
                    ]}
                    divider=""
                />
            )}
        >
            {!isSignUpSuccessful ? (
                <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
            ) : email && (
                <OTPConfirmation email={email} />
            )}
        </AuthLayout>
    );
}