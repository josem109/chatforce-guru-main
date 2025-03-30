
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'Eres un asistente virtual de ventas amable y profesional que ayuda a los vendedores con información sobre cobranzas y pedidos.'
  );
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [isDebuggingEnabled, setIsDebuggingEnabled] = useState(false);
  const [maxTokens, setMaxTokens] = useState('1024');
  const [temperature, setTemperature] = useState('0.7');
  
  const handleSaveSettings = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "La clave API es requerida",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to a database via an API
    // For demo purposes, we'll just show a success toast
    
    toast({
      title: "Configuración guardada",
      description: "La configuración ha sido guardada exitosamente",
    });
  };
  
  const handleTestAPIKey = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Ingrese una clave API para probar",
        variant: "destructive"
      });
      return;
    }
    
    setIsTestingAPI(true);
    
    // Simulate API test
    setTimeout(() => {
      setIsTestingAPI(false);
      
      // Simulating a successful test
      toast({
        title: "Conexión exitosa",
        description: "La clave API ha sido verificada correctamente",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Configuración</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de API</CardTitle>
            <CardDescription>
              Configura la conexión con el modelo de lenguaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Clave API</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  className="ml-2" 
                  onClick={handleTestAPIKey}
                  disabled={isTestingAPI}
                >
                  {isTestingAPI ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Probar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                La clave API será encriptada y almacenada de forma segura
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={isDebuggingEnabled}
                onCheckedChange={setIsDebuggingEnabled}
              />
              <Label htmlFor="debug-mode">Modo de depuración</Label>
            </div>
          </CardContent>
        </Card>
        
        {/* Model Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Modelo</CardTitle>
            <CardDescription>
              Ajusta los parámetros del modelo de lenguaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Tokens máximos</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperatura</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-prompt">Mensaje del sistema</Label>
              <Textarea
                id="system-prompt"
                placeholder="Instrucciones para el chatbot..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Este mensaje define el comportamiento general del chatbot
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Guardar configuración
        </Button>
      </div>
    </div>
  );
};

export default Settings;
