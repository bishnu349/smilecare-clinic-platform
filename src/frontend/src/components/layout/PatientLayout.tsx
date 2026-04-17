import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Dashboard", to: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Appointments", to: "/patient/appointments", icon: Calendar },
  { label: "Medical Records", to: "/patient/records", icon: FileText },
  { label: "My Profile", to: "/patient/profile", icon: UserRound },
];

export function PatientLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { patientSession, logoutPatient, isPatientLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isPatientLoggedIn) {
    navigate({ to: "/patient/login" });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-foreground text-sm hidden sm:block">
              SmileCare Clinic
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                activeProps={{
                  className: "text-primary font-semibold bg-primary/8",
                }}
                data-ocid={`patient.nav.${link.label.toLowerCase().replace(" ", "_")}`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 md:flex-none" />

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {patientSession?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {patientSession?.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                logoutPatient();
                navigate({ to: "/patient/login" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              data-ocid="patient.logout_button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                activeProps={{
                  className: "text-primary font-semibold bg-primary/8",
                }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                logoutPatient();
                navigate({ to: "/patient/login" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SmileCare Clinic. Your health data is
          secure.
        </p>
      </footer>
    </div>
  );
}
