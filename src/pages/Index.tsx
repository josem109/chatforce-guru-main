import React, { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import SampleQueries from "@/components/SampleQueries";
import { ChatMessageProps } from "@/components/ChatMessage";
import { toast } from "@/hooks/use-toast";
import {
  saveMessagesToStorage,
  loadMessagesFromStorage,
} from "@/lib/chatStorage";
import { generateMockResponse } from "@/lib/mockResponses";
import { CobranzaWizard } from "@/components/cobranza/CobranzaWizard";

type Message = Omit<ChatMessageProps, "animationDelay">;

interface Cliente {
  codigo: string;
  nombre: string;
  ciudad: string;
}

interface Producto {
  codigo: string;
  nombre: string;
  precio: number;
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [orderStep, setOrderStep] = useState<
    "client" | "product" | "confirm" | null
  >(null);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCobranzaWizardOpen, setIsCobranzaWizardOpen] = useState(false);

  // Load saved messages when component mounts
  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  const handleClientSelection = useCallback((client: Cliente) => {
    setSelectedClient(client);
    setOrderStep("product");

    const botMessage: Message = {
      content: `Selecciona el producto para el pedido:

<div class="overflow-x-auto mt-4 mb-2">
  <table class="min-w-full bg-white/10 rounded-lg overflow-hidden">
    <thead class="bg-primary/10">
      <tr>
        <th class="px-4 py-2 text-left text-sm">Código</th>
        <th class="px-4 py-2 text-left text-sm">Producto</th>
        <th class="px-4 py-2 text-left text-sm">Precio</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleProductSelection('PROD001', 'Laptop HP 15', 899.99)">
        <td class="px-4 py-2 text-sm">PROD001</td>
        <td class="px-4 py-2 text-sm">Laptop HP 15</td>
        <td class="px-4 py-2 text-sm">$899.99</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleProductSelection('PROD002', 'Monitor Dell 27', 299.99)">
        <td class="px-4 py-2 text-sm">PROD002</td>
        <td class="px-4 py-2 text-sm">Monitor Dell 27</td>
        <td class="px-4 py-2 text-sm">$299.99</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleProductSelection('PROD003', 'Teclado Mecánico', 79.99)">
        <td class="px-4 py-2 text-sm">PROD003</td>
        <td class="px-4 py-2 text-sm">Teclado Mecánico</td>
        <td class="px-4 py-2 text-sm">$79.99</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleProductSelection('PROD004', 'Mouse Gaming', 49.99)">
        <td class="px-4 py-2 text-sm">PROD004</td>
        <td class="px-4 py-2 text-sm">Mouse Gaming</td>
        <td class="px-4 py-2 text-sm">$49.99</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleProductSelection('PROD005', 'Auriculares BT', 129.99)">
        <td class="px-4 py-2 text-sm">PROD005</td>
        <td class="px-4 py-2 text-sm">Auriculares BT</td>
        <td class="px-4 py-2 text-sm">$129.99</td>
      </tr>
    </tbody>
  </table>
</div>`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  }, []);

  const handleProductSelection = useCallback(
    (codigo: string, nombre: string, precio: number) => {
      const product = { codigo, nombre, precio };
      setSelectedProduct(product);
      setOrderStep("confirm");

      const botMessage: Message = {
        content: `Confirme el pedido para el Cliente ${selectedClient?.nombre}:

Producto seleccionado: ${nombre} ($${precio})

<div class="mt-4 flex items-center space-x-4">
  <button onclick="${isOrderCompleted ? "" : "window.handleCreateOrder()"}" ${
          isOrderCompleted ? "disabled" : ""
        } class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-primary/50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>Crear Pedido</span>
  </button>
  <button onclick="${isOrderCompleted ? "" : "window.handleCancelOrder()"}" ${
          isOrderCompleted ? "disabled" : ""
        } class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-destructive/50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
    <span>Cancelar Pedido</span>
  </button>
</div>`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => {
        // Update only the order buttons in previous messages
        if (isOrderCompleted) {
          return prevMessages.map((msg) => ({
            ...msg,
            content: msg.content.replace(
              /<button[^>]*onclick="window\.(handleCreateOrder|handleCancelOrder)\(\)"[^>]*>[\s\S]*?<\/button>/g,
              (match) =>
                match
                  .replace(/onclick="[^"]*"/, "disabled")
                  .replace(/bg-(primary|destructive)/, "bg-$1/50")
                  .replace(/disabled:opacity-\d+/, "disabled:opacity-30")
            ),
          }));
        }
        return [...prevMessages, botMessage];
      });
    },
    [selectedClient, isOrderCompleted]
  );

  const handleCreateOrder = useCallback(() => {
    setOrderStep(null);
    setSelectedClient(null);
    setSelectedProduct(null);
    setIsOrderCompleted(true);

    // Add success toast
    toast({
      title: "Pedido creado con éxito",
      variant: "default",
      className: "bg-green-500 text-white border-0",
      duration: 3000,
    });

    const botMessage: Message = {
      content: `Pedido enviado al sistema, espere 30 minutos para que se vea reflejado en el sistema.`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => ({
        ...msg,
        content: msg.content.replace(
          /<button[^>]*onclick="window\.(handleCreateOrder|handleCancelOrder)\(\)"[^>]*>[\s\S]*?<\/button>/g,
          (match) =>
            match
              .replace(/onclick="[^"]*"/, "disabled")
              .replace(/bg-(primary|destructive)/, "bg-$1/50")
              .replace(/disabled:opacity-\d+/, "disabled:opacity-30")
        ),
      }));
      return [...updatedMessages, botMessage];
    });
  }, []);

  const handleCancelOrder = useCallback(() => {
    setOrderStep(null);
    setSelectedClient(null);
    setSelectedProduct(null);
    setIsOrderCompleted(true);

    // Add error toast
    toast({
      title: "Pedido cancelado por el usuario",
      variant: "destructive",
      className: "bg-red-500 text-white border-0",
      duration: 3000,
    });

    const botMessage: Message = {
      content: `Creación de pedido cancelada.`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => ({
        ...msg,
        content: msg.content.replace(
          /<button[^>]*onclick="window\.(handleCreateOrder|handleCancelOrder)\(\)"[^>]*>[\s\S]*?<\/button>/g,
          (match) =>
            match
              .replace(/onclick="[^"]*"/, "disabled")
              .replace(/bg-(primary|destructive)/, "bg-$1/50")
              .replace(/disabled:opacity-\d+/, "disabled:opacity-30")
        ),
      }));
      return [...updatedMessages, botMessage];
    });
  }, []);

  useEffect(() => {
    // Add handlers to window object for table row clicks
    (window as any).handleClientSelection = (
      codigo: string,
      nombre: string,
      ciudad: string
    ) => {
      handleClientSelection({ codigo, nombre, ciudad });
    };
    (window as any).handleProductSelection = (
      codigo: string,
      nombre: string,
      precio: number
    ) => {
      handleProductSelection(codigo, nombre, precio);
    };
    (window as any).handleCreateOrder = handleCreateOrder;
    (window as any).handleCancelOrder = handleCancelOrder;
    (window as any).handleSendEmail = () => {
      setIsEmailSent(true);
      toast({
        title: "Correo enviado exitosamente",
        variant: "default",
        className: "bg-green-500 text-white border-0",
        duration: 3000,
      });

      // Update all email buttons in previous messages to be disabled
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          content: msg.content.replace(
            /<button[^>]*onclick="window\.handleSendEmail\(\)"[^>]*>[\s\S]*?<\/button>/g,
            (match) =>
              match
                .replace(/onclick="[^"]*"/, "disabled")
                .replace(/bg-primary/, "bg-primary/50")
                .replace(
                  /class="([^"]*)"/,
                  'class="$1 disabled:opacity-30 disabled:cursor-not-allowed"'
                )
          ),
        }))
      );
    };

    return () => {
      // Cleanup handlers
      delete (window as any).handleClientSelection;
      delete (window as any).handleProductSelection;
      delete (window as any).handleCreateOrder;
      delete (window as any).handleCancelOrder;
      delete (window as any).handleSendEmail;
    };
  }, [
    handleClientSelection,
    handleProductSelection,
    handleCreateOrder,
    handleCancelOrder,
  ]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    // Only disable previous email buttons if the new query is not about "pago"
    if (!content.toLowerCase().includes("pago")) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          content: msg.content.replace(
            /<button[^>]*onclick="window\.handleSendEmail\(\)"[^>]*>[\s\S]*?<\/button>/g,
            (match) =>
              match
                .replace(/onclick="[^"]*"/, "disabled")
                .replace(/bg-primary/, "bg-primary/50")
                .replace(
                  /class="([^"]*)"/,
                  'class="$1 disabled:opacity-30 disabled:cursor-not-allowed"'
                )
          ),
        }))
      );
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let botResponseText;

      if (
        content.toLowerCase().includes("procesar") &&
        content.toLowerCase().includes("cobranza")
      ) {
        setIsCobranzaWizardOpen(true);
        botResponseText =
          "He abierto el asistente de cobranza para ti. Por favor, selecciona las facturas que deseas procesar.";
      } else if (
        content.toLowerCase().includes("crear") &&
        content.toLowerCase().includes("pedido")
      ) {
        setOrderStep("client");
        setIsOrderCompleted(false);
        setSelectedClient(null);
        setSelectedProduct(null);
        botResponseText = `Selecciona el cliente para el Pedido:

<div class="overflow-x-auto mt-4 mb-2">
  <table class="min-w-full bg-white/10 rounded-lg overflow-hidden">
    <thead class="bg-primary/10">
      <tr>
        <th class="px-4 py-2 text-left text-sm">Código</th>
        <th class="px-4 py-2 text-left text-sm">Cliente</th>
        <th class="px-4 py-2 text-left text-sm">Ciudad</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleClientSelection('CLI001', 'Juan Pérez', 'Ciudad A')">
        <td class="px-4 py-2 text-sm">CLI001</td>
        <td class="px-4 py-2 text-sm">Juan Pérez</td>
        <td class="px-4 py-2 text-sm">Ciudad A</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleClientSelection('CLI002', 'María García', 'Ciudad B')">
        <td class="px-4 py-2 text-sm">CLI002</td>
        <td class="px-4 py-2 text-sm">María García</td>
        <td class="px-4 py-2 text-sm">Ciudad B</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleClientSelection('CLI003', 'Carlos Rodríguez', 'Ciudad C')">
        <td class="px-4 py-2 text-sm">CLI003</td>
        <td class="px-4 py-2 text-sm">Carlos Rodríguez</td>
        <td class="px-4 py-2 text-sm">Ciudad C</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleClientSelection('CLI004', 'Ana Martínez', 'Ciudad A')">
        <td class="px-4 py-2 text-sm">CLI004</td>
        <td class="px-4 py-2 text-sm">Ana Martínez</td>
        <td class="px-4 py-2 text-sm">Ciudad A</td>
      </tr>
      <tr class="border-t border-border/30 cursor-pointer hover:bg-primary/5" onclick="window.handleClientSelection('CLI005', 'Luis Torres', 'Ciudad B')">
        <td class="px-4 py-2 text-sm">CLI005</td>
        <td class="px-4 py-2 text-sm">Luis Torres</td>
        <td class="px-4 py-2 text-sm">Ciudad B</td>
      </tr>
    </tbody>
  </table>
</div>`;
      } else if (content.toLowerCase().includes("ventas mensuales")) {
        botResponseText = `Las ventas mensuales de la Región Oriental son:
        
<div class="flex flex-col space-y-2 mt-4 mb-2">
  <div class="flex items-center">
    <span class="w-20 text-sm">Enero</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 80%"></div>
    <span class="ml-2 text-sm">$80K</span>
  </div>
  <div class="flex items-center">
    <span class="w-20 text-sm">Febrero</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 65%"></div>
    <span class="ml-2 text-sm">$65K</span>
  </div>
  <div class="flex items-center">
    <span class="w-20 text-sm">Marzo</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 90%"></div>
    <span class="ml-2 text-sm">$90K</span>
  </div>
  <div class="flex items-center">
    <span class="w-20 text-sm">Abril</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 75%"></div>
    <span class="ml-2 text-sm">$75K</span>
  </div>
  <div class="flex items-center">
    <span class="w-20 text-sm">Mayo</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 85%"></div>
    <span class="ml-2 text-sm">$85K</span>
  </div>
  <div class="flex items-center">
    <span class="w-20 text-sm">Junio</span>
    <div class="h-6 bg-primary/80 rounded" style="width: 70%"></div>
    <span class="ml-2 text-sm">$70K</span>
  </div>
</div>

Total de ventas del semestre: $465K`;
      } else if (content.toLowerCase().includes("pedidos pendientes")) {
        const tableData = [
          {
            codigo: "CLI001",
            nombre: "Juan Pérez",
            pedido: "PED-2024-001",
            monto: 1500,
            fecha: "2024-03-15",
          },
          {
            codigo: "CLI002",
            nombre: "María García",
            pedido: "PED-2024-002",
            monto: 2300,
            fecha: "2024-03-14",
          },
          {
            codigo: "CLI003",
            nombre: "Carlos Rodríguez",
            pedido: "PED-2024-003",
            monto: 1800,
            fecha: "2024-03-13",
          },
          {
            codigo: "CLI004",
            nombre: "Ana Martínez",
            pedido: "PED-2024-004",
            monto: 3200,
            fecha: "2024-03-12",
          },
          {
            codigo: "CLI005",
            nombre: "Luis Torres",
            pedido: "PED-2024-005",
            monto: 2700,
            fecha: "2024-03-11",
          },
        ];

        const csvContent = `data:text/csv;charset=utf-8,Código del Cliente,Nombre Cliente,N° Pedido,Monto $,Fecha Pedido\n${tableData
          .map(
            (row) =>
              `${row.codigo},${row.nombre},${row.pedido},${row.monto},${row.fecha}`
          )
          .join("\n")}`;

        botResponseText = `Aquí tienes una relación de los pedidos de todos tus clientes:

<div class="overflow-x-auto mt-4 mb-2">
  <table class="min-w-full bg-white/10 rounded-lg overflow-hidden">
    <thead class="bg-primary/10">
      <tr>
        <th class="px-4 py-2 text-left text-sm">Código del Cliente</th>
        <th class="px-4 py-2 text-left text-sm">Nombre Cliente</th>
        <th class="px-4 py-2 text-left text-sm">N° Pedido</th>
        <th class="px-4 py-2 text-left text-sm">Monto $</th>
        <th class="px-4 py-2 text-left text-sm">Fecha Pedido</th>
      </tr>
    </thead>
    <tbody>
      ${tableData
        .map(
          (row) => `
        <tr class="border-t border-border/30">
          <td class="px-4 py-2 text-sm">${row.codigo}</td>
          <td class="px-4 py-2 text-sm">${row.nombre}</td>
          <td class="px-4 py-2 text-sm">${row.pedido}</td>
          <td class="px-4 py-2 text-sm">$${row.monto}</td>
          <td class="px-4 py-2 text-sm">${row.fecha}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</div>

<div class="mt-4 flex items-center">
  <a href="${encodeURI(
    csvContent
  )}" download="pedidos_pendientes.csv" class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <span>Descargar CSV</span>
  </a>
