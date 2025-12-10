import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  SiPython, SiJavascript, SiOpenjdk, SiC, SiCplusplus, 
  SiHtml5, SiCss3, SiPostgresql, SiReact, SiLeetcode 
} from "react-icons/si";

interface LanguageCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  lessonsCount: number;
  progress?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  SiPython,
  SiJavascript,
  SiOpenjdk,
  SiC,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiPostgresql,
  SiReact,
  SiLeetcode,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function LanguageCard({ 
  id,
  name, 
  description, 
  icon, 
  color, 
  difficulty, 
  lessonsCount,
  progress = 0,
  isFavorite = false,
  onToggleFavorite 
}: LanguageCardProps) {
  const IconComponent = ICON_MAP[icon];

  return (
    <Link href={`/language/${id}`}>
      <Card 
        className="relative overflow-hidden p-4 hover-elevate active-elevate-2 cursor-pointer h-full"
        data-testid={`language-card-${id}`}
      >
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm transition-colors"
            data-testid={`button-favorite-${id}`}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
              )} 
            />
          </button>
        )}

        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {IconComponent ? (
            <IconComponent className="w-6 h-6" style={{ color }} />
          ) : (
            <Star className="w-6 h-6" style={{ color }} />
          )}
        </div>

        <h3 className="font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={cn("text-xs capitalize", DIFFICULTY_COLORS[difficulty])}
          >
            {difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {lessonsCount} lessons
          </span>
        </div>

        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </Card>
    </Link>
  );
}

export function LanguageGrid({ 
  languages, 
  favorites = [],
  onToggleFavorite 
}: { 
  languages: LanguageCardProps[];
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      data-testid="language-grid"
    >
      {languages.map((lang) => (
        <LanguageCard 
          key={lang.id} 
          {...lang}
          isFavorite={favorites.includes(lang.id)}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(lang.id) : undefined}
        />
      ))}
    </div>
  );
}
