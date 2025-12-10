import { AppLayout } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ChevronLeft, Moon, Sun, Monitor, Bell, User, 
  Shield, Trash2, LogOut, ChevronRight, HelpCircle,
  FileText, Mail
} from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    achievements: true,
    newLessons: false,
    marketing: false,
  });

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <AppLayout>
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 md:px-6 py-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Appearance</h2>
          <Card className="p-4">
            <Label className="text-base font-medium text-foreground mb-4 block">
              Theme
            </Label>
            <RadioGroup 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              className="grid grid-cols-3 gap-3"
            >
              {themeOptions.map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={`theme-${option.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`theme-${option.value}`}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      theme === option.value 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover-elevate"
                    )}
                    data-testid={`theme-${option.value}`}
                  >
                    <option.icon className={cn(
                      "w-6 h-6",
                      theme === option.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      theme === option.value ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Notifications</h2>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="font-medium text-foreground">Daily Reminder</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to practice</p>
                </div>
              </div>
              <Switch
                checked={notifications.dailyReminder}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, dailyReminder: checked }))
                }
                data-testid="switch-daily-reminder"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Label className="font-medium text-foreground">Achievement Alerts</Label>
                  <p className="text-sm text-muted-foreground">When you earn badges</p>
                </div>
              </div>
              <Switch
                checked={notifications.achievements}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, achievements: checked }))
                }
                data-testid="switch-achievements"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <Label className="font-medium text-foreground">New Lessons</Label>
                  <p className="text-sm text-muted-foreground">When new content is added</p>
                </div>
              </div>
              <Switch
                checked={notifications.newLessons}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newLessons: checked }))
                }
                data-testid="switch-new-lessons"
              />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Account</h2>
          <Card className="divide-y divide-border">
            <Link href="/profile">
              <button className="w-full flex items-center justify-between p-4 hover-elevate text-left" data-testid="link-profile">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Edit Profile</p>
                    <p className="text-sm text-muted-foreground">Update your information</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </Link>

            <button className="w-full flex items-center justify-between p-4 hover-elevate text-left" data-testid="link-privacy">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Privacy & Security</p>
                  <p className="text-sm text-muted-foreground">Manage your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Support</h2>
          <Card className="divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover-elevate text-left" data-testid="link-help">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Help Center</p>
                  <p className="text-sm text-muted-foreground">FAQs and guides</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover-elevate text-left" data-testid="link-contact">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Contact Us</p>
                  <p className="text-sm text-muted-foreground">Get in touch with support</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover-elevate text-left" data-testid="link-terms">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Terms & Privacy</p>
                  <p className="text-sm text-muted-foreground">Legal information</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        <div className="space-y-3">
          <a href="/api/logout" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-start text-foreground"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </a>

          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
            data-testid="button-delete-account"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Genspark v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}
