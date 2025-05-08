import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Logout: React.FC = () => {
  useEffect(() => {
    // Remove authentication from localStorage
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("user_authenticated");

    // Show toast notification
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  }, []);

  // Redirect to login page
  return <Navigate to="/admin/login" replace />;
};

export default Logout;
