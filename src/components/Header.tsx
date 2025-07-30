"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    checkSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      listener?.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.replace("/signin");
  };

  return (
    <header className="w-full border-b border-slate-100 py-4 px-4 sm:px-8 flex items-center justify-between bg-white sticky top-0 z-10">
      <Link href="/" className="logo-5 relative" style={{ fontSize: '1.8rem', fontWeight: 500, color: '#1a1a1a', letterSpacing: '-0.02em', position: 'relative', display: 'inline-block' }}>
        DeepWrite
        <span style={{ content: "''", position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, #c0c0c0 0%, #e9ecef 100%)', borderRadius: '2px', display: 'block', zIndex: 1 }} aria-hidden="true" />
      </Link>
      <nav className="hidden md:flex items-center space-x-8 text-base">
        <Link href="#features" className="text-slate-700 hover:underline underline-offset-4 transition-colors">Features</Link>
        <Link href="#pricing" className="text-slate-700 hover:underline underline-offset-4 transition-colors">Pricing</Link>
        <Link href="#faq" className="text-slate-700 hover:underline underline-offset-4 transition-colors">FAQ</Link>
      </nav>
      <div className="flex items-center space-x-3">
        {!user ? (
          <Link href="/signin" className="px-6 py-2 rounded-xl bg-black text-white font-medium text-base shadow hover:bg-slate-800 transition-colors">Sign In</Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-6 py-2 rounded-xl bg-slate-100 text-black font-medium text-base shadow hover:bg-slate-200 transition-colors"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Account
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                <Link href="/editor" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-t-xl" onClick={() => setDropdownOpen(false)}>Dashboard / Editor</Link>
                <Link href="/account" className="block px-4 py-3 text-slate-700 hover:bg-slate-50">Account</Link>
                <Link href="/billing" className="block px-4 py-3 text-slate-700 hover:bg-slate-50">Subscriptions & Billing</Link>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-b-xl">Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 