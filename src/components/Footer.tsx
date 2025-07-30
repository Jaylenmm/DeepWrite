import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white py-6 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-base text-slate-700">
      <span
        className="logo-5 relative"
        style={{
          fontSize: '1.3rem',
          fontWeight: 500,
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        DeepWrite
        <span
          style={{
            content: "''",
            position: 'absolute',
            bottom: '-6px',
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #c0c0c0 0%, #e9ecef 100%)',
            borderRadius: '2px',
            display: 'block',
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      </span>
      <nav className="flex space-x-6">
        <Link href="#features" className="hover:underline underline-offset-4 transition-colors">Features</Link>
        <Link href="#pricing" className="hover:underline underline-offset-4 transition-colors">Pricing</Link>
        <Link href="#faq" className="hover:underline underline-offset-4 transition-colors">FAQ</Link>
      </nav>
      <div className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} DeepWrite. All rights reserved.</div>
    </footer>
  );
} 