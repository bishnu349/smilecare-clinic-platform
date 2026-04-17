import { Link } from "@tanstack/react-router";
import { ChevronDown, Globe, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { useTranslation } from "../../i18n/translations";
import type { Language } from "../../types";

const navLinks = [
  { key: "nav_home" as const, to: "/" },
  { key: "nav_about" as const, to: "/about" },
  { key: "nav_departments" as const, to: "/departments" },
  { key: "nav_doctors" as const, to: "/doctors" },
  { key: "nav_contact" as const, to: "/contact" },
  { key: "nav_reviews" as const, to: "/reviews" },
];

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "bn", label: "বা" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage } = useClinic();
  const { t } = useTranslation(language);

  const currentLang =
    languages.find((l) => l.code === language) ?? languages[0];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.logo"
          >
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-md transition-smooth group-hover:scale-105">
              <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-lg text-foreground leading-tight">
              SmileCare
              <br />
              <span className="text-xs font-medium text-muted-foreground leading-none">
                Clinic
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                activeProps={{
                  className: "text-primary font-semibold bg-primary/8",
                }}
                data-ocid={`nav.${link.key}`}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                data-ocid="nav.language_switcher"
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLang.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-elevated py-1 min-w-[90px] z-50">
                  {languages.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm transition-smooth hover:bg-muted/60 ${
                        language === lang.code
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      }`}
                      data-ocid={`nav.lang.${lang.code}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/smilecare/book"
              search={{ doctorId: "" }}
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm shadow-gold hover:bg-accent/90 transition-smooth"
              data-ocid="nav.book_button"
            >
              {t("nav_book")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1"
          data-ocid="nav.mobile_menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              activeProps={{
                className: "text-primary font-semibold bg-primary/8",
              }}
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                  language === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Link
            to="/smilecare/book"
            search={{ doctorId: "" }}
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm mt-2"
            data-ocid="nav.mobile_book_button"
          >
            {t("nav_book")}
          </Link>
        </div>
      )}
    </nav>
  );
}
