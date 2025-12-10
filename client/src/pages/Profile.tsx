import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { StatsRow, StatCard } from "@/components/ui/stat-card";
import { AchievementCard } from "@/components/ui/achievement-badge";
import { LanguageCard } from "@/components/ui/language-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Settings, LogOut, Calendar, Clock, Award, 
  Trophy, BookOpen, Target, ChevronRight, Zap 
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Language, Achievement } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();

  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user,
  });

  const unlockedAchievements = achievements.slice(0, 3).map(a => ({
    ...a,
    isUnlocked: true,
    unlockedAt: new Date(),
  }));

  const lockedAchievements = achievements.slice(3).map(a => ({
    ...a,
    isUnlocked: false,
  }));

  const allAchievements = [...unlockedAchievements, ...lockedAchievements];
  const enrolledLanguages = languages.slice(0, 4);
  const favoriteLanguages = languages.slice(0, 2);

  const weeklyXP = [
    { day: "Mon", xp: 120 },
    { day: "Tue", xp: 85 },
    { day: "Wed", xp: 200 },
    { day: "Thu", xp: 150 },
    { day: "Fri", xp: 95 },
    { day: "Sat", xp: 180 },
    { day: "Sun", xp: user?.xp || 50 },
  ];

  const maxXP = Math.max(...weeklyXP.map(d => d.xp));

  return (
    <AppLayout>
      <Header title="Profile" />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Level {Math.floor((user?.xp || 0) / 500) + 1}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/settings">
                <Button variant="outline" size="icon" data-testid="button-settings">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <a href="/api/logout">
                <Button variant="outline" size="icon" data-testid="button-logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          <StatsRow xp={user?.xp || 0} streak={user?.streak || 0} badges={unlockedAchievements.length} />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Level Progress</span>
              <span className="text-sm text-muted-foreground">
                {(user?.xp || 0) % 500} / 500 XP
              </span>
            </div>
            <Progress value={((user?.xp || 0) % 500) / 5} className="h-2" />
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Weekly Activity</h3>
            <Badge variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              {weeklyXP.reduce((sum, d) => sum + d.xp, 0)} XP this week
            </Badge>
          </div>
          <Card className="p-4">
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyXP.map((day, i) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary transition-all"
                    style={{ height: `${(day.xp / maxXP) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" data-testid="tab-courses">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="favorites" data-testid="tab-favorites">
              <Target className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard type="lessons" value={userStats?.lessonsCompleted || 0} />
              <StatCard type="quizzes" value={userStats?.quizzesCompleted || 0} />
              <StatCard type="challenges" value={userStats?.challengesSolved || 0} />
              <Card className="p-4 flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground">24h</p>
                  <p className="text-xs text-muted-foreground">Learning Time</p>
                </div>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Enrolled Courses</h4>
                <Link href="/explore">
                  <Button variant="ghost" size="sm">
                    See all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {enrolledLanguages.map((lang) => (
                  <LanguageCard 
                    key={lang.id} 
                    {...lang} 
                    progress={Math.floor(Math.random() * 80)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Unlocked ({unlockedAchievements.length})
                </h4>
                <div className="space-y-3">
                  {unlockedAchievements.map((achievement) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement}
                      isUnlocked={true}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Locked ({lockedAchievements.length})
                </h4>
                <div className="space-y-3">
                  {lockedAchievements.map((achievement) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement}
                      isUnlocked={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            {favoriteLanguages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteLanguages.map((lang) => (
                  <LanguageCard key={lang.id} {...lang} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">No favorites yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save your favorite languages for quick access
                </p>
                <Link href="/explore">
                  <Button>Explore Languages</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
