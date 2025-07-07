"use client";
import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 dark:bg-gray-950 min-h-screen">
      {children}
    </div>
  );
} 