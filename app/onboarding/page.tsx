// app/onboarding/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { OnboardingForm } from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await axios.get("/api/user/onboarding-status");
        if (response.data.isCompleted) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  return (
    <div className="container mx-auto py-10">
      <OnboardingForm />
    </div>
  );
}
