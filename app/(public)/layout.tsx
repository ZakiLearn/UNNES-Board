import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-4 relative overflow-hidden">
      {/* Decorative Neo Brutalist Boxes */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-orange border-2 border-neo-black shadow-neo -rotate-6 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-sky border-2 border-neo-black shadow-neo rotate-12 hidden md:block" />

      {/* Auth Card Container */}
      <div className="w-full max-w-md neo-card bg-white p-8 z-10">
        {children}
      </div>
    </div>
  );
}
