"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Quotes", icon: FileText, href: "/quotes" },
  { label: "Growth", icon: GrowthIcon, href: "/growth" },
  { label: "Invoice Chaser", icon: DollarSign, href: "/invoices" },
  { label: "Active Jobs", icon: ClipboardList, href: "/" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Helper to determine if a nav item is active
  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleNavClick = (label: string) => {
    alert(`Navigating to ${label} page (placeholder)`);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-navy-elevated p-2 rounded-lg border border-navy-border"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-navy-surface border-t border-navy-border flex justify-around py-2 px-1">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              isActive(item.href)
                ? "text-amber"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-navy-surface border-r border-navy-border min-h-screen transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-navy" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-heading font-bold text-lg leading-tight text-white">
                Tradie<span className="text-amber">Pilot</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Profit Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-amber/10 text-amber border border-amber/20"
                  : "text-gray-400 hover:text-white hover:bg-navy-elevated border border-transparent"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-navy-border">
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors hover:bg-navy-elevated"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
