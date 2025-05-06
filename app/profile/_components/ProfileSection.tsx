"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createProfile, updateProfile } from "@/lib/user/profile";
import { useState } from "react";
import { User, Phone, CheckCircle2, Mail, Save } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Invalid email address" }),
  autoreply: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  email: string;
  profileData: any;
  hasProfile: boolean;
  onProfileUpdate: () => void;
  assistantTokenSetup: boolean;
}

export default function ProfileSection({
  email,
  profileData,
  hasProfile,
  onProfileUpdate,
  assistantTokenSetup
}: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileData?.profile_name || "",
      phone: profileData?.phone || "",
      email: email,
      autoreply: profileData?.auto_reply || false,
    },
  });

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Authentication error", {
          description: "Please sign in again to continue.",
        });
        return;
      }

      const formData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        auto_reply: data.autoreply,
      };

      let response;
      if (hasProfile) {
        response = await updateProfile(formData);
      } else {
        response = await createProfile(formData);
      }

      if (response && response.status === "success") {
        toast.success(hasProfile ? "Profile updated" : "Profile created", {
          description: hasProfile
            ? "Your profile has been updated successfully."
            : "Your profile has been set up successfully.",
        });
        onProfileUpdate();
      } else {
        toast.error(hasProfile ? "Profile update failed" : "Profile creation failed", {
          description: response?.message || "There was an error with your profile.",
        });
      }
    } catch (error) {
      console.error("Failed to handle profile:", error);
      toast.error(hasProfile ? "Profile update failed" : "Profile creation failed", {
        description: "We couldn't process your profile. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 border p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile Information</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isLoading}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  This is how you'll appear to others
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
                      disabled={true}
                      className="pl-10 bg-muted/50"
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  Your account email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                      className="pl-10"
                      type="tel"
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  For account recovery and notifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoreply"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto-Reply</FormLabel>
                  <FormDescription>
                    Automatically respond to emails when you're away
                  </FormDescription>
                  {!assistantTokenSetup && (
                    <p className="text-xs text-amber-500 mt-1">
                      Set up assistant token first to enable auto-reply
                    </p>
                  )}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !assistantTokenSetup}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                {hasProfile ? "Updating profile..." : "Creating profile..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Save className="mr-2 h-4 w-4" />
                {hasProfile ? "Save Profile" : "Create Profile"}
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
