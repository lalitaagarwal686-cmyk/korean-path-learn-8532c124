import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Korean Bloom AI Korean Tutor" },
      {
        name: "description",
        content:
          "Create your Korean Bloom account to speak Korean with an AI tutor, track XP and streaks, and prepare for TOPIK.",
      },
      { property: "og:title", content: "Sign in — Korean Bloom" },
      {
        property: "og:description",
        content: "Log in to keep your Korean speaking streak, saved words and AI tutor memory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/app/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app/onboarding`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Let's get you speaking Korean.");
        void navigate({ to: "/app/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void navigate({ to: "/app/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/app/dashboard` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary font-kr text-lg font-bold text-primary-foreground">
            한
          </span>
          <span className="font-display text-xl font-semibold">Korean Bloom</span>
        </Link>

        <div className="surface-card p-6">
          <h1 className="font-display text-2xl font-bold">
            {mode === "signup" ? "Start speaking Korean" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Free forever for lessons, vocabulary, grammar and TOPIK practice — plus 1 AI conversation every day."
              : "Sign in to continue your streak."}
          </p>

          <div className="mt-5 grid gap-2">
            <Button variant="outline" onClick={() => void oauth("google")}>
              Continue with Google
            </Button>
            <Button variant="outline" onClick={() => void oauth("apple")}>
              Continue with Apple
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
          </div>

          <form className="grid gap-3" onSubmit={submit}>
            {mode === "signup" ? (
              <div className="grid gap-1.5">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sheetal" />
              </div>
            ) : null}
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="mt-1">
              {mode === "signup" ? "Create free account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already learning with us?" : "New here?"}{" "}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
