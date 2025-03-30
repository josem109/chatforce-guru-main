
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative neo-blur rounded-xl p-1 shadow-sm mt-4 transition-all duration-200 animate-slide-in-bottom"
    >
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder="Escribe tu consulta aquí..."
          className={cn(
            "resize-none max-h-[150px] min-h-[50px] py-3 px-4 pr-12 w-full bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground text-foreground",
            isTyping && "opacity-70"
          )}
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className={cn(
            "absolute bottom-3 right-3 p-2 rounded-lg",
            message.trim() && !isTyping ? 
              "bg-primary text-primary-foreground" : 
              "bg-muted text-muted-foreground cursor-not-allowed",
            "transition-all duration-200 transform hover:scale-105"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
