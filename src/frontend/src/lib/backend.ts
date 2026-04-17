import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type {
  Appointment,
  Clinic,
  Coupon,
  Department,
  Doctor,
  MedicalRecord,
  Patient,
  Payment,
  Review,
} from "../types";

// ─── Actor Helper ─────────────────────────────────────────────────────────────

function useBackend() {
  return useActor(createActor);
}

export { useBackend };

// ─── Typed API wrappers (direct backend calls, no caching here) ───────────────

export async function getClinicInfo(actor: ReturnType<typeof createActor>): Promise<Clinic | null> {
  return actor.getClinicInfo();
}

export async function getDepartments(actor: ReturnType<typeof createActor>): Promise<Department[]> {
  return actor.getDepartments();
}

export async function getDoctors(actor: ReturnType<typeof createActor>): Promise<Doctor[]> {
  return actor.getDoctors();
}

export async function getDoctorsByDepartment(
  actor: ReturnType<typeof createActor>,
  departmentId: string
): Promise<Doctor[]> {
  return actor.getDoctorsByDepartment(departmentId);
}

export async function getPatients(actor: ReturnType<typeof createActor>): Promise<Patient[]> {
  return actor.getPatients();
}

export async function getPatient(
  actor: ReturnType<typeof createActor>,
  patientId: string
): Promise<Patient | null> {
  return actor.getPatient(patientId);
}

export async function createPatient(
  actor: ReturnType<typeof createActor>,
  patient: Patient
): Promise<string> {
  return actor.createPatient(patient);
}

export async function updatePatient(
  actor: ReturnType<typeof createActor>,
  patient: Patient
): Promise<boolean> {
  return actor.updatePatient(patient);
}

export async function getAppointments(actor: ReturnType<typeof createActor>): Promise<Appointment[]> {
  return actor.getAppointments();
}

export async function getAppointmentsByPatient(
  actor: ReturnType<typeof createActor>,
  patientId: string
): Promise<Appointment[]> {
  return actor.getAppointmentsByPatient(patientId);
}

export async function getTodayAppointments(
  actor: ReturnType<typeof createActor>,
  date: string
): Promise<Appointment[]> {
  return actor.getTodayAppointments(date);
}

export async function createAppointment(
  actor: ReturnType<typeof createActor>,
  appointment: Appointment
): Promise<string> {
  return actor.createAppointment(appointment);
}

export async function updateAppointmentStatus(
  actor: ReturnType<typeof createActor>,
  id: string,
  status: string,
  suggestedDate: string,
  suggestedTime: string
): Promise<boolean> {
  return actor.updateAppointmentStatus(id, status, suggestedDate, suggestedTime);
}

export async function getReviews(actor: ReturnType<typeof createActor>): Promise<Review[]> {
  return actor.getReviews();
}

export async function addReview(
  actor: ReturnType<typeof createActor>,
  review: Review
): Promise<string> {
  return actor.addReview(review);
}

export async function getCoupons(actor: ReturnType<typeof createActor>): Promise<Coupon[]> {
  return actor.getCoupons();
}

export async function validateCoupon(
  actor: ReturnType<typeof createActor>,
  code: string
): Promise<Coupon | null> {
  return actor.validateCoupon(code);
}

export async function createCoupon(
  actor: ReturnType<typeof createActor>,
  coupon: Coupon
): Promise<string> {
  return actor.createCoupon(coupon);
}

export async function updateCoupon(
  actor: ReturnType<typeof createActor>,
  coupon: Coupon
): Promise<boolean> {
  return actor.updateCoupon(coupon);
}

export async function getPayments(actor: ReturnType<typeof createActor>): Promise<Payment[]> {
  return actor.getPayments();
}

export async function createPayment(
  actor: ReturnType<typeof createActor>,
  payment: Payment
): Promise<string> {
  return actor.createPayment(payment);
}

export async function updatePaymentStatus(
  actor: ReturnType<typeof createActor>,
  id: string,
  status: string
): Promise<boolean> {
  return actor.updatePaymentStatus(id, status);
}

export async function getMedicalRecords(
  actor: ReturnType<typeof createActor>,
  patientId: string
): Promise<MedicalRecord[]> {
  return actor.getMedicalRecords(patientId);
}

export async function addMedicalRecord(
  actor: ReturnType<typeof createActor>,
  record: MedicalRecord
): Promise<string> {
  return actor.addMedicalRecord(record);
}

export async function updateDoctor(
  actor: ReturnType<typeof createActor>,
  doctor: Doctor
): Promise<boolean> {
  return actor.updateDoctor(doctor);
}

export async function createDoctor(
  actor: ReturnType<typeof createActor>,
  doctor: Doctor
): Promise<string> {
  return actor.createDoctor(doctor);
}

export async function deleteDoctor(
  actor: ReturnType<typeof createActor>,
  id: string
): Promise<boolean> {
  return actor.deleteDoctor(id);
}

export async function updateClinicInfo(
  actor: ReturnType<typeof createActor>,
  clinic: Clinic
): Promise<boolean> {
  return actor.updateClinicInfo(clinic);
}
