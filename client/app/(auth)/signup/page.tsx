"use client";
import { SignupForm } from "@/components/signup-form";

export default function Page() {
  return (
    <div className="bg-bg flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm ">
        <SignupForm className="bg-bg text-txt" />
      </div>
    </div>
  );
}
