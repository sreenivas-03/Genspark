import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Trophy, Flame, Star, CheckCircle, Code, Award, 
  Target, Zap, BookOpen, LucideIcon 
} from "lucide-react";

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked?: boolean;
  unlockedAt?: Date;
  size?: "sm" | "md" | "lg";
}

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Flame,
  Star,
  CheckCircle,
  Code,
  Award,
  Target,
  Zap,
  BookOpen,
};

export function AchievementBadge({ 
  id,
  name, 
  description,
  icon,
  isUnlocked = false,
  size = "md"
}: AchievementBadgeProps) {
  const Icon = ICON_MAP[icon] || Trophy;
  
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  return (
    <div 
      className="flex flex-col items-center text-center"
      data-testid={`achievement-${id}`}
    >
      <div className={cn(
        "relative rounded-2xl flex items-center justify-center mb-2",
        sizeClasses[size],
        isUnlocked 
          ? "bg-gradient-to-br from-accent to-amber-600 shadow-lg shadow-accent/25" 
          : "bg-muted"
      )}>
        <Icon className={cn(
          iconSizes[size],
          isUnlocked ? "text-white" : "text-muted-foreground"
        )} />
        {!isUnlocked && (
          <div className="absolute inset-0 bg-background/50 rounded-2xl flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
          </div>
        )}
      </div>
      <h4 className={cn(
        "text-sm font-medium",
        isUnlocked ? "text-foreground" : "text-muted-foreground"
      )}>
        {name}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-2 max-w-[100px]">
        {description}
      </p>
    </div>
  );
}

export function AchievementsGrid({ 
  achievements 
}: { 
  achievements: AchievementBadgeProps[];
}) {
  return (
    <div 
      className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      data-testid="achievements-grid"
    >
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.id} {...achievement} />
      ))}
    </div>
  );
}

export function AchievementCard({ 
  achievement,
  isUnlocked = false
}: { 
  achievement: AchievementBadgeProps;
  isUnlocked?: boolean;
}) {
  const Icon = ICON_MAP[achievement.icon] || Trophy;

  return (
    <Card 
      className={cn(
        "p-4 flex items-center gap-4",
        !isUnlocked && "opacity-60"
      )}
      data-testid={`achievement-card-${achievement.id}`}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        isUnlocked 
          ? "bg-gradient-to-br from-accent to-amber-600" 
          : "bg-muted"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          isUnlocked ? "text-white" : "text-muted-foreground"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground">{achievement.name}</h4>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
      {isUnlocked && (
        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      )}
    </Card>
  );
}
