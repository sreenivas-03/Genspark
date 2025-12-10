import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { StatsRow } from "@/components/ui/stat-card";
import { QuickActionsGrid } from "@/components/ui/quick-action";
import { LanguageCard } from "@/components/ui/language-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { QUICK_ACTIONS } from "@/lib/constants";
import type { Language } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: languages = [], isLoading: languagesLoading } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user,
  });

  const isLoading = authLoading || languagesLoading;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const trendingLanguages = languages.slice(0, 4);
  const recommendedLanguages = languages.slice(0, 3);

  if (isLoading) {
    return (
      <AppLayout>
        <Header />
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {user?.firstName || "Learner"}
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your coding journey?
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
        </div>

        <StatsRow 
          xp={userStats?.xp || user?.xp || 0} 
          streak={userStats?.streak || user?.streak || 0} 
          badges={userStats?.badgesEarned || 0}
        />

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
          <QuickActionsGrid actions={QUICK_ACTIONS} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Continue Learning</h2>
            <Link href="/explore">
              <Button variant="ghost" size="sm" data-testid="link-see-all-languages">
                See all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {recommendedLanguages.map((lang) => (
                <div key={lang.id} className="w-[200px] flex-shrink-0">
                  <LanguageCard 
                    {...lang} 
                    progress={Math.floor(Math.random() * 60)}
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Trending Languages</h2>
            </div>
            <Link href="/explore">
              <Button variant="ghost" size="sm">
                Explore
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingLanguages.map((lang) => (
              <LanguageCard key={lang.id} {...lang} />
            ))}
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Daily Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Complete today's challenge to earn bonus XP!
              </p>
            </div>
            <Link href="/practice">
              <Button data-testid="button-daily-challenge">
                Start
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
