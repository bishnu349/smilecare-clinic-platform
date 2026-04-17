import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Heart, Info, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ADMIN_PASSWORD = "Admin@1234";

export default function AdminLoginPage() {
  const { loginAdmin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAdminLoggedIn) {
    navigate({ to: "/admin" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    if (email === "admin@smilecare.in" && password === ADMIN_PASSWORD) {
      loginAdmin(email);
      navigate({ to: "/admin" });
    } else {
      setError("Invalid credentials. Try admin@smilecare.in / Admin@1234");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
            <Heart className="w-7 h-7 fill-current text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            SmileCare Admin
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to manage your clinic
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-elevated p-8 space-y-6">
          {/* Demo credentials info */}
          <div
            className="flex gap-3 p-3.5 rounded-xl border"
            style={{
              background: "oklch(0.96 0.02 178)",
              borderColor: "oklch(0.89 0.012 178)",
            }}
            data-ocid="admin_login.demo_info"
          >
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Demo credentials</p>
              <p className="text-muted-foreground mt-0.5">
                admin@smilecare.in / Admin@1234
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20"
              data-ocid="admin_login.error_state"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smilecare.in"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  required
                  data-ocid="admin_login.email_input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  required
                  data-ocid="admin_login.password_input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-medium text-sm transition-smooth hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-subtle"
              data-ocid="admin_login.submit_button"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} SmileCare Clinic. All rights reserved.
        </p>
      </div>
    </div>
  );
}
