import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/Navigation";
import { Header } from "@/components/layout/Header";
import { CodeBlock } from "@/components/ui/code-block";
import { NoMessagesState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, Bot, Sparkles, Code, Lightbulb, 
  Bug, BookOpen, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  { icon: Code, label: "Explain a concept", prompt: "Can you explain how recursion works?" },
  { icon: Bug, label: "Debug my code", prompt: "I have an error in my code. Can you help me debug it?" },
  { icon: Lightbulb, label: "Best practices", prompt: "What are some best practices for writing clean code?" },
  { icon: BookOpen, label: "Learning path", prompt: "What should I learn after Python basics?" },
];

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input.trim());
    setInput("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        );
      }
      parts.push(
        <CodeBlock 
          key={match.index} 
          code={match[2].trim()} 
          language={match[1] || "python"} 
          className="my-3"
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <AppLayout>
      <Header title="AI Tutor" />
      <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-80px)]">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Hi, I'm your AI Tutor!
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    I can help you understand programming concepts, debug code, 
                    and answer any questions about your learning journey.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <Card 
                      key={chip.label}
                      className="p-3 hover-elevate cursor-pointer"
                      onClick={() => handleSuggestion(chip.prompt)}
                      data-testid={`suggestion-${chip.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <chip.icon className="w-4 h-4 text-secondary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {chip.label}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                  data-testid={`message-${message.role}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-purple-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card border border-card-border"
                  )}>
                    <div className={cn(
                      "text-sm whitespace-pre-wrap",
                      message.role === "assistant" && "text-foreground"
                    )}>
                      {message.role === "assistant" 
                        ? renderMessageContent(message.content)
                        : message.content
                      }
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {sendMessageMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-purple-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border border-card-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about programming..."
                  className="min-h-[44px] max-h-[120px] resize-none pr-12"
                  rows={1}
                  data-testid="input-chat"
                />
              </div>
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || sendMessageMutation.isPending}
                className="h-11 w-11"
                size="icon"
                data-testid="button-send"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
