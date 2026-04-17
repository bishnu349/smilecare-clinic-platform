import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  Stethoscope,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "../../context/AuthContext";
import { useAppointmentsByPatient, useDoctors } from "../../hooks/useQueries";
import type { Appointment } from "../../types";

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Pending Approval",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  Approved: {
    label: "Approved",
    className: "bg-success/15 text-success border-success/30",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  Completed: {
    label: "Completed",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  SuggestedNewTime: {
    label: "New Time Suggested",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

function AppointmentCard({
  appt,
  doctors,
}: {
  appt: Appointment;
  doctors: { id: string; name: string; specialization: string }[];
}) {
  const doctor = doctors.find((d) => d.id === appt.doctorId);
  const cfg = statusConfig[appt.status] ?? statusConfig.Pending;
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 card-lift"
      data-ocid="patient.dashboard.appt_card"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {doctor?.name ?? "Doctor"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {doctor?.specialization}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {appt.date}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {appt.timeWindow}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs ${cfg.className} flex-shrink-0`}
        >
          {cfg.label}
        </Badge>
      </div>
      {appt.status === "SuggestedNewTime" && appt.suggestedDate && (
        <div className="mt-3 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-700">
            Suggested: <strong>{appt.suggestedDate}</strong> —{" "}
            {appt.suggestedTime}
          </p>
        </div>
      )}
    </div>
  );
}

export default function PatientDashboard() {
  const { patientSession } = useAuth();
  const patientId = patientSession?.patientId ?? "";
  const { data: appointments = [], isLoading } =
    useAppointmentsByPatient(patientId);
  const { data: doctors = [] } = useDoctors();

  const upcoming = appointments.filter(
    (a) =>
      a.status === "Pending" ||
      a.status === "Approved" ||
      a.status === "SuggestedNewTime",
  );
  const completed = appointments.filter((a) => a.status === "Completed");
  const pending = appointments.filter((a) => a.status === "Pending");

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
      color: "text-primary" as const,
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: Clock,
      color: "text-warning" as const,
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle2,
      color: "text-success" as const,
    },
    {
      label: "Pending Approval",
      value: pending.length,
      icon: Stethoscope,
      color: "text-accent-foreground" as const,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="patient.dashboard.page">
      {/* Welcome banner */}
      <div className="gradient-hero rounded-2xl px-6 py-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative">
          <p className="text-primary-foreground/70 text-sm font-medium mb-1">
            Patient Portal
          </p>
          <h1 className="text-2xl font-display font-bold mb-1">
            Welcome back, {patientSession?.name?.split(" ")[0] ?? "Patient"}! 👋
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Here's a summary of your health activity at SmileCare Clinic.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-4 shadow-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {s.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">
            Upcoming Appointments
          </h2>
          <Link
            to="/patient/appointments"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            data-ocid="patient.dashboard.view_all_link"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div
            className="bg-card border border-dashed border-border rounded-xl px-6 py-10 text-center"
            data-ocid="patient.dashboard.appointments_empty_state"
          >
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">
              No upcoming appointments
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Book a consultation with one of our doctors
            </p>
            <Link to="/smilecare/book" search={{ doctorId: "" }}>
              {" "}
              <Button
                type="button"
                size="sm"
                data-ocid="patient.dashboard.book_now_button"
              >
                Book Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} doctors={doctors} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/smilecare/book"
            search={{ doctorId: "" }}
            data-ocid="patient.dashboard.book_appt_button"
          >
            <div className="flex items-center gap-4 bg-accent/10 border border-accent/30 rounded-xl p-4 hover:bg-accent/20 transition-smooth cursor-pointer card-lift">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Book New Appointment
                </p>
                <p className="text-xs text-muted-foreground">
                  Schedule with any doctor
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
          <Link
            to="/patient/records"
            data-ocid="patient.dashboard.view_records_link"
          >
            <div className="flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-xl p-4 hover:bg-primary/10 transition-smooth cursor-pointer card-lift">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  View Medical Records
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage uploaded documents
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
