import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  CloudSun,
  Moon,
  QrCode,
  Sun,
  Tag,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import {
  useCreateAppointment,
  useCreatePatient,
  useDoctors,
  useValidateCoupon,
} from "../../hooks/useQueries";
import { useTranslation } from "../../i18n/translations";
import type { Appointment, Doctor, Patient } from "../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeWindow = "Morning" | "Afternoon" | "Evening";
type Gender = "Male" | "Female" | "Other";
type PaymentMethod = "UPI" | "PayAtClinic";

interface BookingState {
  selectedDoctor: Doctor | null;
  selectedDate: string;
  selectedWindow: TimeWindow | null;
  patientDetails: {
    name: string;
    age: string;
    gender: Gender;
    phone: string;
    reason: string;
    address: string;
  };
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  discount: number;
  couponApplied: boolean;
  bookingId: string;
}

const INITIAL_STATE: BookingState = {
  selectedDoctor: null,
  selectedDate: "",
  selectedWindow: null,
  patientDetails: {
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    reason: "",
    address: "",
  },
  paymentMethod: null,
  couponCode: "",
  discount: 0,
  couponApplied: false,
  bookingId: "",
};

const STEPS = [
  "Select Doctor",
  "Date & Time",
  "Login",
  "Your Details",
  "Payment",
  "Coupon",
  "Confirmation",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDoctorInitials(name: string): string {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getNext30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      // exclude Sundays
      days.push(d.toISOString().split("T")[0]);
    }
  }
  return days;
}

function getMonthGrid(days: string[]): (string | null)[][] {
  if (!days.length) return [];
  const first = new Date(days[0]);
  const year = first.getFullYear();
  const month = first.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(dateStr);
  }
  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-smooth ${
                idx + 1 < current
                  ? "bg-primary text-primary-foreground"
                  : idx + 1 === current
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1 < current ? "✓" : idx + 1}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-1 flex-1 mx-1 rounded transition-smooth ${
                  idx + 1 < current ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-semibold text-primary mt-3">
        {STEPS[current - 1]}
      </p>
    </div>
  );
}

// ─── Step 1: Select Doctor ────────────────────────────────────────────────────

