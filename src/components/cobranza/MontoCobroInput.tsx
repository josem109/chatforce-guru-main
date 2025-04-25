import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MontoCobroInputProps {
  montoMaximo: number;
  onMontoChange: (monto: number, isValid: boolean) => void;
}

export const MontoCobroInput: React.FC<MontoCobroInputProps> = ({
  montoMaximo,
  onMontoChange,
}) => {
  const [monto, setMonto] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleMontoChange = (value: string) => {
    // Solo permitir números y punto decimal
    const numericValue = value.replace(/[^0-9.]/g, "");
    setMonto(numericValue);

    const montoNumero = parseFloat(numericValue) || 0;

    if (montoNumero > montoMaximo) {
      setError(`El monto no puede ser mayor a $${montoMaximo.toFixed(2)}`);
      onMontoChange(montoNumero, false);
    } else {
      setError("");
      onMontoChange(montoNumero, true);
    }
  };

  const handleMaxClick = () => {
    setMonto(montoMaximo.toString());
    onMontoChange(montoMaximo, true);
    setError("");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="monto" className="text-base">
        Monto a Cobrar
      </Label>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="monto"
            type="text"
            value={monto}
            onChange={(e) => handleMontoChange(e.target.value)}
            placeholder="0.00"
            className={error ? "border-destructive" : ""}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleMaxClick}
          className="whitespace-nowrap"
        >
          MAX
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground">
          Monto seleccionado en el paso anterior: ${montoMaximo.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
