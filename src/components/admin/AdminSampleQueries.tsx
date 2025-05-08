import React from "react";
import {
  ArrowRight,
  CreditCard,
  Package,
  BarChart4,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDelayedRender } from "@/lib/animations";

interface AdminSampleQueryProps {
  onSelectQuery: (query: string) => void;
}

const adminSampleQueries = {
  reports: [
    "Generar reporte de Cobranzas del mes",
    "Mostrar gráfica de cobranzas pendientes",
    "Ver Pareto de clientes con deudas",
  ],
  accounts: [
    "Estado de cuenta del cliente ID-12345",
    "Listar pagos pendientes de revisión",
    "Buscar transacciones del día",
  ],
  clients: [
    "Información del cliente Juan Pérez",
    "Listar clientes con pagos atrasados",
    "Ver historial de conversaciones del cliente ID-789",
  ],
};

const AdminSampleQueries: React.FC<AdminSampleQueryProps> = ({
  onSelectQuery,
}) => {
  const shouldRenderReports = useDelayedRender(100);
  const shouldRenderAccounts = useDelayedRender(300);
  const shouldRenderClients = useDelayedRender(500);

  return (
    <div className="mt-6 mb-6 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
        Consultas administrativas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shouldRenderReports && (
          <div className="glass-morphism rounded-xl p-4 overflow-hidden animate-fade-in">
            <div className="flex items-center mb-3">
              <BarChart4 className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-medium text-sm">Reportes y Gráficas</h4>
            </div>
            <div className="space-y-2">
              {adminSampleQueries.reports.map((query, index) => (
                <QueryButton
                  key={`report-${index}`}
                  query={query}
                  onClick={() => onSelectQuery(query)}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        )}

        {shouldRenderAccounts && (
          <div className="glass-morphism rounded-xl p-4 overflow-hidden animate-fade-in">
            <div className="flex items-center mb-3">
              <CreditCard className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-medium text-sm">Estados de Cuenta</h4>
            </div>
            <div className="space-y-2">
              {adminSampleQueries.accounts.map((query, index) => (
                <QueryButton
                  key={`account-${index}`}
                  query={query}
                  onClick={() => onSelectQuery(query)}
                  delay={index * 100 + 100}
                />
              ))}
            </div>
          </div>
        )}

        {shouldRenderClients && (
          <div className="glass-morphism rounded-xl p-4 overflow-hidden animate-fade-in">
            <div className="flex items-center mb-3">
              <Users className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-medium text-sm">Clientes</h4>
            </div>
            <div className="space-y-2">
              {adminSampleQueries.clients.map((query, index) => (
                <QueryButton
                  key={`client-${index}`}
                  query={query}
                  onClick={() => onSelectQuery(query)}
                  delay={index * 100 + 200}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface QueryButtonProps {
  query: string;
  onClick: () => void;
  delay: number;
}

const QueryButton: React.FC<QueryButtonProps> = ({ query, onClick, delay }) => {
  return (
    <button
      className={cn(
        "text-left w-full p-3 rounded-lg text-xs transition-all",
        "bg-secondary/80 hover:bg-secondary text-secondary-foreground group",
        "flex items-center justify-between opacity-0"
      )}
      onClick={onClick}
      style={{
        animation: `fade-in 0.3s ease-out forwards ${delay}ms`,
      }}
    >
      <span className="line-clamp-1">{query}</span>
      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
    </button>
  );
};

export default AdminSampleQueries;
