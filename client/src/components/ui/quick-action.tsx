import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Bot, Terminal, Trophy, LucideIcon } from "lucide-react";

interface QuickActionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Bot,
  Terminal,
  Trophy,
};

const COLOR_MAP: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent-foreground",
  success: "bg-emerald-500/10 text-emerald-500",
};

export function QuickAction({ title, description, icon, color, path }: QuickActionProps) {
  const Icon = ICON_MAP[icon] || BookOpen;
  const colorClasses = COLOR_MAP[color] || COLOR_MAP.primary;

  return (
    <Link href={path}>
      <Card 
        className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-transform"
        data-testid={`quick-action-${title.toLowerCase().replace(' ', '-')}`}
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
          colorClasses
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </Card>
    </Link>
  );
}

export function QuickActionsGrid({ actions }: { actions: QuickActionProps[] }) {
  return (
    <div className="grid grid-cols-2 gap-3" data-testid="quick-actions-grid">
      {actions.map((action) => (
        <QuickAction key={action.id} {...action} />
      ))}
    </div>
  );
}
