import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Settings, LogOut, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_authenticated");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    setIsMenuOpen(false);
    navigate("/admin/login");
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border/40 glass-morphism rounded-xl mb-4 relative z-[100]">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          ChatForce
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <span className="text-sm font-medium">Juan Pérez</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[150]"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border/40 z-[160]">
              <button
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => {
                  // Handle settings click
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Configuración</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
