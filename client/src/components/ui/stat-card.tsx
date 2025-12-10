import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame, Zap, Trophy, Star, Target, BookOpen } from "lucide-react";

interface StatCardProps {
  type: "xp" | "streak" | "badges" | "lessons" | "challenges" | "quizzes";
  value: number;
  label?: string;
  className?: string;
}

const STAT_CONFIG = {
  xp: {
    icon: Zap,
    label: "XP",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  streak: {
    icon: Flame,
    label: "Day Streak",
    gradient: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-500",
  },
  badges: {
    icon: Trophy,
    label: "Badges",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  lessons: {
    icon: BookOpen,
    label: "Lessons",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  challenges: {
    icon: Target,
    label: "Challenges",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  quizzes: {
    icon: Star,
    label: "Quizzes",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
};

export function StatCard({ type, value, label, className }: StatCardProps) {
  const config = STAT_CONFIG[type];
  const Icon = config.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden p-4",
        "bg-gradient-to-br",
        config.gradient,
        className
      )}
      data-testid={`stat-card-${type}`}
    >
      <div className="flex flex-col">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
          "bg-background/50"
        )}>
          <Icon className={cn("w-4 h-4", config.iconColor)} />
        </div>
        <span className="text-2xl font-bold text-foreground">
          {value.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">
          {label || config.label}
        </span>
      </div>
    </Card>
  );
}

export function StatsRow({ 
  xp, 
  streak, 
  badges 
}: { 
  xp: number; 
  streak: number; 
  badges: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3" data-testid="stats-row">
      <StatCard type="xp" value={xp} />
      <StatCard type="streak" value={streak} />
      <StatCard type="badges" value={badges} />
    </div>
  );
}
