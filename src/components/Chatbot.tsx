import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL || "https://api-production-52ad.up.railway.app/v1";
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

interface ChatbotProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Chatbot = ({ isOpen: externalIsOpen, onOpenChange }: ChatbotProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! ¿En qué puedo ayudarte hoy? Por ejemplo, podés preguntarme: '¿Dónde hay misa cerca mío hoy?'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {},
          query: input,
          response_mode: "streaming",
          conversation_id: conversationId,
          user: "user-" + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let newConversationId = conversationId;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:"));

          for (const line of lines) {
            try {
              const jsonStr = line.replace(/^data:\s*/, "");
              const data = JSON.parse(jsonStr);

              if (data.event === "message") {
                assistantMessage += data.answer || "";
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];

                  if (lastMessage.role === "assistant" && lastMessage.content.startsWith(assistantMessage.substring(0, 20))) {
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    };
                  } else {
                    newMessages.push({
                      role: "assistant",
                      content: assistantMessage,
                    });
                  }

                  return newMessages;
                });
              } else if (data.event === "message_end") {
                if (data.conversation_id) {
                  newConversationId = data.conversation_id;
                }
              }
            } catch (e) {
              // Skip invalid JSON lines
              console.warn("Failed to parse SSE line:", line);
            }
          }
        }
      }

      if (newConversationId !== conversationId) {
        setConversationId(newConversationId);
      }

    } catch (error) {
      console.error("Error calling Dify API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intentá nuevamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-elevated bg-primary hover:bg-primary/90 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-elevated z-50 animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Asistente Virtual</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-8"
                  : "bg-secondary text-secondary-foreground mr-8"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Escribiendo...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Escribí tu pregunta..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
