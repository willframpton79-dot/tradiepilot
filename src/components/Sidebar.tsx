"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Menu,
  X,
  Receipt,
  DollarSign,
  TrendingUp as GrowthIcon,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Quotes", icon: FileText, href: "/quotes" },
  { label: "Growth", icon: GrowthIcon, href: "/growth" },
  { label: "Invoice Chaser", icon: DollarSign, href: "/invoices" },
  { label: "Active Jobs", icon: ClipboardList, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide sidebar on landing page, login, and signup
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";
  if (isAuthPage) return null;

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg border border-border shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-border flex justify-around py-2 px-1">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              isActive(item.href) ? "text-indigo" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        {session && (
          <button
            onClick={() => signOut()}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-border min-h-screen transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-heading font-semibold text-lg leading-tight text-slate-800">
                Tradie<span className="text-indigo">Pilot</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                Profit Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-slate-100 text-indigo border-l-4 border-indigo rounded-l-none -ml-3 pl-5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive(item.href) ? 'text-indigo' : 'text-slate-500'}`} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User & Logout */}
        {session && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center shrink-0 border border-indigo/20">
                <span className="text-xs font-bold text-indigo">
                  {session.user?.name?.charAt(0) || "J"}
                </span>
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {session.user?.name || "Joe Tradie"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {session.user?.email || ""}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border text-center">
          <button
            onClick={toggleCollapsed}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors inline-block"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}
