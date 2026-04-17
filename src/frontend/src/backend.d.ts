import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MedicalRecord {
    id: string;
    patientId: string;
    fileName: string;
    fileType: string;
    appointmentId: string;
    uploadedAt: bigint;
}
export interface Department {
    id: string;
    clinicId: string;
    icon: string;
    name: string;
    description: string;
}
export interface Clinic {
    id: string;
    tagline: string;
    city: string;
    primaryColor: string;
    name: string;
    email: string;
    website: string;
    accentColor: string;
    workingHours: string;
    address: string;
    upiId: string;
    phone: string;
}
export interface Coupon {
    id: string;
    discountValue: bigint;
    expiryDate: string;
    clinicId: string;
    code: string;
    discountType: string;
    usedCount: bigint;
    isActive: boolean;
    maxUses: bigint;
}
export interface Doctor {
    id: string;
    bio: string;
    isTodayAvailable: boolean;
    clinicId: string;
    name: string;
    photoUrl: string;
    qualifications: string;
    experience: bigint;
    availableDays: Array<string>;
    specialization: string;
    consultationFee: bigint;
    departmentId: string;
}
export interface Payment {
    id: string;
    status: string;
    method: string;
    patientId: string;
    createdAt: bigint;
    amount: bigint;
    appointmentId: string;
}
export interface Appointment {
    id: string;
    status: string;
    doctorId: string;
    couponCode: string;
    paymentStatus: string;
    paymentMethod: string;
    patientId: string;
    clinicId: string;
    date: string;
    createdAt: bigint;
    queuePosition: bigint;
    suggestedDate: string;
    suggestedTime: string;
    discount: bigint;
    amount: bigint;
    departmentId: string;
    timeWindow: string;
    reason: string;
}
export interface Patient {
    id: string;
    age: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    address: string;
    gender: string;
    phone: string;
}
export interface Review {
    id: string;
    patientId: string;
    clinicId: string;
    date: string;
    comment: string;
    patientName: string;
    rating: bigint;
}
export interface backendInterface {
    addMedicalRecord(record: MedicalRecord): Promise<string>;
    addReview(review: Review): Promise<string>;
    createAppointment(appointment: Appointment): Promise<string>;
    createCoupon(coupon: Coupon): Promise<string>;
    createDoctor(doctor: Doctor): Promise<string>;
    createPatient(patient: Patient): Promise<string>;
    createPayment(payment: Payment): Promise<string>;
    deleteDoctor(id: string): Promise<boolean>;
    getAppointments(): Promise<Array<Appointment>>;
    getAppointmentsByDoctor(doctorId: string): Promise<Array<Appointment>>;
    getAppointmentsByPatient(patientId: string): Promise<Array<Appointment>>;
    getClinicInfo(): Promise<Clinic | null>;
    getCoupons(): Promise<Array<Coupon>>;
    getDepartments(): Promise<Array<Department>>;
    getDoctors(): Promise<Array<Doctor>>;
    getDoctorsByDepartment(departmentId: string): Promise<Array<Doctor>>;
    getMedicalRecords(patientId: string): Promise<Array<MedicalRecord>>;
    getPatient(patientId: string): Promise<Patient | null>;
    getPatients(): Promise<Array<Patient>>;
    getPayments(): Promise<Array<Payment>>;
    getReviews(): Promise<Array<Review>>;
    getTodayAppointments(date: string): Promise<Array<Appointment>>;
    updateAppointmentStatus(id: string, status: string, suggestedDate: string, suggestedTime: string): Promise<boolean>;
    updateClinicInfo(clinic: Clinic): Promise<boolean>;
    updateCoupon(coupon: Coupon): Promise<boolean>;
    updateDoctor(doctor: Doctor): Promise<boolean>;
    updatePatient(patient: Patient): Promise<boolean>;
    updatePaymentStatus(id: string, status: string): Promise<boolean>;
    validateCoupon(code: string): Promise<Coupon | null>;
}
