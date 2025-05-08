export const adminBotCommands = {
  "estado de cuenta": {
    handler: async (clientId?: string) => {
      // Lógica para generar estado de cuenta
      return {
        type: "account_status",
        content: {
          // ... datos del estado de cuenta
        },
      };
    },
  },
  "cobranzas pendientes": {
    handler: async () => {
      // Lógica para obtener cobranzas pendientes
      return {
        type: "payment_review",
        content: {
          // ... datos de pagos pendientes
        },
      };
    },
  },
  "mostrar gráfica": {
    handler: async (chartType: string) => {
      // Lógica para generar gráficas
      return {
        type: "chart",
        content: {
          // ... datos de la gráfica
        },
      };
    },
  },
};
