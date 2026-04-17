// ─── Domain Types (matching backend interfaces) ───────────────────────────────

export interface Clinic {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  workingHours: string;
  primaryColor: string;
  accentColor: string;
  upiId: string;
}

export interface Department {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  qualifications: string;
  specialization: string;
  departmentId: string;
  experience: bigint;
  consultationFee: bigint;
  availableDays: string[];
  isTodayAvailable: boolean;
  photoUrl: string;
  bio: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: bigint;
  gender: string;
  address: string;
  createdAt: bigint;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  date: string;
  timeWindow: string;
  status: string;
  reason: string;
  queuePosition: bigint;
  paymentMethod: string;
  paymentStatus: string;
  amount: bigint;
  discount: bigint;
  couponCode: string;
  suggestedDate: string;
  suggestedTime: string;
  createdAt: bigint;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: bigint;
  method: string;
  status: string;
  createdAt: bigint;
}

export interface Coupon {
  id: string;
  clinicId: string;
  code: string;
  discountType: string;
  discountValue: bigint;
  maxUses: bigint;
  usedCount: bigint;
  expiryDate: string;
  isActive: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  fileName: string;
  fileType: string;
  uploadedAt: bigint;
}

export interface Review {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  rating: bigint;
  comment: string;
  date: string;
}

export interface Staff {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
}

// ─── Enums ───────────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "SuggestedNewTime"
  | "Completed";

export type PaymentStatus = "Pending" | "Received" | "Waived";
export type PaymentMethod = "UPI" | "PayAtClinic";
export type StaffRole = "Owner" | "Receptionist" | "Doctor";
export type Language = "en" | "hi" | "bn";
export type TimeWindow = "Morning" | "Afternoon" | "Evening";

// ─── Session Types ────────────────────────────────────────────────────────────

export interface PatientSession {
  patientId: string;
  name: string;
  phone: string;
  email: string;
}

export interface AdminSession {
  email: string;
}
