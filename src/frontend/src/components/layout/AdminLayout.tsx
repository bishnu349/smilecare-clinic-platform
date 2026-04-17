import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Stethoscope,
  Tag,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Appointments", to: "/admin/appointments", icon: Calendar },
  { label: "Doctors", to: "/admin/doctors", icon: Stethoscope },
  { label: "Patients", to: "/admin/patients", icon: Users },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Coupons", to: "/admin/coupons", icon: Tag },
  { label: "Staff", to: "/admin/staff", icon: Shield },
  { label: "WhatsApp", to: "/admin/whatsapp", icon: MessageSquare },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminSession, logoutAdmin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden w-full h-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "oklch(var(--sidebar))" }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between h-16 px-5 border-b"
          style={{ borderColor: "oklch(var(--sidebar-border))" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Heart
                className="w-3.5 h-3.5 fill-current"
                style={{ color: "oklch(var(--primary-foreground))" }}
              />
            </div>
            <div>
              <p
                className="font-display font-bold text-sm"
                style={{ color: "oklch(var(--sidebar-foreground))" }}
              >
                SmileCare
              </p>
              <p
                className="text-xs opacity-60"
                style={{ color: "oklch(var(--sidebar-foreground))" }}
              >
                Admin Panel
              </p>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden p-1 rounded opacity-70 hover:opacity-100 transition-smooth"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{ color: "oklch(var(--sidebar-foreground))" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group"
              style={{ color: "oklch(var(--sidebar-foreground) / 0.75)" }}
              activeProps={{
                style: {
                  background: "oklch(var(--sidebar-accent))",
                  color: "oklch(var(--sidebar-primary))",
                },
              }}
              data-ocid={`admin.nav.${link.label.toLowerCase().replace(" ", "_")}`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{link.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-smooth" />
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "oklch(var(--sidebar-border))" }}
        >
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              navigate({ to: "/admin/login" });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth"
            style={{ color: "oklch(var(--sidebar-foreground) / 0.75)" }}
            data-ocid="admin.logout_button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-subtle h-16 flex items-center px-4 sm:px-6 gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            data-ocid="admin.sidebar_toggle"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                Administrator
              </p>
              <p className="text-xs text-muted-foreground">
                {adminSession?.email}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              <UserRound className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
