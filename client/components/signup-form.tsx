"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiFetch<unknown>("/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        } satisfies SignupPayload),
      });

      router.replace("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="flex flex-col items-center">
        <h1 className="text-prime font-extrabold text-xl">Portifi AI</h1>
        <CardTitle>Create your Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Field>
              <Button
                className="bg-prime hover:bg-prime/85 w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
