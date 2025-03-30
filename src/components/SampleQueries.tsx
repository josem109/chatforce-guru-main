import React from "react";
import { ArrowRight, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDelayedRender } from "@/lib/animations";

interface SampleQueryProps {
  onSelectQuery: (query: string) => void;
}

const sampleQueries = {
  collections: [
    "¿Cuál es el estado de cuenta de mis clientes?",
    "¿Cuál es el estado del pago número 12345?",
  ],
  orders: [
    "¿Cuáles son las ventas mensuales de la región?",
    "¿Cuáles son los pedidos pendientes actuales?",
  ],
};

const SampleQueries: React.FC<SampleQueryProps> = ({ onSelectQuery }) => {
  const shouldRenderCollections = useDelayedRender(100);
  const shouldRenderOrders = useDelayedRender(300);

  return (
    <div className="mt-6 mb-6 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
        Consultas de ejemplo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shouldRenderCollections && (
          <div className="glass-morphism rounded-xl p-4 overflow-hidden animate-fade-in">
            <div className="flex items-center mb-3">
              <CreditCard className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-medium text-sm">Cobranzas</h4>
            </div>
            <div className="space-y-2">
              {sampleQueries.collections.map((query, index) => (
                <QueryButton
                  key={`collection-${index}`}
                  query={query}
                  onClick={() => onSelectQuery(query)}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        )}

        {shouldRenderOrders && (
          <div className="glass-morphism rounded-xl p-4 overflow-hidden animate-fade-in">
            <div className="flex items-center mb-3">
              <Package className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-medium text-sm">Pedidos</h4>
            </div>
            <div className="space-y-2">
              {sampleQueries.orders.map((query, index) => (
                <QueryButton
                  key={`order-${index}`}
                  query={query}
                  onClick={() => onSelectQuery(query)}
                  delay={index * 100 + 100}
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

export default SampleQueries;
