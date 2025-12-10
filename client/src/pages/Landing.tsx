import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, ChevronLeft, Sparkles, Code, Bot, 
  Trophy, BookOpen, Terminal, Users, Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ONBOARDING_SLIDES = [
  {
    title: "Welcome to Genspark",
    description: "Your AI-powered journey to mastering programming starts here.",
    icon: Sparkles,
    gradient: "from-primary to-secondary",
  },
  {
    title: "150+ Languages",
    description: "Learn Python, JavaScript, Java, C++, and many more with interactive lessons.",
    icon: Code,
    gradient: "from-primary to-blue-600",
  },
  {
    title: "AI Tutor",
    description: "Get instant help, debug code, and understand complex concepts with our AI assistant.",
    icon: Bot,
    gradient: "from-secondary to-purple-600",
  },
  {
    title: "Built-in Compiler",
    description: "Write and run code directly in the app. Practice makes perfect!",
    icon: Terminal,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Track Progress",
    description: "Earn XP, maintain streaks, and unlock achievements as you learn.",
    icon: Trophy,
    gradient: "from-accent to-amber-600",
  },
];

const FEATURES = [
  { icon: BookOpen, title: "Interactive Lessons", description: "Step-by-step tutorials" },
  { icon: Bot, title: "AI Assistant", description: "24/7 code help" },
  { icon: Terminal, title: "Code Editor", description: "Run code instantly" },
  { icon: Trophy, title: "Gamification", description: "XP & achievements" },
];

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className={cn(
                "w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-8",
                "bg-gradient-to-br shadow-2xl shadow-primary/25",
                slide.gradient
              )}
            >
              <Icon className="w-16 h-16 text-white" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {slide.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {slide.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              {ONBOARDING_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentSlide 
                      ? "w-8 bg-primary" 
                      : "bg-muted-foreground/30"
                  )}
                  data-testid={`slide-indicator-${index}`}
                />
              ))}
            </div>
          </div>

          {currentSlide === ONBOARDING_SLIDES.length - 1 ? (
            <div className="space-y-3">
              <a href="/api/login" className="block">
                <Button 
                  className="w-full h-12 text-base font-semibold"
                  data-testid="button-get-started"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setCurrentSlide(ONBOARDING_SLIDES.length - 1)}
                data-testid="button-skip"
              >
                Skip
              </Button>
              <Button
                className="flex-1 h-12"
                onClick={nextSlide}
                data-testid="button-next"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card p-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            Why Genspark?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((feature) => (
              <Card 
                key={feature.title}
                className="p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
