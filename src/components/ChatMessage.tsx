import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
  animationDelay?: number;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp,
  animationDelay = 0,
}) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
        animationDelay ? "opacity-0" : "opacity-100"
      )}
      style={{
        animation: animationDelay
          ? `${
              isUser ? "slide-in-left" : "slide-in-right"
            } 0.3s ease-out forwards ${animationDelay}ms`
          : undefined,
      }}
    >
      <div
        className={cn(
          "flex items-start max-w-[80%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full mt-1",
            isUser ? "bg-chat-user ml-2" : "bg-primary/10 mr-2"
          )}
        >
          {isUser ? (
            <User className="h-5 w-5 text-chat-user-foreground" />
          ) : (
            <Bot className="h-5 w-5 text-primary" />
          )}
        </div>
        <div
          className={cn(
            "py-3 px-4 rounded-2xl shadow-sm",
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-tr-none"
              : "glass-morphism bg-chat-bot text-chat-bot-foreground rounded-tl-none"
          )}
        >
          <div
            className="mb-1 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div
            className={cn(
              "text-xs mt-1",
              isUser
                ? "text-chat-user-foreground/70 text-right"
                : "text-chat-bot-foreground/70"
            )}
          >
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
