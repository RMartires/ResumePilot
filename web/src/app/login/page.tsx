import { Suspense } from "react";
import { noIndexMetadata } from "@/lib/seo/metadata";
import LoginForm from "./login-form";

export const metadata = noIndexMetadata;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
