export interface Factura {
  numero: string;
  fecha: string;
  montoOriginal: number;
  montoPendiente: number;
}

export const facturasMock: Factura[] = [
  {
    numero: "F001",
    fecha: "2023-01-15",
    montoOriginal: 1000,
    montoPendiente: 1000,
  },
  {
    numero: "F002",
    fecha: "2023-02-20",
    montoOriginal: 2000,
    montoPendiente: 2000,
  },
  {
    numero: "F003",
    fecha: "2023-03-10",
    montoOriginal: 1500,
    montoPendiente: 1500,
  },
  {
    numero: "F004",
    fecha: "2023-04-05",
    montoOriginal: 3000,
    montoPendiente: 3000,
  },
  {
    numero: "F005",
    fecha: "2023-05-12",
    montoOriginal: 2500,
    montoPendiente: 2500,
  },
];
export interface PendingPayment {
  id: string;
  clientName: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  reference: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  paymentProofUrl: string;
}

export const mockPendingPayments: PendingPayment[] = [
  {
    id: "1",
    clientName: "Distribuidora Norte",
    amount: 1500.0,
    date: new Date("2024-03-15"),
    paymentMethod: "Transferencia",
    reference: "TRF-2024-001",
    status: "pending",
    paymentProofUrl: "",
  },
  {
    id: "2",
    clientName: "Comercial Sur",
    amount: 2300.0,
    date: new Date("2024-03-14"),
    paymentMethod: "Depósito",
    reference: "DEP-2024-002",
    status: "pending",
    paymentProofUrl: "",
  },
  {
    id: "3",
    clientName: "Carlos Rodríguez",
    amount: 1800.75,
    date: new Date("2024-03-13"),
    paymentMethod: "Transferencia",
    reference: "TRF-2024-003",
    status: "pending",
    paymentProofUrl: "https://placehold.co/600x400/png?text=Comprobante+3",
  },
  {
    id: "4",
    clientName: "Ana Martínez",
    amount: 3200.0,
    date: new Date("2024-03-12"),
    paymentMethod: "Depósito",
    reference: "DEP-2024-004",
    status: "pending",
    paymentProofUrl: "https://placehold.co/600x400/png?text=Comprobante+4",
  },
  {
    id: "5",
    clientName: "Luis Torres",
    amount: 950.25,
    date: new Date("2024-03-11"),
    paymentMethod: "Transferencia",
    reference: "TRF-2024-005",
    status: "pending",
    paymentProofUrl: "https://placehold.co/600x400/png?text=Comprobante+5",
  },
];

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: "pending" | "paid" | "overdue";
  balance: number;
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: string;
  reference: string;
  invoiceNumber: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  invoices: Invoice[];
  payments: Payment[];
  currentBalance: number;
  creditLimit: number;
  lastPurchaseDate: Date;
}

export const mockClientsAccounts: ClientAccount[] = [
  {
    id: "1",
    name: "Distribuidora Norte",
    code: "CLI-001",
    email: "contacto@distnorte.com",
    phone: "+1234567890",
    currentBalance: 15000,
    creditLimit: 50000,
    lastPurchaseDate: new Date("2024-03-01"),
    invoices: [
      {
        id: "1",
        number: "F-2024-001",
        date: new Date("2024-02-01"),
        dueDate: new Date("2024-03-03"),
        amount: 5000,
        status: "paid",
        balance: 0,
      },
      {
        id: "2",
        number: "F-2024-002",
        date: new Date("2024-02-15"),
        dueDate: new Date("2024-03-17"),
        amount: 8000,
        status: "pending",
        balance: 8000,
      },
      {
        id: "3",
        number: "F-2024-003",
        date: new Date("2024-03-01"),
        dueDate: new Date("2024-04-01"),
        amount: 7000,
        status: "pending",
        balance: 7000,
      },
    ],
    payments: [
      {
        id: "1",
        date: new Date("2024-02-10"),
        amount: 5000,
        method: "Transferencia",
        reference: "TRF-2024-001",
        invoiceNumber: "F-2024-001",
      },
    ],
  },
  {
    id: "2",
    name: "Comercial Sur",
    code: "CLI-002",
    email: "ventas@comercialsur.com",
    phone: "+1234567891",
    currentBalance: 25000,
    creditLimit: 40000,
    lastPurchaseDate: new Date("2024-02-28"),
    invoices: [
      {
        id: "4",
        number: "F-2024-004",
        date: new Date("2024-02-01"),
        dueDate: new Date("2024-03-03"),
        amount: 12000,
        status: "overdue",
        balance: 12000,
      },
      {
        id: "5",
        number: "F-2024-005",
        date: new Date("2024-02-15"),
        dueDate: new Date("2024-03-17"),
        amount: 13000,
        status: "pending",
        balance: 13000,
      },
    ],
    payments: [],
  },
];
