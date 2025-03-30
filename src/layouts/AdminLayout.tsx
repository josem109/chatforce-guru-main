
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="ml-64 min-h-screen">
        <AdminHeader />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default AdminLayout;
