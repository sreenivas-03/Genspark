import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  BookOpen, Search, MessageSquare, Code, Trophy, 
  AlertCircle, Wifi, LucideIcon 
} from "lucide-react";

interface EmptyStateProps {
  type?: "no-data" | "no-results" | "error" | "offline";
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  "no-data": BookOpen,
  "no-results": Search,
  "error": AlertCircle,
  "offline": Wifi,
};

export function EmptyState({ 
  type = "no-data",
  icon,
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  const Icon = icon || DEFAULT_ICONS[type];

  return (
    <Card 
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
      data-testid="empty-state"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} data-testid="button-empty-action">
          {action.label}
        </Button>
      )}
    </Card>
  );
}

export function NoLessonsState() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No lessons yet"
      description="Start learning by selecting a programming language from the Explore section."
    />
  );
}

export function NoResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      type="no-results"
      title="No results found"
      description={query ? `We couldn't find anything for "${query}". Try a different search term.` : "Try adjusting your filters or search terms."}
    />
  );
}

export function NoMessagesState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Start a conversation"
      description="Ask me anything about programming! I can help you understand concepts, debug code, or explain algorithms."
    />
  );
}

export function NoChallengesState() {
  return (
    <EmptyState
      icon={Code}
      title="No challenges yet"
      description="Complete some lessons first to unlock coding challenges."
    />
  );
}

export function NoAchievementsState() {
  return (
    <EmptyState
      icon={Trophy}
      title="No achievements yet"
      description="Keep learning and practicing to earn your first badge!"
    />
  );
}

export function ErrorState({ 
  message = "Something went wrong", 
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      type="error"
      title="Oops!"
      description={message}
      action={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
    />
  );
}

export function OfflineState() {
  return (
    <EmptyState
      type="offline"
      title="You're offline"
      description="Check your internet connection and try again."
      action={{ label: "Retry", onClick: () => window.location.reload() }}
    />
  );
}
