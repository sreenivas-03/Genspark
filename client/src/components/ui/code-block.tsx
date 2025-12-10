import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ 
  code, 
  language = "python", 
  showLineNumbers = true,
  className 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className={cn(
      "relative group rounded-lg overflow-hidden",
      "bg-[#1E1E1E] dark:bg-[#1E1E1E]",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#404040]">
        <span className="text-xs font-mono text-[#858585]">{language}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-[#858585] hover:text-white"
          onClick={copyToClipboard}
          data-testid="button-copy-code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-[#F8F8F2]">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="inline-block w-8 text-[#6272A4] text-right mr-4 select-none">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">
                  {highlightSyntax(line, language)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightSyntax(line: string, language: string): React.ReactNode {
  const keywords = {
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'with', 'as', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'lambda', 'pass', 'break', 'continue'],
    javascript: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'class', 'import', 'export', 'from', 'async', 'await', 'true', 'false', 'null', 'undefined', 'new', 'this'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'String', 'boolean', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'new', 'this', 'super'],
  };

  const langKeywords = keywords[language as keyof typeof keywords] || keywords.python;
  
  let result: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  if (remaining.trim().startsWith('#') || remaining.trim().startsWith('//')) {
    return <span key={key} className="text-[#6272A4]">{remaining}</span>;
  }

  const stringMatch = remaining.match(/(['"`])(.*?)\1/g);
  if (stringMatch) {
    stringMatch.forEach((str) => {
      const parts = remaining.split(str);
      if (parts[0]) {
        result.push(<span key={key++}>{highlightKeywords(parts[0], langKeywords)}</span>);
      }
      result.push(<span key={key++} className="text-[#F1FA8C]">{str}</span>);
      remaining = parts.slice(1).join(str);
    });
    if (remaining) {
      result.push(<span key={key++}>{highlightKeywords(remaining, langKeywords)}</span>);
    }
    return result;
  }

  return highlightKeywords(line, langKeywords);
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const words = text.split(/(\s+)/);
  
  words.forEach((word, index) => {
    if (keywords.includes(word)) {
      parts.push(<span key={index} className="text-[#FF79C6]">{word}</span>);
    } else if (/^\d+$/.test(word)) {
      parts.push(<span key={index} className="text-[#BD93F9]">{word}</span>);
    } else if (word.match(/^[a-zA-Z_][a-zA-Z0-9_]*\(/)) {
      const funcName = word.slice(0, -1);
      parts.push(<span key={index}><span className="text-[#50FA7B]">{funcName}</span>(</span>);
    } else {
      parts.push(<span key={index}>{word}</span>);
    }
  });

  return parts;
}
