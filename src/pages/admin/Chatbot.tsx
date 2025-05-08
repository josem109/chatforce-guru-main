import React, { useState, useRef, useEffect } from "react";
import { Send, Clock, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ChatMessage from "@/components/ChatMessage";
import AdminSampleQueries from "@/components/admin/AdminSampleQueries";
import AccountStatusGrid from "@/components/admin/AccountStatusGrid";
import { PaymentReviewWizard } from "@/components/admin/payment-review/PaymentReviewWizard";
import { toast } from "@/hooks/use-toast";
import {
  saveAdminMessagesToStorage,
  loadAdminMessagesFromStorage,
  clearAdminChatHistory,
} from "@/lib/adminChatStorage";
import {
  mockPendingPayments,
  type PendingPayment,
  mockClientsAccounts,
  type ClientAccount,
} from "@/lib/mockData";
import { generateAccountStatementPDF } from "@/lib/admin/accountStatementPDF";
import {
  CobranzaLineChart,
  CobranzaDia,
} from "@/components/admin/CobranzaLineChart";
import {
  ClientesDeudaParetoChart,
  ClienteDeuda,
} from "@/components/admin/ClientesDeudaParetoChart";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?:
    | "text"
    | "account-status"
    | "account-statement"
    | "help-commands"
    | "cobranza-line-chart"
    | "clientes-deuda-pareto";
  data?: any;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy el asistente administrativo de ChatForce. ¿En qué puedo ayudarte?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPaymentReviewOpen, setIsPaymentReviewOpen] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [showPaymentWizard, setShowPaymentWizard] = useState(false);
  const [showHelpCommands, setShowHelpCommands] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Limpiar el input
    setInputMessage("");

    // Mostrar comandos si el admin escribe 'ayuda'
    if (content.trim().toLowerCase() === "ayuda") {
      setShowHelpCommands(true);
      const helpMessage: Message = {
        id: Date.now().toString(),
        content:
          "🆘 Aquí tienes los comandos disponibles. Haz clic en cualquiera para ejecutarlo:",
        isUser: false,
        timestamp: new Date(),
        type: "help-commands",
      };
      setMessages((prev) => [...prev, helpMessage]);
      return;
    } else {
      setShowHelpCommands(false);
    }

    // Comando de reporte de cobranza
    if (
      content.trim().toLowerCase() === "generar reporte de cobranzas del mes"
    ) {
      // Datos mock de cobranza diaria
      const cobranzaMock: CobranzaDia[] = [
        { dia: "01 Jun", monto: 200 },
        { dia: "02 Jun", monto: 350 },
        { dia: "03 Jun", monto: 500 },
        { dia: "04 Jun", monto: 700 },
        { dia: "05 Jun", monto: 900 },
        { dia: "06 Jun", monto: 1200 },
        { dia: "07 Jun", monto: 1500 },
        { dia: "08 Jun", monto: 1700 },
        { dia: "09 Jun", monto: 2000 },
        { dia: "10 Jun", monto: 2200 },
        { dia: "11 Jun", monto: 2500 },
        { dia: "12 Jun", monto: 2700 },
        { dia: "13 Jun", monto: 3000 },
        { dia: "14 Jun", monto: 3200 },
      ];
      const chartMessage: Message = {
        id: Date.now().toString(),
        content: "Progreso de la cobranza día a día:",
        isUser: false,
        timestamp: new Date(),
        type: "cobranza-line-chart",
        data: cobranzaMock,
      };
      setMessages((prev) => [...prev, chartMessage]);
      return;
    }

    // Comando de pareto de clientes con deudas
    if (content.trim().toLowerCase() === "ver pareto de clientes con deudas") {
      const clientesMock: ClienteDeuda[] = [
        { cliente: "Juan Pérez", deuda: 3200 },
        { cliente: "María García", deuda: 2700 },
        { cliente: "Carlos Rodríguez", deuda: 2500 },
        { cliente: "Ana Martínez", deuda: 2000 },
        { cliente: "Luis Torres", deuda: 1700 },
        { cliente: "Pedro López", deuda: 1200 },
        { cliente: "Sofía Ramírez", deuda: 900 },
        { cliente: "Miguel Díaz", deuda: 700 },
        { cliente: "Laura Fernández", deuda: 500 },
        { cliente: "Andrés Gómez", deuda: 350 },
      ];
      const paretoMessage: Message = {
        id: Date.now().toString(),
        content: "Pareto de clientes con deudas (mayor a menor):",
        isUser: false,
        timestamp: new Date(),
        type: "clientes-deuda-pareto",
        data: clientesMock,
      };
      setMessages((prev) => [...prev, paretoMessage]);
      return;
    }

    // Agregar el mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Activar indicador de escritura
    setIsLoading(true);

    // Comando de pagos pendientes
    if (content.toLowerCase().includes("pagos pendientes")) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowPaymentWizard(true);
      setIsLoading(false);
      return;
    }

    // Comando de estado de cuenta
    if (content.toLowerCase().includes("estado de cuenta cliente")) {
      const clientName = content
        .toLowerCase()
        .replace("estado de cuenta cliente", "")
        .trim();

      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const client = mockClientsAccounts.find(
        (c) =>
          c.name.toLowerCase().includes(clientName) ||
          c.code.toLowerCase().includes(clientName)
      );

      if (!client) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `No se encontró ningún cliente que coincida con "${clientName}".`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Formatear montos y fechas
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      };

      const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      // Generar el contenido del estado de cuenta
      const statementContent = `
📊 *Estado de Cuenta - ${client.name}*

*Información General:*
• Código: ${client.code}
• Email: ${client.email}
• Teléfono: ${client.phone}

💰 *Resumen Financiero:*
• Balance Actual: ${formatCurrency(client.currentBalance)}
• Límite de Crédito: ${formatCurrency(client.creditLimit)}
• Crédito Disponible: ${formatCurrency(
        client.creditLimit - client.currentBalance
      )}
• Última Compra: ${formatDate(client.lastPurchaseDate)}

📑 *Facturas Pendientes:*
${client.invoices
  .filter((inv) => inv.status !== "paid")
  .map(
    (inv) =>
      `• ${inv.number} - Vence: ${formatDate(
        inv.dueDate
      )} - Monto: ${formatCurrency(inv.amount)} - Estado: ${
        inv.status === "overdue" ? "⚠️ Vencida" : "⏳ Pendiente"
      }`
  )
  .join("\n")}

💳 *Últimos Pagos:*
${
  client.payments.length > 0
    ? client.payments
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5)
        .map(
          (payment) =>
            `• ${formatDate(payment.date)} - Ref: ${
              payment.reference
            } - Monto: ${formatCurrency(payment.amount)}`
        )
        .join("\n")
    : "• No hay pagos registrados"
}
`.trim();

      const statementMessage: Message = {
        id: Date.now().toString(),
        content: statementContent,
        isUser: false,
        timestamp: new Date(),
        type: "account-statement",
        data: client,
      };

      setMessages((prev) => [...prev, statementMessage]);
      setIsLoading(false);
      return;
    }

    // Simular delay para otros comandos
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse: Message = {
      id: Date.now().toString(),
      content:
        "Lo siento, no entiendo ese comando. ¿Podrías ser más específico?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      handleSendMessage(inputMessage.trim());
    }
  };

  // Scroll al fondo cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Guardar mensajes cuando cambien
  useEffect(() => {
    saveAdminMessagesToStorage(messages);
  }, [messages]);

  useEffect(() => {
    // Cargar los pagos pendientes cuando se necesiten
    if (isPaymentReviewOpen) {
      setPendingPayments(mockPendingPayments);
    }
  }, [isPaymentReviewOpen]);

  const handleDownloadPDF = () => {
    // Aquí iría la lógica para generar y descargar el PDF
    console.log("Descargando PDF...");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handlePaymentReviewComplete = (summary: {
    approved: PendingPayment[];
    rejected: PendingPayment[];
    totalApproved: number;
    totalRejected: number;
  }) => {
    const approvedCount = summary.approved.length;
    const rejectedCount = summary.rejected.length;
    const totalCount = approvedCount + rejectedCount;

    const summaryMessage = `
✅ **Revisión de pagos completada**

- **Total de pagos revisados:** ${totalCount}
- **Pagos aprobados:** ${approvedCount} (${summary.totalApproved.toLocaleString(
      "es-ES",
      { style: "currency", currency: "USD" }
    )})
- **Pagos rechazados:** ${rejectedCount} (${summary.totalRejected.toLocaleString(
      "es-ES",
      { style: "currency", currency: "USD" }
    )})

${
  approvedCount > 0
    ? `🎉 **Pagos Aprobados:**\n${summary.approved
        .map(
          (payment) =>
            `- ${payment.clientName} (${
              payment.reference
            }): ${payment.amount.toLocaleString("es-ES", {
              style: "currency",
              currency: "USD",
            })}`
        )
        .join("\n")}`
    : ""
}

${
  rejectedCount > 0
    ? `🚫 **Pagos Rechazados:**\n${summary.rejected
        .map(
          (payment) =>
            `- ${payment.clientName} (${
              payment.reference
            }): ${payment.amount.toLocaleString("es-ES", {
              style: "currency",
              currency: "USD",
            })}${payment.comments ? ` _(Motivo: ${payment.comments})_` : ""}`
        )
        .join("\n")}`
    : ""
}

---

💡 *Si tienes dudas, puedes solicitar el detalle de cada pago.*
    `.trim();

    // Agregar el mensaje de resumen al chat
    const botResponse: Message = {
      id: Date.now().toString(),
      content: summaryMessage,
      isUser: false,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, botResponse]);
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas borrar todo el historial de chat administrativo?"
      )
    ) {
      clearAdminChatHistory();
      setMessages([
        {
          id: "1",
          content:
            "¡Hola! Soy el asistente administrativo de ChatForce. ¿En qué puedo ayudarte?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      toast({
        title: "Éxito",
        description: "El historial de chat administrativo ha sido borrado",
      });
    }
  };

  const handleAccountStatement = async (clientName: string) => {
    const client = mockClientsAccounts.find(
      (c) =>
        c.name.toLowerCase() === clientName.toLowerCase() ||
        c.code.toLowerCase() === clientName.toLowerCase()
    );

    if (!client) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "No se encontró el cliente especificado.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Agregar el mensaje del estado de cuenta
    const statementMessage: Message = {
      id: Date.now().toString(),
      content: generateAccountStatementMessage(client),
      isUser: false,
      timestamp: new Date(),
      type: "account-statement",
      data: client,
    };

    setMessages((prev) => [...prev, statementMessage]);
  };

  const handleDownloadAccountStatement = async (client: ClientAccount) => {
    try {
      const doc = generateAccountStatementPDF(client);
      const fileName = `estado-cuenta-${client.code}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Usar un timeout para asegurar que el PDF se genere completamente
      setTimeout(() => {
        try {
          doc.save(fileName);
          toast({
            title: "PDF generado exitosamente",
            description: "El estado de cuenta ha sido descargado",
          });
        } catch (error) {
          console.error("Error al guardar el PDF:", error);
          toast({
            title: "Error al descargar PDF",
            description:
              "No se pudo descargar el documento. Por favor, intente nuevamente.",
            variant: "destructive",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast({
        title: "Error al generar PDF",
        description:
          "No se pudo generar el documento. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const generateAccountStatementMessage = (client: ClientAccount) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return `
📊 *Estado de Cuenta - ${client.name}*

*Información General:*
• Código: ${client.code}
• Email: ${client.email}
• Teléfono: ${client.phone}

💰 *Resumen Financiero:*
• Balance Actual: ${formatCurrency(client.currentBalance)}
• Límite de Crédito: ${formatCurrency(client.creditLimit)}
• Crédito Disponible: ${formatCurrency(
      client.creditLimit - client.currentBalance
    )}
• Última Compra: ${formatDate(client.lastPurchaseDate)}

📑 *Facturas Pendientes:*
${client.invoices
  .filter((inv) => inv.status !== "paid")
  .map(
    (inv) =>
      `• ${inv.number} - Vence: ${formatDate(
        inv.dueDate
      )} - Monto: ${formatCurrency(inv.amount)} - Estado: ${
        inv.status === "overdue" ? "⚠️ Vencida" : "⏳ Pendiente"
      }`
  )
  .join("\n")}

💳 *Últimos Pagos:*
${
  client.payments.length > 0
    ? client.payments
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5)
        .map(
          (payment) =>
            `• ${formatDate(payment.date)} - Ref: ${
              payment.reference
            } - Monto: ${formatCurrency(payment.amount)}`
        )
        .join("\n")
    : "• No hay pagos registrados"
}
    `.trim();
  };

  const renderAccountStatement = (client: ClientAccount) => {
    return (
      <div className="space-y-4">
        <div className="whitespace-pre-line">
          {generateAccountStatementMessage(client)}
        </div>
        <AccountStatusGrid
          items={client.invoices.map((invoice) => ({
            clientName: client.name,
            invoiceNumber: invoice.number,
            dueDate: invoice.dueDate,
            originalAmount: invoice.amount,
            pendingAmount: invoice.balance,
          }))}
          onDownloadPDF={() => handleDownloadAccountStatement(client)}
        />
      </div>
    );
  };

  const handlePaymentWizardComplete = (summary: {
    approved: PendingPayment[];
    rejected: PendingPayment[];
    totalApproved: number;
    totalRejected: number;
  }) => {
    const summaryMessage: Message = {
      id: Date.now().toString(),
      content:
        `✅ Revisión de pagos completada:\n\n` +
        `• Total de pagos revisados: ${
          summary.approved.length + summary.rejected.length
        }\n` +
        `• Pagos aprobados: ${
          summary.approved.length
        } ($${summary.totalApproved.toFixed(2)})\n` +
        `• Pagos rechazados: ${
          summary.rejected.length
        } ($${summary.totalRejected.toFixed(2)})`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, summaryMessage]);
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header con botón de borrar historial */}
        {messages.length > 0 && (
          <div className="flex justify-between items-center p-2 border-b border-border/30">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Historial de chat administrativo</span>
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                <ChatMessage
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
                {message.type === "account-statement" && message.data && (
                  <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                    <AccountStatusGrid
                      items={message.data.invoices.map((invoice) => ({
                        clientName: message.data.name,
                        invoiceNumber: invoice.number,
                        dueDate: invoice.dueDate,
                        originalAmount: invoice.amount,
                        pendingAmount: invoice.balance,
                      }))}
                      onDownloadPDF={() =>
                        handleDownloadAccountStatement(message.data)
                      }
                    />
                  </div>
                )}
                {/* Render help commands as clickable buttons if needed */}
                {message.type === "help-commands" && showHelpCommands && (
                  <div className="mt-2">
                    <AdminSampleQueries onSelectQuery={handleSendMessage} />
                  </div>
                )}
                {/* Render CobranzaLineChart if type is cobranza-line-chart */}
                {message.type === "cobranza-line-chart" &&
                  Array.isArray(message.data) && (
                    <div className="mt-4">
                      <CobranzaLineChart data={message.data} />
                    </div>
                  )}
                {/* Render ClientesDeudaParetoChart if type is clientes-deuda-pareto */}
                {message.type === "clientes-deuda-pareto" &&
                  Array.isArray(message.data) && (
                    <div className="mt-4">
                      <ClientesDeudaParetoChart data={message.data} />
                    </div>
                  )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-bl-none p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <AdminSampleQueries onSelectQuery={handleSendMessage} />
          </div>
        </div>
      </div>

      <PaymentReviewWizard
        isOpen={showPaymentWizard}
        onClose={() => setShowPaymentWizard(false)}
        payments={mockPendingPayments}
        onComplete={handlePaymentWizardComplete}
      />
    </>
  );
};

export default Chatbot;
