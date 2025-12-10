import { useLocation, Link } from "wouter";
import { Home, Compass, Bot, Code, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/ai", label: "AI", icon: Bot },
  { path: "/practice", label: "Practice", icon: Code },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-card-border md:hidden"
      data-testid="nav-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside 
      className="hidden md:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0"
      data-testid="nav-sidebar"
    >
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-bold text-lg">G</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-sidebar-foreground">Genspark</h1>
          <p className="text-xs text-muted-foreground">Learn to Code</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                    : "text-muted-foreground hover-elevate"
                )}
                data-testid={`sidebar-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
          <p className="text-sm font-medium text-foreground">Pro Tip</p>
          <p className="text-xs text-muted-foreground mt-1">
            Practice daily to maintain your streak!
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "min-h-screen transition-all",
        isMobile ? "pb-20" : "md:ml-64"
      )}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
