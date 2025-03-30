import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { useStaggeredChildren } from "@/lib/animations";
import { Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearChatHistory } from "@/lib/chatStorage";
import { toast } from "@/hooks/use-toast";

interface ChatHistoryProps {
  messages: Omit<ChatMessageProps, "animationDelay">[];
  isTyping?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  isTyping = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const delays = useStaggeredChildren(messages.length);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Check if we need to show the scroll to bottom button
  useEffect(() => {
    const checkScrollPosition = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollButton(!isNearBottom && messages.length > 3);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas borrar todo el historial de chat?"
      )
    ) {
      clearChatHistory();
      window.location.reload();
      toast({
        title: "Éxito",
        description: "El historial de chat ha sido borrado",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Chat History Header with Date and Clear button */}
      {messages.length > 0 && (
        <div className="flex justify-between items-center p-2 border-b border-border/30">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Historial de chat</span>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-sm text-muted-foreground hover:text-destructive flex items-center transition-colors"
            title="Borrar historial"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Borrar historial</span>
          </button>
        </div>
      )}

      {/* Messages container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 chat-container scrollbar-thin"
      >
        <div className="flex flex-col min-h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
              <p className="text-center text-lg">Bienvenido a ChatForce</p>
              <p className="text-center text-sm mt-2">
                Tu asistente de ventas está listo para ayudarte con consultas
                sobre cobranzas y pedidos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} animationDelay={0} />
              ))}
            </div>
          )}
          {isTyping && (
            <div className="flex items-center space-x-2 text-muted-foreground ml-10 mb-4">
              <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse-gentle"></div>
              <div
                className="h-2 w-2 bg-primary/60 rounded-full animate-pulse-gentle"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-2 w-2 bg-primary/60 rounded-full animate-pulse-gentle"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <span className="text-xs">ChatForce está escribiendo...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-8 bg-primary text-white p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Scroll to bottom"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatHistory;
