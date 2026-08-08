import { Flame, Star, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { progressData } from "@/lib/content";
import { cn } from "@/lib/utils";

export function StreakStrip({ className }: { className?: string }) {
  const pct = Math.round((progressData.xp / (progressData.xp + progressData.xpToNext)) * 100);
  return (
    <div className={cn("surface-card p-5", className)}>
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat icon={Flame} value={`${progressData.streak}`} label="day streak" tone="accent" />
        <Stat icon={Star} value={progressData.xp.toLocaleString()} label="XP earned" />
        <Stat icon={Trophy} value={`Lv ${progressData.level}`} label={progressData.levelLabel} />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress to Level {progressData.level + 1}</span>
          <span>{progressData.xpToNext} XP to go</span>
        </div>
        <Progress value={pct} className="mt-2 h-2" aria-label="Level progress" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone = "primary",
}: {
  icon: typeof Flame;
  value: string;
  label: string;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="min-w-0">
      <Icon
        aria-hidden="true"
        className={cn("mx-auto size-5", tone === "accent" ? "text-accent" : "text-primary")}
      />
      <p className="mt-2 truncate text-lg font-semibold">{value}</p>
      <p className="truncate text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
