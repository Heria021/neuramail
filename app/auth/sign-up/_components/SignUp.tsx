"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Mail, UserPlus } from "lucide-react";
import axios from "axios";

const signUpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
    onSignUpSuccess: (email: string, password: string) => void;
}

export default function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSignUp: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            // Call the Next.js API route for sign-up
            const response = await axios.post('/api/auth/sign-up', {
                email: data.email,
                password: data.password
            });

            if (response.data.status === "success") {
                onSignUpSuccess(data.email, data.password);
                toast.success("Account created", {
                    description: "Please check your email for the verification code.",
                });
            } else {
                toast.error("Registration failed", {
                    description: response.data.message || "This email may already be registered.",
                });
            }
        } catch (error) {
            console.error("Failed to sign up:", error);

            // Handle axios error responses
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "We couldn't create your account. Please try again later.";

            toast.error("Registration failed", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                    <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="you@example.com"
                                            type="email"
                                            disabled={isLoading}
                                            className="pl-10"
                                            autoComplete="email"
                                        />
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    We'll send a verification code to this email
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-2.5 text-muted-foreground"
                                            tabIndex={-1}
                                        >
                                            {showPassword ?
                                                <EyeOff className="h-4 w-4" /> :
                                                <Eye className="h-4 w-4" />
                                            }
                                        </button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Must be at least 6 characters
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full mt-8"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                                Creating account...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create Account
                            </span>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}