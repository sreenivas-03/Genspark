import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { LanguageGrid } from "@/components/ui/language-card";
import { NoResultsState } from "@/components/ui/empty-state";
import { LanguageListSkeleton } from "@/components/ui/loading-skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Language } from "@shared/schema";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "programming", label: "Programming" },
  { id: "web", label: "Web" },
  { id: "database", label: "Database" },
  { id: "dsa", label: "DSA" },
];

const DIFFICULTIES = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: languages = [], isLoading } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) => {
      const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || lang.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || lang.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [languages, searchQuery, selectedCategory, selectedDifficulty]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Explore" />
        <LanguageListSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Explore" />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
            data-testid="input-search-languages"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer whitespace-nowrap px-4 py-1.5",
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover-elevate"
                )}
                onClick={() => setSelectedCategory(cat.id)}
                data-testid={`filter-category-${cat.id}`}
              >
                {cat.label}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {DIFFICULTIES.map((diff) => (
              <Badge
                key={diff.id}
                variant="outline"
                className={cn(
                  "cursor-pointer whitespace-nowrap px-3 py-1",
                  selectedDifficulty === diff.id 
                    ? "border-primary text-primary bg-primary/10" 
                    : ""
                )}
                onClick={() => setSelectedDifficulty(diff.id)}
                data-testid={`filter-difficulty-${diff.id}`}
              >
                {diff.label}
              </Badge>
            ))}
          </div>
        </div>

        {favorites.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Favorites</h2>
            <LanguageGrid 
              languages={filteredLanguages.filter(l => favorites.includes(l.id))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategory === "all" ? "All Languages" : CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredLanguages.length} results
            </span>
          </div>

          {filteredLanguages.length > 0 ? (
            <LanguageGrid 
              languages={filteredLanguages}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <NoResultsState query={searchQuery} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