function Step1Doctor({
  selected,
  onSelect,
  onContinue,
}: {
  selected: Doctor | null;
  onSelect: (d: Doctor) => void;
  onContinue: () => void;
}) {
  const { data: doctors, isLoading } = useDoctors();

  return (
    <div className="space-y-6" data-ocid="booking.step1.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Select Your Doctor
      </h2>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(doctors ?? []).map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc)}
              data-ocid={`booking.doctor.${doc.id}`}
              className={`w-full text-left rounded-xl border-2 p-4 transition-smooth cursor-pointer ${
                selected?.id === doc.id
                  ? "border-primary bg-primary/5 shadow-elevated"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-lg">
                    {getDoctorInitials(doc.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-foreground">
                      {doc.name}
                    </span>
                    <Badge
                      variant={doc.isTodayAvailable ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {doc.isTodayAvailable ? "Available Today" : "Not Today"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doc.specialization} · {doc.qualifications}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-semibold text-primary">
                      ₹{doc.consultationFee.toString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Number(doc.experience)} yrs exp
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.availableDays.join(", ")}
                    </span>
                  </div>
                </div>
                {selected?.id === doc.id && (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      <Button
        className="w-full"
        disabled={!selected}
        onClick={onContinue}
        data-ocid="booking.step1.continue_button"
      >
        Continue
      </Button>
    </div>
  );
}

// ─── Step 2: Date & Time ──────────────────────────────────────────────────────

function Step2DateTime({
  selectedDate,
  selectedWindow,
  onDateSelect,
  onWindowSelect,
  onContinue,
}: {
  selectedDate: string;
  selectedWindow: TimeWindow | null;
  onDateSelect: (d: string) => void;
  onWindowSelect: (w: TimeWindow) => void;
  onContinue: () => void;
}) {
  const availableDays = getNext30Days();
  const today = new Date().toISOString().split("T")[0];
  const rows = getMonthGrid(availableDays);
  const currentMonthName = availableDays[0]
    ? new Date(availableDays[0]).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "";

  const windows: {
    id: TimeWindow;
    label: string;
    range: string;
    Icon: typeof Sun;
  }[] = [
    { id: "Morning", label: "Morning", range: "9:00 AM – 12:00 PM", Icon: Sun },
    {
      id: "Afternoon",
      label: "Afternoon",
      range: "12:00 PM – 5:00 PM",
      Icon: CloudSun,
    },
    { id: "Evening", label: "Evening", range: "5:00 PM – 8:00 PM", Icon: Moon },
  ];

  return (
    <div className="space-y-6" data-ocid="booking.step2.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Choose Appointment Date & Time
      </h2>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-center font-semibold text-foreground mb-4">
          {currentMonthName}
        </p>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={`row-${row.find(Boolean) ?? "empty"}`}
            className="grid grid-cols-7 gap-1"
          >
            {row.map((cell, ci) => {
              const cellKey = cell ?? `empty-${ci}`;
              if (!cell) return <div key={cellKey} className="p-2" />;
              const isAvail = availableDays.includes(cell);
              const isToday = cell === today;
              const isSelected = cell === selectedDate;
              return (
                <button
                  key={cell}
                  type="button"
                  disabled={!isAvail}
                  onClick={() => isAvail && onDateSelect(cell)}
                  className={`p-2 text-sm rounded-lg text-center transition-smooth ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-bold"
                      : isToday
                        ? "border border-primary text-primary font-semibold hover:bg-primary/10"
                        : isAvail
                          ? "text-foreground hover:bg-primary/10 hover:text-primary"
                          : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  {new Date(cell).getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Time Windows */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="font-medium text-foreground">Select Time Window</p>
          <div className="grid grid-cols-3 gap-3">
            {windows.map(({ id, label, range, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onWindowSelect(id)}
                data-ocid={`booking.time_window.${id.toLowerCase()}`}
                className={`p-3 rounded-xl border-2 text-center transition-smooth ${
                  selectedWindow === id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mx-auto mb-1 ${selectedWindow === id ? "text-primary" : "text-muted-foreground"}`}
                />
                <p
                  className={`text-sm font-semibold ${selectedWindow === id ? "text-primary" : "text-foreground"}`}
                >
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{range}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              Estimated wait: 2–3 patients ahead (queue-based)
            </p>
          </div>
        </motion.div>
      )}

      <Button
        className="w-full"
        disabled={!selectedDate || !selectedWindow}
        onClick={onContinue}
        data-ocid="booking.step2.continue_button"
      >
        Continue
      </Button>
    </div>
  );
}

// ─── Step 3: Auth ─────────────────────────────────────────────────────────────

function Step3Auth({ onContinue }: { onContinue: () => void }) {
  const { patientSession, loginPatient, isPatientLoggedIn } = useAuth();
  const createPatient = useCreatePatient();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtp, setRegOtp] = useState("");
  const [regError, setRegError] = useState("");

  if (isPatientLoggedIn && patientSession) {
    return (
      <div className="space-y-6" data-ocid="booking.step3.section">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Login or Create Account
        </h2>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            Welcome back, {patientSession.name}!
          </p>
          <p className="text-sm text-muted-foreground">
            {patientSession.email}
          </p>
        </div>
        <Button
          className="w-full"
          onClick={onContinue}
          data-ocid="booking.step3.continue_button"
        >
          Continue
        </Button>
      </div>
    );
  }

  function handleLoginOtp() {
    if (!loginEmail.trim()) {
      setLoginError("Please enter your email or phone");
      return;
    }
    setLoginOtpSent(true);
    setLoginError("");
  }

  function handleLoginVerify() {
    if (loginOtp !== "123456") {
      setLoginError("Invalid OTP. Use 123456 for demo.");
      return;
    }
    loginPatient({
      patientId: `P-${Date.now()}`,
      name: loginEmail.includes("@") ? loginEmail.split("@")[0] : "Patient",
      email: loginEmail.includes("@") ? loginEmail : "",
      phone: loginEmail.includes("@") ? "" : loginEmail,
    });
    setLoginError("");
    onContinue();
  }

  async function handleRegisterVerify() {
    if (regOtp !== "123456") {
      setRegError("Invalid OTP. Use 123456 for demo.");
      return;
    }
    if (!regName || !regEmail || !regPhone) {
      setRegError("All fields are required");
      return;
    }
    const newPatient: Patient = {
      id: `P-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone,
      age: BigInt(0),
      gender: "",
      address: "",
      createdAt: BigInt(Date.now()),
    };
    try {
      await createPatient.mutateAsync(newPatient);
    } catch {
      // backend error is non-blocking for demo
    }
    loginPatient({
      patientId: newPatient.id,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
    });
    setRegError("");
    onContinue();
  }

  return (
    <div className="space-y-6" data-ocid="booking.step3.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Login or Create Account
      </h2>

      {/* Tab Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-border">
        <button
          type="button"
          onClick={() => setTab("login")}
          data-ocid="booking.auth.login_tab"
          className={`flex-1 py-2.5 text-sm font-semibold transition-smooth ${
            tab === "login"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          data-ocid="booking.auth.register_tab"
          className={`flex-1 py-2.5 text-sm font-semibold transition-smooth ${
            tab === "register"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Register
        </button>
      </div>

      <p className="text-xs text-center text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
        🔐 Demo OTP:{" "}
        <span className="font-mono font-bold text-foreground">123456</span>
      </p>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">Email or Phone Number</Label>
              <Input
                id="login-email"
                placeholder="e.g. patient@email.com or 9876543210"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                data-ocid="booking.login.email_input"
              />
            </div>
            {!loginOtpSent ? (
              <Button
                className="w-full"
                onClick={handleLoginOtp}
                data-ocid="booking.login.send_otp_button"
              >
                Send OTP
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="login-otp">Enter OTP</Label>
                  <Input
                    id="login-otp"
                    placeholder="6-digit OTP"
                    value={loginOtp}
                    maxLength={6}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    data-ocid="booking.login.otp_input"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleLoginVerify}
                  data-ocid="booking.login.verify_button"
                >
                  Verify OTP & Continue
                </Button>
              </div>
            )}
            {loginError && (
              <p
                className="text-sm text-destructive"
                data-ocid="booking.login.error_state"
              >
                {loginError}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full Name</Label>
              <Input
                id="reg-name"
                placeholder="Your full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                data-ocid="booking.register.name_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                data-ocid="booking.register.email_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">Phone Number</Label>
              <Input
                id="reg-phone"
                placeholder="10-digit mobile number"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                data-ocid="booking.register.phone_input"
              />
            </div>
            {!regOtpSent ? (
              <Button
                className="w-full"
                onClick={() => setRegOtpSent(true)}
                data-ocid="booking.register.send_otp_button"
              >
                Send OTP
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-otp">Enter OTP</Label>
                  <Input
                    id="reg-otp"
                    placeholder="6-digit OTP"
                    value={regOtp}
                    maxLength={6}
                    onChange={(e) => setRegOtp(e.target.value)}
                    data-ocid="booking.register.otp_input"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleRegisterVerify}
                  disabled={createPatient.isPending}
                  data-ocid="booking.register.verify_button"
                >
                  {createPatient.isPending
                    ? "Creating account…"
                    : "Verify & Create Account"}
                </Button>
              </div>
            )}
            {regError && (
              <p
                className="text-sm text-destructive"
                data-ocid="booking.register.error_state"
              >
                {regError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 4: Patient Details ──────────────────────────────────────────────────

function Step4Details({
  details,
  onChange,
  onContinue,
}: {
  details: BookingState["patientDetails"];
  onChange: (d: BookingState["patientDetails"]) => void;
  onContinue: () => void;
}) {
  const { patientSession } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const detailsRef = useRef(details);
  detailsRef.current = details;

  useEffect(() => {
    if (patientSession) {
      onChangeRef.current({
        ...detailsRef.current,
        name: detailsRef.current.name || patientSession.name,
        phone: detailsRef.current.phone || patientSession.phone,
      });
    }
  }, [patientSession]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!details.name.trim()) e.name = "Name is required";
    if (!details.age || Number(details.age) <= 0)
      e.age = "Valid age is required";
    if (!details.phone.trim()) e.phone = "Phone is required";
    if (!details.reason.trim()) e.reason = "Reason for visit is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validate()) onContinue();
  }

  return (
    <div className="space-y-5" data-ocid="booking.step4.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Your Details
      </h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="pd-name">Full Name *</Label>
          <Input
            id="pd-name"
            value={details.name}
            onChange={(e) => onChange({ ...details, name: e.target.value })}
            placeholder="Enter your full name"
            data-ocid="booking.details.name_input"
          />
          {errors.name && (
            <p
              className="text-xs text-destructive"
              data-ocid="booking.details.name.field_error"
            >
              {errors.name}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="pd-age">Age *</Label>
            <Input
              id="pd-age"
              type="number"
              min={1}
              max={120}
              value={details.age}
              onChange={(e) => onChange({ ...details, age: e.target.value })}
              placeholder="Your age"
              data-ocid="booking.details.age_input"
            />
            {errors.age && (
              <p
                className="text-xs text-destructive"
                data-ocid="booking.details.age.field_error"
              >
                {errors.age}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Gender *</Label>
            <div className="flex gap-3 pt-2">
              {(["Male", "Female", "Other"] as Gender[]).map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={details.gender === g}
                    onChange={() => onChange({ ...details, gender: g })}
                    className="accent-primary"
                    data-ocid={`booking.details.gender_${g.toLowerCase()}`}
                  />
                  <span className="text-sm text-foreground">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pd-phone">Phone Number *</Label>
          <Input
            id="pd-phone"
            value={details.phone}
            onChange={(e) => onChange({ ...details, phone: e.target.value })}
            placeholder="10-digit mobile number"
            data-ocid="booking.details.phone_input"
          />
          {errors.phone && (
            <p
              className="text-xs text-destructive"
              data-ocid="booking.details.phone.field_error"
            >
              {errors.phone}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pd-reason">Reason for Visit *</Label>
          <Textarea
            id="pd-reason"
            value={details.reason}
            onChange={(e) => onChange({ ...details, reason: e.target.value })}
            placeholder="Briefly describe your symptoms or reason"
            rows={3}
            data-ocid="booking.details.reason_textarea"
          />
          {errors.reason && (
            <p
              className="text-xs text-destructive"
              data-ocid="booking.details.reason.field_error"
            >
              {errors.reason}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pd-address">Address (optional)</Label>
          <Input
            id="pd-address"
            value={details.address}
            onChange={(e) => onChange({ ...details, address: e.target.value })}
            placeholder="Your home address"
            data-ocid="booking.details.address_input"
          />
        </div>
      </div>
      <Button
        className="w-full"
        onClick={handleContinue}
        data-ocid="booking.step4.continue_button"
      >
        Continue
      </Button>
    </div>
  );
}

// ─── Step 5: Payment ──────────────────────────────────────────────────────────

function Step5Payment({
  selected,
  onSelect,
  onContinue,
  consultationFee,
}: {
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  onContinue: () => void;
  consultationFee: bigint;
}) {
  const { clinicInfo } = useClinic();
  const upiId = clinicInfo?.upiId ?? "smilecare@upi";

  return (
    <div className="space-y-6" data-ocid="booking.step5.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Payment Options
      </h2>
      <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Consultation Fee</span>
        <span className="text-xl font-bold text-primary">
          ₹{consultationFee.toString()}
        </span>
      </div>
      <div className="grid gap-4">
        {/* UPI */}
        <button
          type="button"
          onClick={() => onSelect("UPI")}
          data-ocid="booking.payment.upi_card"
          className={`w-full text-left rounded-xl border-2 p-5 transition-smooth ${
            selected === "UPI"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-foreground">UPI Payment</p>
              <p className="text-sm text-muted-foreground">
                Scan QR or use UPI ID to pay instantly
              </p>
              {selected === "UPI" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 space-y-3"
                >
                  <div className="w-36 h-36 border-2 border-primary/30 rounded-xl flex flex-col items-center justify-center bg-card gap-2">
                    <QrCode className="w-16 h-16 text-primary/60" />
                    <span className="text-xs text-muted-foreground">
                      QR Code
                    </span>
                  </div>
                  <div className="bg-muted/60 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">UPI ID</p>
                    <p className="font-mono font-bold text-foreground">
                      {upiId}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
            {selected === "UPI" && (
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            )}
          </div>
        </button>

        {/* Pay at Clinic */}
        <button
          type="button"
          onClick={() => onSelect("PayAtClinic")}
          data-ocid="booking.payment.pay_at_clinic_card"
          className={`w-full text-left rounded-xl border-2 p-5 transition-smooth ${
            selected === "PayAtClinic"
              ? "border-accent bg-accent/5"
              : "border-border bg-card hover:border-accent/40"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Pay at Clinic</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pay the consultation fee at reception on the day of your visit
              </p>
            </div>
            {selected === "PayAtClinic" && (
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
            )}
          </div>
        </button>
      </div>
      <Button
        className="w-full"
        disabled={!selected}
        onClick={onContinue}
        data-ocid="booking.step5.continue_button"
      >
        Continue
      </Button>
    </div>
  );
}

// ─── Step 6: Coupon ───────────────────────────────────────────────────────────

function Step6Coupon({
  consultationFee,
  couponCode,
  setCouponCode,
  discount,
  setDiscount,
  couponApplied,
  setCouponApplied,
  onContinue,
}: {
  consultationFee: bigint;
  couponCode: string;
  setCouponCode: (c: string) => void;
  discount: number;
  setDiscount: (d: number) => void;
  couponApplied: boolean;
  setCouponApplied: (a: boolean) => void;
  onContinue: () => void;
}) {
  const validateCoupon = useValidateCoupon();
  const [couponError, setCouponError] = useState("");
  const fee = Number(consultationFee);
  const total = Math.max(0, fee - discount);

  async function handleApply() {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      const result = await validateCoupon.mutateAsync(
        couponCode.trim().toUpperCase(),
      );
      if (result && typeof result === "object" && "discountValue" in result) {
        const coupon = result as {
          discountType: string;
          discountValue: bigint;
        };
        const val =
          coupon.discountType === "percentage"
            ? Math.floor((fee * Number(coupon.discountValue)) / 100)
            : Number(coupon.discountValue);
        setDiscount(val);
        setCouponApplied(true);
        setCouponError("");
      } else {
        setCouponError("Invalid or expired coupon code");
        setDiscount(0);
        setCouponApplied(false);
      }
    } catch {
      setCouponError("Invalid or expired coupon code");
      setDiscount(0);
      setCouponApplied(false);
    }
  }

  return (
    <div className="space-y-6" data-ocid="booking.step6.section">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Apply Coupon
      </h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 uppercase"
            placeholder="Enter coupon code (e.g. SAVE10)"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setCouponApplied(false);
              setDiscount(0);
              setCouponError("");
            }}
            data-ocid="booking.coupon.code_input"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={validateCoupon.isPending || !couponCode}
          data-ocid="booking.coupon.apply_button"
        >
          {validateCoupon.isPending ? "Checking…" : "Apply"}
        </Button>
      </div>

      {couponApplied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
          data-ocid="booking.coupon.success_state"
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-700 font-medium">
            Coupon applied! You save ₹{discount}
          </p>
        </motion.div>
      )}
      {couponError && (
        <p
          className="text-sm text-destructive"
          data-ocid="booking.coupon.error_state"
        >
          {couponError}
        </p>
      )}

      {/* Fee Summary */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <p className="font-semibold text-sm text-foreground">Fee Summary</p>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="text-foreground">₹{fee}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount ({couponCode})</span>
              <span className="text-green-600">-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-border pt-2">
            <span className="text-foreground">Total</span>
            <span className="text-primary text-lg">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={onContinue}
          data-ocid="booking.step6.continue_button"
        >
          Confirm Booking
        </Button>
        <button
          type="button"
          onClick={onContinue}
          className="text-sm text-muted-foreground hover:text-primary transition-colors text-center"
          data-ocid="booking.step6.skip_button"
        >
          Skip coupon and proceed
        </button>
      </div>
    </div>
  );
}

// ─── Step 7: Confirmation ─────────────────────────────────────────────────────

function Step7Confirmation({
  state,
  onReset,
}: {
  state: BookingState;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const createAppointment = useCreateAppointment();
  const { patientSession } = useAuth();
  const hasCreated = useRef(false);
  const stateSnap = useRef(state);
  const sessionSnap = useRef(patientSession);

  const fee = Number(state.selectedDoctor?.consultationFee ?? 0);
  const total = Math.max(0, fee - state.discount);

  useEffect(() => {
    const snap = stateSnap.current;
    const session = sessionSnap.current;
    if (hasCreated.current || !session || !snap.selectedDoctor) return;
    hasCreated.current = true;

    const apptFee = Number(snap.selectedDoctor.consultationFee ?? 0);
    const apptTotal = Math.max(0, apptFee - snap.discount);
    const appt: Appointment = {
      id: snap.bookingId,
      clinicId: "clinic-001",
      patientId: session.patientId,
      doctorId: snap.selectedDoctor.id,
      departmentId: snap.selectedDoctor.departmentId,
      date: snap.selectedDate,
      timeWindow: snap.selectedWindow ?? "Morning",
      status: "Pending",
      reason: snap.patientDetails.reason,
      queuePosition: BigInt(3),
      paymentMethod: snap.paymentMethod ?? "PayAtClinic",
      paymentStatus: "Pending",
      amount: BigInt(apptTotal),
      discount: BigInt(snap.discount),
      couponCode: snap.couponCode,
      suggestedDate: "",
      suggestedTime: "",
      createdAt: BigInt(Date.now()),
    };
    createAppointment.mutate(appt);
  }, [createAppointment]);

  return (
    <div className="space-y-6" data-ocid="booking.step7.section">
      {/* Success header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground text-sm">
          Your appointment request has been submitted successfully.
        </p>
      </div>

      {/* Booking details card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 gradient-primary">
          <div className="flex items-center justify-between">
            <p className="text-primary-foreground font-semibold text-sm">
              Booking Reference
            </p>
            <p className="text-primary-foreground font-mono font-bold">
              {state.bookingId}
            </p>
          </div>
        </div>
        <div className="px-5 py-4 space-y-3">
          <ConfirmRow
            label="Doctor"
            value={`${state.selectedDoctor?.name} · ${state.selectedDoctor?.specialization}`}
          />
          <ConfirmRow label="Date" value={formatDate(state.selectedDate)} />
          <ConfirmRow
            label="Time Window"
            value={`${state.selectedWindow} session`}
          />
          <ConfirmRow label="Patient" value={patientSession?.name ?? ""} />
          <ConfirmRow
            label="Payment Method"
            value={
              state.paymentMethod === "UPI" ? "UPI Payment" : "Pay at Clinic"
            }
          />
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground font-medium">
              Amount
            </span>
            <span className="text-primary font-bold">₹{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              Pending Approval
            </Badge>
          </div>
        </div>
      </div>

      {/* Queue info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-primary">
            Queue Information
          </p>
        </div>
        <p className="text-sm text-foreground">
          You are approximately <strong>3rd in queue</strong>. Estimated visit
          time: <strong>{formatDate(state.selectedDate)}</strong>{" "}
          <strong>({state.selectedWindow} session)</strong>.
        </p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <span className="text-xl">⏰</span>
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Please arrive{" "}
          <strong>15 minutes before</strong> your scheduled time slot for smooth
          check-in.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onReset}
          data-ocid="booking.confirmation.book_another_button"
        >
          Book Another
        </Button>
        <Button
          onClick={() => navigate({ to: "/patient/dashboard" })}
          data-ocid="booking.confirmation.dashboard_button"
        >
          Patient Dashboard
        </Button>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium text-right min-w-0 break-words">
        {value}
      </span>
    </div>
  );
}

// ─── Main Booking Page ────────────────────────────────────────────────────────

export default function BookingPage() {
  const { language } = useClinic();
  const { t } = useTranslation(language);

  // Read doctorId from URL search params via browser API (no validateSearch constraint)
  const urlDoctorId =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("doctorId") ?? "")
      : "";

  const { data: doctors } = useDoctors();

  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(INITIAL_STATE);

  // Auto-select doctor from URL param
  useEffect(() => {
    if (urlDoctorId && doctors && !state.selectedDoctor) {
      const found = doctors.find((d) => d.id === urlDoctorId);
      if (found) setState((s) => ({ ...s, selectedDoctor: found }));
    }
  }, [urlDoctorId, doctors, state.selectedDoctor]);

  function next() {
    setStep((s) => Math.min(s + 1, 7));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }
  function reset() {
    setState(INITIAL_STATE);
    setStep(1);
  }

  function goToStep7() {
    // Generate booking ID when reaching confirmation
    setState((s) => ({
      ...s,
      bookingId: `SMC-${String(Date.now()).slice(-6)}`,
    }));
    next();
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="booking.page">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              SC
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-sm leading-tight">
              SmileCare Clinic
            </p>
            <p className="text-xs text-muted-foreground">{t("book_title")}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <StepProgress current={step} />

        {/* Back button */}
        {step > 1 && step < 7 && (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="booking.back_button"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <Step1Doctor
                selected={state.selectedDoctor}
                onSelect={(d) => setState((s) => ({ ...s, selectedDoctor: d }))}
                onContinue={next}
              />
            )}
            {step === 2 && (
              <Step2DateTime
                selectedDate={state.selectedDate}
                selectedWindow={state.selectedWindow}
                onDateSelect={(d) =>
                  setState((s) => ({ ...s, selectedDate: d }))
                }
                onWindowSelect={(w) =>
                  setState((s) => ({ ...s, selectedWindow: w }))
                }
                onContinue={next}
              />
            )}
            {step === 3 && <Step3Auth onContinue={next} />}
            {step === 4 && (
              <Step4Details
                details={state.patientDetails}
                onChange={(d) => setState((s) => ({ ...s, patientDetails: d }))}
                onContinue={next}
              />
            )}
            {step === 5 && (
              <Step5Payment
                selected={state.paymentMethod}
                onSelect={(m) => setState((s) => ({ ...s, paymentMethod: m }))}
                onContinue={next}
                consultationFee={
                  state.selectedDoctor?.consultationFee ?? BigInt(0)
                }
              />
            )}
            {step === 6 && (
              <Step6Coupon
                consultationFee={
                  state.selectedDoctor?.consultationFee ?? BigInt(0)
                }
                couponCode={state.couponCode}
                setCouponCode={(c) =>
                  setState((s) => ({ ...s, couponCode: c }))
                }
                discount={state.discount}
                setDiscount={(d) => setState((s) => ({ ...s, discount: d }))}
                couponApplied={state.couponApplied}
                setCouponApplied={(a) =>
                  setState((s) => ({ ...s, couponApplied: a }))
                }
                onContinue={goToStep7}
              />
            )}
            {step === 7 && <Step7Confirmation state={state} onReset={reset} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
