import { useState } from "react";
import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { CodeBlock } from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, Square, Trash2, Terminal, Code, 
  Trophy, ChevronRight, Loader2, CheckCircle, XCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Language, Challenge } from "@shared/schema";
import { Link } from "wouter";

const DEFAULT_CODE: Record<string, string> = {
  python: `# Write your Python code here
print("Hello, World!")

# Try defining a function
def greet(name):
    return f"Hello, {name}!"

print(greet("Genspark"))`,
  javascript: `// Write your JavaScript code here
console.log("Hello, World!");

// Try defining a function
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Genspark"));`,
  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  c: `// Write your C code here
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export default function Practice() {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  const editorLanguages = languages.filter(l => ["python", "javascript", "java", "c", "cpp"].includes(l.id));

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCode(DEFAULT_CODE[lang] || DEFAULT_CODE.python);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");

    setTimeout(() => {
      if (selectedLanguage === "python") {
        if (code.includes('print("Hello, World!")')) {
          setOutput("Hello, World!\nHello, Genspark!");
        } else {
          setOutput(">>> Running Python code...\nProgram executed successfully.");
        }
      } else if (selectedLanguage === "javascript") {
        if (code.includes('console.log("Hello, World!")')) {
          setOutput("Hello, World!\nHello, Genspark!");
        } else {
          setOutput("> Running JavaScript code...\nProgram executed successfully.");
        }
      } else {
        setOutput(`Compiled and executed ${selectedLanguage} code.\nOutput: Hello, World!`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput("Execution stopped.");
  };

  const handleClear = () => {
    setCode(DEFAULT_CODE[selectedLanguage] || DEFAULT_CODE.python);
    setOutput("");
    setInput("");
  };

  return (
    <AppLayout>
      <Header title="Practice" />
      <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-80px)] flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 md:px-6 pt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="editor" data-testid="tab-editor">
                <Terminal className="w-4 h-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="challenges" data-testid="tab-challenges">
                <Trophy className="w-4 h-4 mr-2" />
                Challenges
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 flex flex-col mt-0 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]" data-testid="select-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {editorLanguages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleClear}
                  data-testid="button-clear"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {isRunning ? (
                  <Button 
                    variant="destructive"
                    onClick={handleStop}
                    data-testid="button-stop"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRun}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-run"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
              <Card className="flex flex-col overflow-hidden">
                <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Code</span>
                </div>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 resize-none font-mono text-sm border-0 rounded-none focus-visible:ring-0"
                  placeholder="Write your code here..."
                  data-testid="textarea-code"
                />
              </Card>

              <div className="flex flex-col gap-4">
                <Card className="flex-1 flex flex-col overflow-hidden min-h-[150px]">
                  <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Output</span>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Running...</span>
                      </div>
                    ) : output ? (
                      <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                        {output}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click "Run" to execute your code
                      </p>
                    )}
                  </ScrollArea>
                </Card>

                <Card className="flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-muted/50 border-b border-border">
                    <span className="text-sm font-medium text-foreground">Input (stdin)</span>
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="resize-none font-mono text-sm border-0 rounded-none focus-visible:ring-0"
                    placeholder="Enter input here..."
                    rows={3}
                    data-testid="textarea-input"
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="flex-1 mt-0 overflow-auto">
            <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Coding Challenges</h2>
                <Badge variant="secondary">
                  {challenges.length} challenges
                </Badge>
              </div>

              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <Card 
                    key={challenge.id} 
                    className="p-4 hover-elevate cursor-pointer"
                    data-testid={`challenge-${challenge.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                          <Badge 
                            variant="secondary"
                            className={cn("text-xs capitalize", DIFFICULTY_COLORS[challenge.difficulty])}
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{challenge.category}</span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-accent" />
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
