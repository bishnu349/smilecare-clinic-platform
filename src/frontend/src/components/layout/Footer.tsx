import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const currentYear = new Date().getFullYear();
const hostname =
  typeof window !== "undefined" ? window.location.hostname : "smilecare.in";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground fill-current" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">
                  SmileCare Clinic
                </p>
                <p className="text-xs text-muted-foreground">
                  Multi-speciality Clinic, Kolkata
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your health is our priority. Delivering compassionate, expert care
              since 2018.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Departments", to: "/departments" },
                { label: "Our Doctors", to: "/doctors" },
                { label: "Reviews", to: "/reviews" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Departments
            </h3>
            <ul className="space-y-2">
              {[
                "General Medicine",
                "Dentistry",
                "Skin Care & Dermatology",
                "Health Check-ups",
                "Diagnostics",
              ].map((dept) => (
                <li key={dept} className="text-sm text-muted-foreground">
                  {dept}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  12B, Park Street, Kolkata, West Bengal 700016
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:info@smilecare.in"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  info@smilecare.in
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Hours:</span>{" "}
                Mon–Sat, 9 AM – 8 PM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SmileCare Clinic. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
