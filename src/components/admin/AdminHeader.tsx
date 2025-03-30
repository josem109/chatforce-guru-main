
import React from 'react';
import { MessageSquare } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-lg font-medium">Panel de Administración</h1>
      </div>
      
      <div className="text-sm font-medium text-muted-foreground">
        ChatForce
      </div>
    </header>
  );
};

export default AdminHeader;
