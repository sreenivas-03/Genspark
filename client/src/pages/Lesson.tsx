import { useState } from "react";
import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/Navigation";
import { CodeBlock } from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, ChevronRight, CheckCircle, Bot, 
  Terminal, BookOpen, Clock, Zap, List 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_LESSONS, SAMPLE_LESSON_CONTENT, LANGUAGES } from "@/lib/constants";

const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "getting-started", title: "Getting Started" },
  { id: "variables", title: "Variables" },
  { id: "practice", title: "Practice" },
];

export default function Lesson() {
  const { languageId, lessonId } = useParams<{ languageId: string; lessonId: string }>();
  const [currentSection, setCurrentSection] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [completed, setCompleted] = useState(false);

  const language = LANGUAGES.find(l => l.id === languageId);
  const lessons = SAMPLE_LESSONS[languageId as keyof typeof SAMPLE_LESSONS] || [];
  const lesson = lessons.find(l => l.id === lessonId);
  const currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
  const nextLesson = lessons[currentLessonIndex + 1];
  const prevLesson = lessons[currentLessonIndex - 1];

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  if (!lesson || !language) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 text-center">
          <p className="text-muted-foreground">Lesson not found</p>
          <Link href={`/language/${languageId}`}>
            <Button className="mt-4">Go Back</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 md:px-6 py-3">
          <Link href={`/language/${languageId}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate">{lesson.title}</h1>
            <p className="text-xs text-muted-foreground">{language.name}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowNav(!showNav)}
            data-testid="button-toggle-nav"
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
        <div className="px-4 md:px-6 pb-3">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="flex flex-1">
        {showNav && (
          <aside className="w-64 border-r border-border bg-card hidden md:block">
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground mb-3">Sections</h3>
                {SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      index === currentSection 
                        ? "bg-primary/10 text-primary" 
                        : index < currentSection
                          ? "text-muted-foreground"
                          : "text-foreground hover-elevate"
                    )}
                    data-testid={`section-${section.id}`}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      index < currentSection 
                        ? "bg-emerald-500 text-white" 
                        : index === currentSection
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    )}>
                      {index < currentSection ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="p-4 md:p-8 max-w-3xl mx-auto">
              {!completed ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {lesson.duration} min
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Zap className="w-3 h-3 mr-1" />
                      +{lesson.xpReward} XP
                    </Badge>
                  </div>

                  <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h1>{lesson.title}</h1>
                    <p className="lead">{lesson.description}</p>
                    
                    <h2>Introduction to {language.name}</h2>
                    <p>
                      {language.name} is a powerful programming language that is perfect for 
                      {language.difficulty === "beginner" ? " beginners" : " experienced developers"}.
                    </p>

                    <h3>Your First Program</h3>
                    <p>Let's write our first {language.name} program:</p>
                    
                    <CodeBlock 
                      code={languageId === "python" 
                        ? `# This is a comment\nprint("Hello, World!")`
                        : languageId === "javascript"
                          ? `// This is a comment\nconsole.log("Hello, World!");`
                          : `// Hello World in ${language.name}\nprint("Hello, World!");`
                      }
                      language={languageId || "python"}
                    />

                    <p>
                      This simple program outputs "Hello, World!" to the console. 
                      Let's break down what's happening:
                    </p>

                    <ul>
                      <li>The first line is a comment - it's ignored by the computer</li>
                      <li>The second line prints text to the screen</li>
                    </ul>

                    <h3>Variables</h3>
                    <p>Variables are used to store data. Here's how to create them:</p>

                    <CodeBlock 
                      code={languageId === "python" 
                        ? `# String variable\nname = "Alice"\n\n# Integer variable\nage = 25\n\n# Print variables\nprint(f"Hello, {name}! You are {age} years old.")`
                        : `// String variable\nlet name = "Alice";\n\n// Integer variable\nlet age = 25;\n\n// Print variables\nconsole.log(\`Hello, \${name}! You are \${age} years old.\`);`
                      }
                      language={languageId || "python"}
                    />

                    <h3>Practice Time!</h3>
                    <p>
                      Now it's your turn! Try modifying the code above to print your own name.
                    </p>
                  </article>
                </>
              ) : (
                <Card className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Lesson Complete!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Great job! You've earned {lesson.xpReward} XP.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {nextLesson ? (
                      <Link href={`/lesson/${languageId}/${nextLesson.id}`}>
                        <Button data-testid="button-next-lesson">
                          Next Lesson
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/language/${languageId}`}>
                        <Button data-testid="button-back-to-language">
                          Back to Course
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      {!completed && (
        <div className="sticky bottom-0 bg-background border-t border-border p-4 md:hidden">
          <div className="flex items-center gap-3">
            <Link href="/practice" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-practice">
                <Terminal className="w-4 h-4 mr-2" />
                Practice
              </Button>
            </Link>
            {currentSection < SECTIONS.length - 1 ? (
              <Button 
                className="flex-1" 
                onClick={() => setCurrentSection(s => s + 1)}
                data-testid="button-next-section"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                className="flex-1" 
                onClick={handleComplete}
                data-testid="button-complete"
              >
                Complete
                <CheckCircle className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="hidden md:flex sticky bottom-0 bg-background border-t border-border p-4 justify-center gap-3">
        <Link href="/ai">
          <Button variant="outline" data-testid="button-ask-ai">
            <Bot className="w-4 h-4 mr-2" />
            Ask AI
          </Button>
        </Link>
        <Link href="/practice">
          <Button variant="outline" data-testid="button-practice-desktop">
            <Terminal className="w-4 h-4 mr-2" />
            Practice
          </Button>
        </Link>
        {currentSection < SECTIONS.length - 1 ? (
          <Button 
            onClick={() => setCurrentSection(s => s + 1)}
            data-testid="button-next-section-desktop"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            data-testid="button-complete-desktop"
          >
            Complete Lesson
            <CheckCircle className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
