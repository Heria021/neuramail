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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signUpUser } from "@/lib/auth/signinUser";

const signUpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
    onSignUpSuccess: (email: string) => void;
}

export default function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const handleSignUp: SubmitHandler<FieldValues> = async (data) => {
        try {
            const response = await signUpUser({ email: data.email, password: data.password });
            if (response.status === "success") {
                onSignUpSuccess(data.email);
                toast.success("Success!", {
                    description: "Check your email for the confirmation code.",
                });
            } else {
                toast.error("Error!", {
                    description: "This email already exists. Please try another one.",
                });
            }
        } catch (error) {
            toast.error("Error!", {
                description: "You don't have an account. Please create one.",
            });
        }
    };

    return (
        <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="grid gap-4">
                <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Email" />
                            </FormControl>
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
                                <Input {...field} type="password" placeholder="Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-4 rounded-xl">Sign Up</Button>
            </form>
        </Form>
    );
}