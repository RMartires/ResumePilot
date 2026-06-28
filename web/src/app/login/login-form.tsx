"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Sign-in failed. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f6] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue with Google to access your resumes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton redirectTo={redirect} />
          {error ? (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
