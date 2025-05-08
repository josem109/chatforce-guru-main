import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu nombre de usuario y contraseña",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // For demonstration - in production, this would be a real API call
    setTimeout(() => {
      // Mock credentials check - would be done on server in production
      if (username === "admin" && password === "admin123") {
        // Store auth token or session - in production use secure methods
        localStorage.setItem("admin_authenticated", "true");
        localStorage.removeItem("user_authenticated");

        toast({
          title: "Éxito",
          description: "Inicio de sesión exitoso como administrador",
        });

        // Redirect to admin dashboard
        navigate("/admin/users");
      } else if (username === "user" && password === "user123") {
        // Store auth token or session - in production use secure methods
        localStorage.setItem("user_authenticated", "true");
        localStorage.removeItem("admin_authenticated");

        toast({
          title: "Éxito",
          description: "Inicio de sesión exitoso como usuario",
        });

        // Redirect to user chat
        navigate("/chat");
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales inválidas. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass-morphism rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-lg mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            ChatForce
          </h1>
          <p className="text-muted-foreground mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nombre de usuario
            </label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="admin o user"
                autoComplete="username"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Use "admin" / "admin123" para acceso de administrador</p>
          <p>Use "user" / "user123" para acceso de usuario</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
