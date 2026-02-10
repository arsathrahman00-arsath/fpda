import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile header */}
      <MobileHeader />

      {/* Main content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
