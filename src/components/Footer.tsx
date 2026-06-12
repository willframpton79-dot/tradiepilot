"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Tradie<span className="text-indigo-400">Pilot</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 order-3 md:order-2">
            © {new Date().getFullYear()} TradiePilot. A product of Automation Layer. ABN 55 388 054 921.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 order-2 md:order-3">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:william@automation-layer.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
