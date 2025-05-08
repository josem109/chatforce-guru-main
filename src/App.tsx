import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Regular App Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Pages
import Login from "./pages/admin/Login";
import Users from "./pages/admin/Users";
import Conversations from "./pages/admin/Conversations";
import Settings from "./pages/admin/Settings";
import Logout from "./pages/admin/Logout";
import AdminLayout from "./layouts/AdminLayout";
import Roles from "./pages/admin/Roles";
import Chatbot from "./pages/admin/Chatbot";

const queryClient = new QueryClient();

// Admin Auth Guard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated =
    localStorage.getItem("admin_authenticated") === "true";
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

// User Auth Guard
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user_authenticated") === "true";
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Root redirect to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* User Chat Route */}
        <Route
          path="/chat"
          element={
            <UserRoute>
              <Index />
            </UserRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
