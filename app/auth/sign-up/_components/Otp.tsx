"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your verification code must be 6 characters.",
  }),
});

interface OTPConfirmationProps {
  email: string;
  password?: string;
  onVerificationSuccess?: () => void;
}

export default function OTPConfirmation({ email, password, onVerificationSuccess }: OTPConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleOTPSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    try {
      // Call the Next.js API route for OTP confirmation
      const response = await axios.post('/api/auth/otp-confirmation', {
        email,
        confirmation_code: data.pin,
        password // Include password for auto-login if available
      });

      if (response.data.status === "success") {
        // Check if auto-login was successful
        if (response.data.autoLogin === true) {
          // Store authentication data
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("user_email", email);
          localStorage.setItem("login_id", response.data.login_id);

          toast.success("Account verified", {
            description: "Your account has been verified and you've been automatically logged in.",
          });

          // Redirect to profile page since this is a new account
          router.push('/profile');
        } else {
          toast.success("Account verified", {
            description: response.data.message || "Your account has been successfully verified. Please sign in to continue.",
          });

          // Call the callback if provided, otherwise redirect to sign-in
          if (onVerificationSuccess) {
            onVerificationSuccess();
          } else {
            router.push('/auth/sign-in');
          }
        }
      } else {
        toast.error("Verification failed", {
          description: response.data.detail || "The verification code is invalid or has expired.",
        });
      }
    } catch (error) {
      console.error("Failed to confirm sign-up:", error);

      // Handle axios error responses
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "We couldn't verify your account. Please try again later.";

      toast.error("Verification failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      // Call the API to resend the verification code
      const response = await axios.post('/api/auth/resend-otp', { email });

      if (response.data.status === "success") {
        toast.info("Verification code sent", {
          description: `A new verification code has been sent to ${email}`,
        });
      } else {
        toast.error("Failed to resend code", {
          description: response.data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Failed to resend verification code:", error);

      // Handle axios error responses
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "We couldn't resend the verification code. Please try again later.";

      toast.error("Failed to resend code", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 h-12 w-12">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          We've sent a verification code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOTPSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter the 6-digit code sent to your email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Account
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="text-xs"
              onClick={resendCode}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Resend verification code
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}