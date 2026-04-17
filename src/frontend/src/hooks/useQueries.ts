import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

function useBackendActor() {
  return useActor(createActor);
}

// ─── Clinic ───────────────────────────────────────────────────────────────────

export function useClinicInfo() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Clinic | null>({
    queryKey: ["clinicInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClinicInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateClinicInfo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (clinic: Clinic) => {
      if (!actor) throw new Error("No actor");
      return actor.updateClinicInfo(clinic);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clinicInfo"] }),
  });
}

// ─── Departments ──────────────────────────────────────────────────────────────

export function useDepartments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDepartments();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export function useDoctors() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoctors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDoctorsByDepartment(departmentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Doctor[]>({
    queryKey: ["doctors", "department", departmentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoctorsByDepartment(departmentId);
    },
    enabled: !!actor && !isFetching && !!departmentId,
  });
}

export function useCreateDoctor() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doctor: Doctor) => {
      if (!actor) throw new Error("No actor");
      return actor.createDoctor(doctor);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useUpdateDoctor() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doctor: Doctor) => {
      if (!actor) throw new Error("No actor");
      return actor.updateDoctor(doctor);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useDeleteDoctor() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteDoctor(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export function usePatients() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePatient(patientId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Patient | null>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useCreatePatient() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patient: Patient) => {
      if (!actor) throw new Error("No actor");
      return actor.createPatient(patient);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useUpdatePatient() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patient: Patient) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePatient(patient);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function useAppointments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAppointmentsByPatient(patientId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Appointment[]>({
    queryKey: ["appointments", "patient", patientId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAppointmentsByPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useTodayAppointments(date: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Appointment[]>({
    queryKey: ["appointments", "today", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTodayAppointments(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useCreateAppointment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error("No actor");
      return actor.createAppointment(appointment);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      suggestedDate,
      suggestedTime,
    }: {
      id: string;
      status: string;
      suggestedDate: string;
      suggestedTime: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateAppointmentStatus(
        id,
        status,
        suggestedDate,
        suggestedTime,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useReviews() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReview() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error("No actor");
      return actor.addReview(review);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useCoupons() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCoupons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useValidateCoupon() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("No actor");
      return actor.validateCoupon(code);
    },
  });
}

export function useCreateCoupon() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: Coupon) => {
      if (!actor) throw new Error("No actor");
      return actor.createCoupon(coupon);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUpdateCoupon() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: Coupon) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCoupon(coupon);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function usePayments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Payment) => {
      if (!actor) throw new Error("No actor");
      return actor.createPayment(payment);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePaymentStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

// ─── Medical Records ──────────────────────────────────────────────────────────

export function useMedicalRecords(patientId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MedicalRecord[]>({
    queryKey: ["medicalRecords", patientId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMedicalRecords(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddMedicalRecord() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: MedicalRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.addMedicalRecord(record);
    },
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({
        queryKey: ["medicalRecords", variables.patientId],
      }),
  });
}
