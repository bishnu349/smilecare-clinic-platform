import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
