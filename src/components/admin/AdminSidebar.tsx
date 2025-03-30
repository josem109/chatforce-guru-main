
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, MessageSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { 
    name: 'Usuarios', 
    path: '/admin/users', 
    icon: Users 
  },
  { 
    name: 'Conversaciones', 
    path: '/admin/conversations', 
    icon: MessageSquare 
  },
  { 
    name: 'Configuración', 
    path: '/admin/settings', 
    icon: Settings 
  }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <aside className="w-64 h-screen bg-card shadow-lg fixed left-0 top-0 z-10 flex flex-col">
      <div className="p-6 border-b border-border/40">
        <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          ChatForce Admin
        </h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location.pathname === link.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary/50 text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border/40">
        <Link 
          to="/admin/logout"
          className="flex items-center p-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
