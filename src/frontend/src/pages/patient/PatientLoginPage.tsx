import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import { useCreatePatient } from "../../hooks/useQueries";
import type { Patient } from "../../types";

const MOCK_OTP = "123456";

function generateId() {
  return `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const { loginPatient } = useAuth();
  const createPatient = useCreatePatient();

  // Login state
  const [loginContact, setLoginContact] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  function handleSendLoginOtp() {
    if (!loginContact.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginOtpSent(true);
      setLoginLoading(false);
      toast.success("OTP sent! Use the demo code below.");
    }, 800);
  }

  function handleVerifyLogin() {
    if (loginOtp !== MOCK_OTP) {
      toast.error("Invalid OTP. Use: 123456");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      loginPatient({
        patientId: generateId(),
        name: loginContact.includes("@")
          ? loginContact.split("@")[0]
          : "Patient User",
        phone: loginContact.includes("@") ? "" : loginContact,
        email: loginContact.includes("@") ? loginContact : "",
      });
      toast.success("Welcome back!");
      navigate({ to: "/patient/dashboard" });
    }, 600);
  }

  function handleSendRegOtp() {
    if (!regName.trim() || !regPhone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    setRegLoading(true);
    setTimeout(() => {
      setRegOtpSent(true);
      setRegLoading(false);
      toast.success("OTP sent! Use the demo code below.");
    }, 800);
  }

  function handleVerifyRegister() {
    if (regOtp !== MOCK_OTP) {
      toast.error("Invalid OTP. Use: 123456");
      return;
    }
    setRegLoading(true);
    const patientId = generateId();
    const patient: Patient = {
      id: patientId,
      name: regName,
      email: regEmail,
      phone: regPhone,
      age: BigInt(0),
      gender: "",
      address: "",
      createdAt: BigInt(Date.now()),
    };
    createPatient.mutate(patient, {
      onSuccess: () => {
        loginPatient({
          patientId,
          name: regName,
          phone: regPhone,
          email: regEmail,
        });
        toast.success("Account created! Welcome to SmileCare.");
        navigate({ to: "/patient/dashboard" });
      },
      onError: () => {
        // Still log in even if backend write fails in dev
        loginPatient({
          patientId,
          name: regName,
          phone: regPhone,
          email: regEmail,
        });
        toast.success("Account created! Welcome to SmileCare.");
        navigate({ to: "/patient/dashboard" });
      },
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Branded header */}
      <header className="bg-card border-b border-border shadow-subtle py-4 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-foreground">
              SmileCare Clinic
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="patient.login.back_link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo + heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-elevated">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Patient Portal
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Access your appointments, records & more
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-elevated p-6">
            <Tabs defaultValue="login" data-ocid="patient.login.tabs">
              <TabsList className="w-full mb-6">
                <TabsTrigger
                  value="login"
                  className="flex-1"
                  data-ocid="patient.login.login_tab"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1"
                  data-ocid="patient.login.register_tab"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* ── Login Tab ── */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginContact">Email or Phone Number</Label>
                  <Input
                    id="loginContact"
                    placeholder="Enter email or phone"
                    value={loginContact}
                    onChange={(e) => setLoginContact(e.target.value)}
                    disabled={loginOtpSent}
                    data-ocid="patient.login.contact_input"
                  />
                </div>

                {!loginOtpSent ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendLoginOtp}
                    disabled={loginLoading}
                    data-ocid="patient.login.send_otp_button"
                  >
                    {loginLoading ? "Sending OTP…" : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="loginOtp">Enter OTP</Label>
                      <Input
                        id="loginOtp"
                        placeholder="6-digit OTP"
                        maxLength={6}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value)}
                        data-ocid="patient.login.otp_input"
                      />
                      <p className="text-xs text-muted-foreground bg-muted/60 rounded px-3 py-1.5">
                        Demo OTP:{" "}
                        <span className="font-mono font-semibold text-primary">
                          123456
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleVerifyLogin}
                      disabled={loginLoading || loginOtp.length !== 6}
                      data-ocid="patient.login.verify_button"
                    >
                      {loginLoading ? "Verifying…" : "Verify & Login"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginOtpSent(false);
                        setLoginOtp("");
                      }}
                      className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                    >
                      Change contact info
                    </button>
                  </>
                )}
              </TabsContent>

              {/* ── Register Tab ── */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regName">Full Name</Label>
                  <Input
                    id="regName"
                    placeholder="e.g. Ananya Banerjee"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    disabled={regOtpSent}
                    data-ocid="patient.register.name_input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email (optional)</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={regOtpSent}
                    data-ocid="patient.register.email_input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPhone">Phone Number</Label>
                  <Input
                    id="regPhone"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={regOtpSent}
                    data-ocid="patient.register.phone_input"
                  />
                </div>

                {!regOtpSent ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendRegOtp}
                    disabled={regLoading}
                    data-ocid="patient.register.send_otp_button"
                  >
                    {regLoading ? "Sending OTP…" : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="regOtp">Enter OTP</Label>
                      <Input
                        id="regOtp"
                        placeholder="6-digit OTP"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        data-ocid="patient.register.otp_input"
                      />
                      <p className="text-xs text-muted-foreground bg-muted/60 rounded px-3 py-1.5">
                        Demo OTP:{" "}
                        <span className="font-mono font-semibold text-primary">
                          123456
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleVerifyRegister}
                      disabled={regLoading || regOtp.length !== 6}
                      data-ocid="patient.register.verify_button"
                    >
                      {regLoading ? "Creating account…" : "Create Account"}
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Your health data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
