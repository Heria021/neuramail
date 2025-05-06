"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProfileLayout from "./_components/ProfileLayout";
import ProfileSection from "./_components/ProfileSection";
import RequestTypeSection from "./_components/RequestTypeSection";
import AssistantTokenSection from "./_components/AssistantTokenSection";
import { checkUserProfile } from "@/lib/user/profile";

interface ProfileData {
  profile_name: string;
  profile_email: string;
  auto_reply: boolean;
  assistant_id: string | null;
  assistant_token: string | null;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        router.push("/auth/sign-in");
        return;
      }

      const profileResponse = await checkUserProfile(accessToken);

      if (profileResponse.status === "success") {
        setHasProfile(profileResponse.hasProfile);
        if (profileResponse.hasProfile && profileResponse.profileData) {
          // Cast the profile data to match our interface
          const typedProfileData: ProfileData = {
            profile_name: profileResponse.profileData.profile_name,
            profile_email: profileResponse.profileData.profile_email,
            auto_reply: profileResponse.profileData.auto_reply,
            assistant_id: profileResponse.profileData.assistant_id || null,
            assistant_token: profileResponse.profileData.assistant_token || null,
            phone: profileResponse.profileData.phone
          };
          setProfileData(typedProfileData);
        }
      } else {
        console.error("Error fetching profile:", profileResponse.message);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    try {
      const accessToken = localStorage.getItem("access_token");
      const userEmail = localStorage.getItem("user_email");

      if (!accessToken) {
        // Redirect to sign-in if not authenticated
        router.push("/auth/sign-in");
        return;
      }

      setEmail(userEmail);
      fetchProfileData();
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.push("/auth/sign-in");
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

  // If email is not available, show error
  if (!email) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-red-500 mb-4">Authentication error. Please sign in again.</p>
        <button
          onClick={() => router.push("/auth/sign-in")}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <ProfileLayout
      title="Profile Settings"
      subtitle="Manage your profile information and settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <ProfileSection
            email={email}
            profileData={profileData}
            hasProfile={hasProfile}
            onProfileUpdate={fetchProfileData}
            assistantTokenSetup={!!(profileData?.assistant_token)}
          />
        </div>

        <div className="md:col-span-1 space-y-8">
          <RequestTypeSection
            hasProfile={hasProfile}
            assistantId={profileData?.assistant_id || null}
            onUpdate={fetchProfileData}
          />

          <AssistantTokenSection
            hasProfile={hasProfile}
            assistantId={profileData?.assistant_id || null}
            assistantToken={profileData?.assistant_token || null}
            onUpdate={fetchProfileData}
          />
        </div>
      </div>
    </ProfileLayout>
  );
}
