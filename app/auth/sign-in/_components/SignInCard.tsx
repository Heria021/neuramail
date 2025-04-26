"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignInForm from "./SignInForm";

export default function SignInCard() {
    const router = useRouter()
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="mb-0 sm:mb-40 w-full max-w-sm shadow-md border rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">
                        <p>Sign In for Sentinel</p>
                    </CardTitle>
                    <p className="text-sm font-semibold text-gray-500 mt-2">
                        Enter the email to sign in.
                    </p>
                </CardHeader>
                <CardContent>
                    <SignInForm />
                </CardContent>
                <div className="text-center my-4 flex flex-col items-center gap-1">
                    <p className="text-sm text-gray-500 leading-none">Don't have an account?</p>
                    <div className="flex items-center gap-1">
                        <Link href="/auth/sign-up" className="text-primary text-sm no-underline hover:underline">
                            Create an account
                        </Link>
                        <p className="text-sm">or</p>
                        <Link href="/auth/reset-password" className="text-blue-600 text-sm no-underline hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>

            </Card>
        </div>
    );
}