import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Zap, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  id: string;
  languageId: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  xpReward: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
}

export function LessonCard({ 
  id,
  languageId,
  title, 
  description,
  order,
  duration,
  xpReward,
  isCompleted = false,
  isLocked = false,
  isCurrent = false
}: LessonCardProps) {
  const content = (
    <Card 
      className={cn(
        "relative overflow-hidden p-4 transition-all",
        isLocked 
          ? "opacity-60 cursor-not-allowed" 
          : "hover-elevate active-elevate-2 cursor-pointer",
        isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      data-testid={`lesson-card-${id}`}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
          isCompleted 
            ? "bg-emerald-500 text-white" 
            : isCurrent
              ? "bg-primary text-primary-foreground"
              : isLocked
                ? "bg-muted text-muted-foreground"
                : "bg-muted text-foreground"
        )}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5" />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isCurrent ? (
            <PlayCircle className="w-5 h-5" />
          ) : (
            order
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-1",
            isCompleted ? "text-muted-foreground" : "text-foreground"
          )}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration} min
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-primary" />
              +{xpReward} XP
            </span>
          </div>
        </div>

        {isCompleted && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Done
          </Badge>
        )}
      </div>
    </Card>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/lesson/${languageId}/${id}`}>
      {content}
    </Link>
  );
}

export function LessonList({ 
  lessons,
  languageId,
  completedLessons = []
}: { 
  lessons: LessonCardProps[];
  languageId: string;
  completedLessons?: string[];
}) {
  const firstIncomplete = lessons.find(l => !completedLessons.includes(l.id));

  return (
    <div className="space-y-3" data-testid="lesson-list">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isCurrent = lesson.id === firstIncomplete?.id;
        const isLocked = !isCompleted && !isCurrent && index > 0 && !completedLessons.includes(lessons[index - 1]?.id);
        
        return (
          <LessonCard 
            key={lesson.id}
            {...lesson}
            languageId={languageId}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            isLocked={isLocked}
          />
        );
      })}
    </div>
  );
}
