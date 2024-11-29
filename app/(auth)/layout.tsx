import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  );
}
