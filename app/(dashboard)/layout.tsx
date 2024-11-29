import React, { Children } from "react";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      {/* header */}
      <header className="fixed md:pl-56 w-full h-20 inset-y-0 z-50">
        <Navbar />
      </header>

      {/* sidebar */}
      <div className="hidden fixed inset-y-0 md:flex flex-col w-56 z-50">
        <Sidebar />
      </div>

      <main className="md:pl-56 md:pt-20 h-full">{children}</main>
    </div>
  );
}
