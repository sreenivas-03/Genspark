import { Moon, Sun, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="md:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button 
            size="icon" 
            variant="ghost"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Link href="/settings">
            <Button 
              size="icon" 
              variant="ghost"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </Link>

          {user && (
            <Link href="/profile">
              <Avatar className="w-9 h-9 cursor-pointer" data-testid="avatar-user">
                <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