</div>`;
      } else if (
        content.toLowerCase().includes("estado") &&
        content.toLowerCase().includes("cuenta")
      ) {
        const accountData = [
          { codigo: "CLI001", nombre: "Juan Pérez", deuda: 2500 },
          { codigo: "CLI002", nombre: "María García", deuda: 1800 },
          { codigo: "CLI003", nombre: "Carlos Rodríguez", deuda: 3200 },
          { codigo: "CLI004", nombre: "Ana Martínez", deuda: 1500 },
          { codigo: "CLI005", nombre: "Luis Torres", deuda: 2900 },
        ];

        const csvContent = `data:text/csv;charset=utf-8,Código del Cliente,Nombre Cliente,Cuentas por Cobrar $\n${accountData
          .map((row) => `${row.codigo},${row.nombre},${row.deuda}`)
          .join("\n")}`;

        botResponseText = `Aquí tienes el estado de cuenta de tus clientes:

<div class="overflow-x-auto mt-4 mb-2">
  <table class="min-w-full bg-white/10 rounded-lg overflow-hidden">
    <thead class="bg-primary/10">
      <tr>
        <th class="px-4 py-2 text-left text-sm">Código del Cliente</th>
        <th class="px-4 py-2 text-left text-sm">Nombre Cliente</th>
        <th class="px-4 py-2 text-left text-sm">Cuentas por Cobrar $</th>
      </tr>
    </thead>
    <tbody>
      ${accountData
        .map(
          (row) => `
        <tr class="border-t border-border/30">
          <td class="px-4 py-2 text-sm">${row.codigo}</td>
          <td class="px-4 py-2 text-sm">${row.nombre}</td>
          <td class="px-4 py-2 text-sm">$${row.deuda}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</div>

<div class="mt-4 flex items-center">
  <a href="${encodeURI(
    csvContent
  )}" download="estado_cuenta_clientes.csv" class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <span>Descargar CSV</span>
  </a>
</div>`;
      } else if (content.toLowerCase().includes("pago")) {
        setIsEmailSent(false);
        botResponseText = `El pago aún no se ha acreditado en el banco. ¿Quieres que le envíe un correo al Cliente?

<div class="mt-4">
  <button onclick="${isEmailSent ? "" : "window.handleSendEmail()"}" ${
          isEmailSent ? "disabled" : ""
        } class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-primary/50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
    <span>Enviar Correo</span>
  </button>
</div>`;
      } else {
        botResponseText = `Lo siento, solo puedo atender consultas relacionadas a cobranzas y de pedidos, intenta una consulta válida.`;
      }

      // Add bot message
      const botMessage: Message = {
        content: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      toast({
        title: "Error",
        description:
          "Ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleSelectQuery = useCallback(
    (query: string) => {
      handleSendMessage(query);
    },
    [handleSendMessage]
  );

  const handleCobranzaWizardClose = () => {
    setIsCobranzaWizardOpen(false);
    // Aquí podrías agregar lógica adicional cuando se cierra el wizard
  };

  const handleCobranzaComplete = (resumen: {
    facturas: any[];
    pagos: any[];
    montoTotal: number;
    comprobante: string;
  }) => {
    const resumenMessage = `Cobranza procesada exitosamente

<div class="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
  <div class="flex items-center gap-2 text-green-500 mb-4">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span class="font-medium">Cobranza Completada</span>
  </div>

  <div class="space-y-4">
    <div>
      <h4 class="text-sm font-medium mb-2">Facturas Procesadas</h4>
      <div class="bg-white/5 rounded-lg p-3">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="text-left text-xs font-medium text-muted-foreground">Número</th>
              <th class="text-left text-xs font-medium text-muted-foreground">Fecha</th>
              <th class="text-right text-xs font-medium text-muted-foreground">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${resumen.facturas
              .map(
                (factura) => `
              <tr>
                <td class="text-sm">${factura.numero}</td>
                <td class="text-sm">${factura.fecha}</td>
                <td class="text-sm text-right">$${factura.montoPendiente.toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h4 class="text-sm font-medium mb-2">Pagos Registrados</h4>
      <div class="bg-white/5 rounded-lg p-3">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="text-left text-xs font-medium text-muted-foreground">Banco</th>
              <th class="text-left text-xs font-medium text-muted-foreground">Referencia</th>
              <th class="text-left text-xs font-medium text-muted-foreground">Tipo</th>
              <th class="text-right text-xs font-medium text-muted-foreground">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${resumen.pagos
              .map(
                (pago) => `
              <tr>
                <td class="text-sm">${pago.banco}</td>
                <td class="text-sm">${pago.referencia}</td>
                <td class="text-sm">${pago.tipoPago}</td>
                <td class="text-sm text-right">$${pago.monto.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex justify-between items-center text-sm">
      <span class="font-medium">Monto Total Pagado:</span>
      <span class="font-semibold">$${resumen.montoTotal.toFixed(2)}</span>
    </div>

    <div class="mt-4">
      <a
        href="${resumen.comprobante}"
        download="comprobante-cobranza.pdf"
        class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Descargar Comprobante</span>
      </a>
    </div>

    <div class="mt-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Nota: Esta cobranza debe ser validada y aprobada por el equipo de finanzas.</span>
      </div>
    </div>
  </div>
</div>`;

    const botMessage: Message = {
      content: resumenMessage,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto px-4">
      <Header />

      <div className="flex-1 flex flex-col glass-morphism rounded-xl p-2 md:p-4 overflow-hidden mb-4">
        <ChatHistory messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>

      <div className="mb-4">
        <SampleQueries onSelectQuery={handleSelectQuery} />
      </div>

      <CobranzaWizard
        isOpen={isCobranzaWizardOpen}
        onClose={handleCobranzaWizardClose}
        onCobranzaComplete={handleCobranzaComplete}
      />
    </div>
  );
};

export default Index;
