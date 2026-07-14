"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("rc-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (!mounted) return <>{children}</>;
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          className: "!text-sm !rounded-xl !shadow-lg !border",
          duration: 5000,
        }}
      />
    </ThemeProvider>
  );
}
