import React from "react";
import NavbarRoutes from "./navbar-routes";
import MobileSidebar from "./mobile-sidebar";
export default function Navbar() {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-md">
      {/* Mobile routes */}
      <MobileSidebar />
      {/* Desktop routes */}
      <NavbarRoutes />
    </div>
  );
}
