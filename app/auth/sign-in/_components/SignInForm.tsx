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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { checkUserProfile } from "@/lib/user/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const signInForm = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const handleSignIn: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            // Call the Next.js API route for sign-in
            const response = await axios.post('/api/auth/sign-in', {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe
            });


            if (response.data.status === true) {
                toast.success("Welcome back!", {
                    description: response.data.message || "Login successful",
                });

                // The cookies are set by the API, but we'll also set localStorage for backward compatibility
                // This will be removed in future versions
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("user_email", data.email);
                localStorage.setItem("login_id", response.data.login_id);

                // If remember me is checked, set a flag in localStorage for backward compatibility
                if (data.rememberMe) {
                    localStorage.setItem("remember_user", "true");
                }

                // Check if user has a profile
                try {
                    const profileCheck = await checkUserProfile(response.data.access_token);

                    if (profileCheck.status === "success") {
                        if (!profileCheck.hasProfile) {
                            // User doesn't have a profile, redirect to profile creation
                            console.log("Redirecting to profile page - no profile found");
                            router.push("/profile");
                        } else {
                            // User has a profile, redirect to dashboard
                            console.log("Redirecting to dashboard - profile found");
                            router.push("/dashboard");
                        }
                    } else {
                        // Error checking profile, redirect to profile page to be safe
                        console.error("Error checking profile:", profileCheck.message);
                        console.log("Redirecting to profile page due to profile check error");
                        router.push("/profile");
                    }
                } catch (profileError) {
                    console.error("Error checking profile:", profileError);
                    // If we can't check the profile, redirect to profile page to be safe
                    console.log("Redirecting to profile page due to profile check exception");
                    router.push("/profile");
                }
            } else {
                toast.error("Authentication failed", {
                    description: response.data.message || "Please check your credentials and try again",
                });
            }
        } catch (error) {
            console.error("Failed to sign in:", error);

            // Handle axios error responses
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "We couldn't sign you in. Please try again later.";

            toast.error("Sign in failed", {
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
            <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-5">
                    <FormField
                        control={signInForm.control}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signInForm.control}
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
                                            autoComplete="current-password"
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signInForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Remember me</FormLabel>
                                    <FormDescription>
                                        Stay signed in on this device
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full mt-8"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}