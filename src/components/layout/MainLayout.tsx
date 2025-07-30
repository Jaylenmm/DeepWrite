import { ReactNode } from "react";
import { SessionProvider } from "@/lib/context/SessionContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex-1 min-h-screen bg-white text-slate-900 flex flex-col">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
} 