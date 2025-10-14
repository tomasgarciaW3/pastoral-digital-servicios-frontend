import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! ¿En qué puedo ayudarte hoy? Por ejemplo, podés preguntarme: '¿Dónde hay misa cerca mío hoy?'",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simple mock response
    setTimeout(() => {
      const response = generateMockResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);

    setInput("");
  };

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("misa") || lowerQuery.includes("mass")) {
      return "Encontré varias parroquias con misa cerca tuyo:\n\n• Parroquia San José (CABA) - Dom 9:00, 11:00, 19:00\n• Parroquia Santo Domingo (San Telmo) - Dom 10:00, 12:00, 18:00\n\n¿Te gustaría ver más detalles?";
    }
    
    if (lowerQuery.includes("bautismo") || lowerQuery.includes("baptism")) {
      return "Las siguientes parroquias ofrecen bautismos:\n\n• Parroquia San José - Sáb 10:00, 11:30\n• Parroquia Santa María - Dom 12:00\n\nPodés agendar directamente desde el mapa.";
    }
    
    if (lowerQuery.includes("cerca") || lowerQuery.includes("near")) {
      return "Para buscar parroquias cerca tuyo, hacé clic en el botón 'Cerca mío' en los filtros. Te mostraré las más cercanas a tu ubicación.";
    }
    
    return "Entiendo tu consulta. Podés usar los filtros en la parte superior para buscar servicios específicos, o hacer clic en cualquier marcador del mapa para ver los detalles de cada parroquia.";
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
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribí tu pregunta..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
