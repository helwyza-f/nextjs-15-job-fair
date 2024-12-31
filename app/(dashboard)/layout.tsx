"use client";
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
      <header className="fixed inset-y-0 z-50 h-20 w-full md:pl-56">
        <Navbar />
      </header>

      {/* sidebar */}
      <div className="fixed inset-y-0 z-50 hidden w-56 flex-col md:flex">
        <Sidebar onLinkClick={() => {}} />
      </div>

      <main className="h-full md:pl-56 md:pt-20">{children}</main>
    </div>
  );
}
