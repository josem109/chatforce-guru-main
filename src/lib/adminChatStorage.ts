import { ChatMessageProps } from "@/components/ChatMessage";

type StorableMessage = Omit<ChatMessageProps, "animationDelay">;

export const saveAdminMessagesToStorage = (
  messages: StorableMessage[]
): void => {
  try {
    localStorage.setItem("chatforce_admin_messages", JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving admin messages to local storage:", error);
  }
};

export const loadAdminMessagesFromStorage = (): StorableMessage[] => {
  try {
    const savedMessages = localStorage.getItem("chatforce_admin_messages");
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert string timestamps back to Date objects
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading admin messages from local storage:", error);
  }
  return [];
};

export const clearAdminChatHistory = (): void => {
  try {
    localStorage.removeItem("chatforce_admin_messages");
  } catch (error) {
    console.error("Error clearing admin chat history:", error);
  }
};
