// Interfaces base para el chatbot administrativo
export interface AccountStatusQuery {
  type: "account_status";
  actions: {
    generatePDF: (clientId?: string) => void;
    viewDetails: (clientId?: string) => void;
  };
  response: {
    type: "pdf" | "summary";
    content: string | PDFData;
  };
}

export interface PendingPayment {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: Date;
  status: "pending_review" | "approved" | "rejected";
  paymentMethod: string;
  reference: string;
  attachments?: string[];
}

export interface DashboardCharts {
  // ... (el código de gráficas que mostré anteriormente)
}
