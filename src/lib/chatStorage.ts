import { ChatMessageProps } from "@/components/ChatMessage";

type StorableMessage = Omit<ChatMessageProps, "animationDelay">;

export const saveMessagesToStorage = (messages: StorableMessage[]): void => {
  try {
    localStorage.setItem("chatforce_messages", JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to local storage:", error);
  }
};

export const loadMessagesFromStorage = (): StorableMessage[] => {
  try {
    const savedMessages = localStorage.getItem("chatforce_messages");
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert string timestamps back to Date objects
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading messages from local storage:", error);
  }
  return [];
};

export const clearChatHistory = (): void => {
  try {
    localStorage.removeItem("chatforce_messages");
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
};
