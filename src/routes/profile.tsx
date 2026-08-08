import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/Reveal";
import { progressData } from "@/lib/content";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Study Settings | Hanji Korean" },
      {
        name: "description",
        content:
          "Manage your Korean study goal, daily reminder time, translation language and audio preferences.",
      },
      { property: "og:title", content: "Profile & Study Settings | Hanji Korean" },
      {
        property: "og:description",
        content: "Set your daily Korean goal, reminders, translation language and audio options.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [goal, setGoal] = useState("20");
  const [language, setLanguage] = useState("both");
  const [romanization, setRomanization] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="container-page py-8 sm:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary font-kr text-xl font-semibold text-primary-foreground">
            아
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">Ananya Iyer</h1>
            <p className="truncate text-sm text-muted-foreground">
              Level {progressData.level} · {progressData.levelLabel}
            </p>
          </div>
        </div>
        <Badge className="shrink-0">{progressData.streak}-day streak</Badge>
      </header>

      <form
        className="mt-10 grid gap-5 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved", { description: "Your study plan has been updated." });
        }}
      >
        <Reveal className="surface-card p-6">
          <h2 className="text-lg font-semibold">Study plan</h2>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="goal">Daily goal (minutes)</Label>
              <Input
                id="goal"
                type="number"
                min={5}
                max={180}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target">Target exam</Label>
              <Select defaultValue="topik2">
                <SelectTrigger id="target" className="h-11">
                  <SelectValue placeholder="Choose a target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No exam — conversation only</SelectItem>
                  <SelectItem value="topik1">TOPIK I</SelectItem>
                  <SelectItem value="topik2">TOPIK II</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reminder-time">Reminder time</Label>
              <Input id="reminder-time" type="time" defaultValue="07:30" className="h-11" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="surface-card p-6">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="lang">Translation language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="lang" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English only</SelectItem>
                  <SelectItem value="hi">Hindi only</SelectItem>
                  <SelectItem value="both">English + Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ToggleRow
              id="romanization"
              label="Show romanization"
              hint="Hide it once you can read Hangul comfortably."
              checked={romanization}
              onChange={setRomanization}
            />
            <ToggleRow
              id="reminders"
              label="Streak reminders"
              hint="One gentle nudge if you have not studied by evening."
              checked={reminders}
              onChange={setReminders}
            />
          </div>
        </Reveal>

        <div className="lg:col-span-2">
          <Button type="submit" className="min-h-11 w-full sm:w-auto">
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border p-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="shrink-0" />
    </div>
  );
}
