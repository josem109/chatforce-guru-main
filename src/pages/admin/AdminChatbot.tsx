import React, { useState, useCallback } from "react";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { ChatInput } from "@/components/chat/ChatInput";
import { PaymentReviewModal } from "@/components/admin-chat/modals/PaymentReviewModal";
import { adminBotCommands } from "@/lib/admin/adminBotCommands";

const AdminChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  const handleSendMessage = useCallback(async (content: string) => {
    // Lógica para procesar mensajes y comandos
    // Similar a la del chatbot principal pero usando adminBotCommands
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ChatHistory messages={messages} isTyping={isTyping} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />

      <PaymentReviewModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        payments={pendingPayments}
        onApprove={(paymentId) => {
          // Lógica para aprobar pago
        }}
        onReject={(paymentId, reason) => {
          // Lógica para rechazar pago
        }}
      />
    </div>
  );
};

export default AdminChatbot;
