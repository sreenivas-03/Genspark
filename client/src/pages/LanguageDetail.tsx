import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { LessonList } from "@/components/ui/lesson-card";
import { LessonSkeleton } from "@/components/ui/loading-skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Bot, Terminal, Trophy, Heart, 
  Clock, Zap, ChevronLeft, Award 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { Language, Lesson, UserProgress } from "@shared/schema";
import { 
  SiPython, SiJavascript, SiOpenjdk, SiC, SiCplusplus, 
  SiHtml5, SiCss3, SiPostgresql, SiReact, SiLeetcode 
} from "react-icons/si";

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

export default function LanguageDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { data: language, isLoading: langLoading } = useQuery<Language>({
    queryKey: ['/api/languages', id],
    enabled: !!id,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['/api/languages', id, 'lessons'],
    enabled: !!id,
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/progress'],
    enabled: !!user,
  });

  const completedLessons = userProgress
    .filter(p => p.completed && lessons.some(l => l.id === p.lessonId))
    .map(p => p.lessonId);
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  if (langLoading || lessonsLoading) {
    return (
      <AppLayout>
        <Header title="Language" />
        <LessonSkeleton />
      </AppLayout>
    );
  }

  if (!language) {
    return (
      <AppLayout>
        <Header title="Language" />
        <div className="p-4 md:p-6 text-center">
          <p className="text-muted-foreground">Language not found</p>
        </div>
      </AppLayout>
    );
  }

  const IconComponent = ICON_MAP[language.icon || ''];

  return (
    <AppLayout>
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 md:px-6 py-3">
          <Link href="/explore">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{language.name}</h1>
          </div>
          <Button variant="ghost" size="icon" data-testid="button-favorite">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${language.color}20` }}
            >
              {IconComponent ? (
                <IconComponent className="w-8 h-8" style={{ color: language.color }} />
              ) : (
                <BookOpen className="w-8 h-8" style={{ color: language.color }} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{language.name}</h2>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs capitalize", DIFFICULTY_COLORS[language.difficulty])}
                >
                  {language.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground">{language.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold text-foreground">{language.lessonsCount}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
              <p className="text-lg font-semibold text-foreground">{Math.ceil(language.lessonsCount * 15 / 60)}h</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Zap className="w-5 h-5 mx-auto mb-1 text-accent" />
              <p className="text-lg font-semibold text-foreground">{language.lessonsCount * 50}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons" data-testid="tab-lessons">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="compiler" data-testid="tab-compiler">
              <Terminal className="w-4 h-4 mr-2" />
              Compiler
            </TabsTrigger>
            <TabsTrigger value="certificate" data-testid="tab-certificate">
              <Award className="w-4 h-4 mr-2" />
              Certificate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-4">
            {lessons.length > 0 ? (
              <LessonList 
                lessons={lessons.map(l => ({ ...l, languageId: id! }))}
                languageId={id!}
                completedLessons={completedLessons}
              />
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">Lessons Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  We're working on adding lessons for {language.name}. Check back soon!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compiler" className="mt-4">
            <Card className="p-6 text-center">
              <Terminal className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Practice {language.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Open the code editor to practice {language.name} with our built-in compiler.
              </p>
              <Link href="/practice">
                <Button data-testid="button-open-compiler">
                  Open Compiler
                </Button>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="certificate" className="mt-4">
            <Card className="p-6 text-center">
              <div className={cn(
                "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center",
                progress >= 100 
                  ? "bg-gradient-to-br from-accent to-amber-600" 
                  : "bg-muted"
              )}>
                <Award className={cn(
                  "w-8 h-8",
                  progress >= 100 ? "text-white" : "text-muted-foreground"
                )} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {progress >= 100 ? "Certificate Earned!" : "Earn Your Certificate"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {progress >= 100 
                  ? `Congratulations! You've mastered ${language.name}.`
                  : `Complete all lessons to earn your ${language.name} certificate.`
                }
              </p>
              {progress >= 100 ? (
                <Button data-testid="button-download-certificate">
                  Download Certificate
                </Button>
              ) : (
                <Progress value={progress} className="h-2 max-w-xs mx-auto" />
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Need Help?</p>
              <p className="text-sm text-muted-foreground">Ask our AI Tutor</p>
            </div>
          </div>
          <Link href="/ai">
            <Button variant="outline" data-testid="button-ask-ai">
              Ask AI
            </Button>
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
