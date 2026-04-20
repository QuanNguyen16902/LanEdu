import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Topbar } from './Topbar';
import { ManagementSidebar } from './ManagementSidebar';

export function Layout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        <ManagementSidebar />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
