import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Only initialize if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  context?: string
): Promise<string> {
  if (!openai) {
    return "I apologize, but the AI tutor is not configured yet. Please add your OpenAI API key to enable this feature.";
  }

  const systemPrompt = `You are Genspark AI Tutor, a friendly and knowledgeable programming assistant. You help users learn programming concepts, debug code, and answer questions about various programming languages.

Your key traits:
- Patient and encouraging with beginners
- Provide clear, concise explanations
- Use code examples when helpful
- Break down complex concepts into simple steps
- Offer practical tips and best practices

${context ? `Additional context: ${context}` : ""}

When providing code examples, always wrap them in markdown code blocks with the language specified.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_completion_tokens: 2048,
  });

  return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
}

export async function explainCode(code: string, language: string): Promise<string> {
  if (!openai) {
    return "AI features are not available. Please configure your OpenAI API key.";
  }
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a programming tutor. Explain the given code in a clear, beginner-friendly way. Break down what each part does and why it's important.",
      },
      {
        role: "user",
        content: `Please explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
    max_completion_tokens: 1024,
  });

  return response.choices[0].message.content || "I couldn't explain this code.";
}

export async function debugCode(code: string, language: string, error?: string): Promise<string> {
  if (!openai) {
    return "AI features are not available. Please configure your OpenAI API key.";
  }
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a debugging expert. Help identify issues in the code and provide fixes with explanations.",
      },
      {
        role: "user",
        content: `Help me debug this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`${error ? `\n\nError message: ${error}` : ""}`,
      },
    ],
    max_completion_tokens: 1024,
  });

  return response.choices[0].message.content || "I couldn't analyze this code.";
}

export async function generateHint(problem: string, currentCode?: string): Promise<string> {
  if (!openai) {
    return "AI features are not available. Please configure your OpenAI API key.";
  }
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a helpful tutor. Provide a hint without giving away the complete solution. Guide the student towards figuring it out themselves.",
      },
      {
        role: "user",
        content: `Problem: ${problem}${currentCode ? `\n\nMy current code:\n\`\`\`\n${currentCode}\n\`\`\`` : ""}\n\nCan you give me a hint?`,
      },
    ],
    max_completion_tokens: 512,
  });

  return response.choices[0].message.content || "Try breaking down the problem into smaller steps.";
}
