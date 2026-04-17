import { Calendar, Clock, IndianRupee, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import {
  useAppointmentsByPatient,
  useDoctors,
  useUpdateAppointmentStatus,
} from "../../hooks/useQueries";
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

const paymentConfig: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Payment Pending",
    className: "bg-warning/10 text-warning-foreground border-warning/25",
  },
  Received: {
    label: "Paid",
    className: "bg-success/10 text-success border-success/25",
  },
  Waived: {
    label: "Waived",
    className: "bg-muted/60 text-muted-foreground border-border",
  },
};

function AppointmentCard({
  appt,
  doctorMap,
  canCancel,
}: {
  appt: Appointment;
  doctorMap: Record<string, { name: string; specialization: string }>;
  canCancel: boolean;
}) {
  const updateStatus = useUpdateAppointmentStatus();
  const doctor = doctorMap[appt.doctorId];
  const statusCfg = statusConfig[appt.status] ?? statusConfig.Pending;
  const payCfg = paymentConfig[appt.paymentStatus] ?? paymentConfig.Pending;
  const initials = (doctor?.name ?? "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleCancel() {
    updateStatus.mutate(
      { id: appt.id, status: "Rejected", suggestedDate: "", suggestedTime: "" },
      {
        onSuccess: () => toast.success("Appointment cancelled"),
        onError: () => toast.error("Failed to cancel appointment"),
      },
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 card-lift"
      data-ocid="patient.appointments.appt_card"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-display font-bold text-sm">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-foreground">
                {doctor?.name ?? "Doctor"}
              </p>
              <p className="text-sm text-muted-foreground">
                {doctor?.specialization}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${statusCfg.className}`}
            >
              {statusCfg.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 mb-3">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {appt.date}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {appt.timeWindow}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <IndianRupee className="w-3.5 h-3.5" />₹{appt.amount.toString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`text-xs ${payCfg.className}`}>
              {payCfg.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-muted/60 text-muted-foreground border-border"
            >
              {appt.paymentMethod === "UPI" ? "UPI" : "Pay at Clinic"}
            </Badge>
            {appt.reason && (
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                Reason: {appt.reason}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Suggested time info */}
      {appt.status === "SuggestedNewTime" && appt.suggestedDate && (
        <div className="mt-4 px-4 py-2.5 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
            <p className="text-sm text-purple-700">
              Clinic suggests: <strong>{appt.suggestedDate}</strong> at{" "}
              {appt.suggestedTime}
            </p>
          </div>
        </div>
      )}

      {/* Cancel button */}
      {canCancel && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={updateStatus.isPending}
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
            data-ocid="patient.appointments.cancel_button"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            {updateStatus.isPending ? "Cancelling…" : "Cancel Appointment"}
          </Button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="bg-card border border-dashed border-border rounded-xl px-6 py-12 text-center"
      data-ocid="patient.appointments.empty_state"
    >
      <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p className="text-sm text-muted-foreground">
        Appointments will appear here once booked
      </p>
    </div>
  );
}

export default function PatientAppointmentsPage() {
  const { patientSession } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { data: appointments = [], isLoading } = useAppointmentsByPatient(
    patientSession?.patientId ?? "",
  );
  const { data: doctors = [] } = useDoctors();

  const doctorMap = Object.fromEntries(
    doctors.map((d) => [
      d.id,
      { name: d.name, specialization: d.specialization },
    ]),
  );

  const upcoming = appointments.filter((a) =>
    ["Pending", "Approved", "SuggestedNewTime"].includes(a.status),
  );
  const past = appointments.filter((a) =>
    ["Completed", "Rejected"].includes(a.status),
  );

  return (
    <div className="space-y-6" data-ocid="patient.appointments.page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          My Appointments
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage all your clinic visits
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        data-ocid="patient.appointments.tabs"
      >
        <TabsList>
          <TabsTrigger
            value="upcoming"
            data-ocid="patient.appointments.upcoming_tab"
          >
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" data-ocid="patient.appointments.past_tab">
            Past
            {past.length > 0 && (
              <span className="ml-1.5 bg-muted text-muted-foreground text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {past.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {isLoading ? (
            <>
              <Skeleton
                className="h-36 rounded-xl"
                data-ocid="patient.appointments.loading_state"
              />
              <Skeleton className="h-36 rounded-xl" />
            </>
          ) : upcoming.length === 0 ? (
            <EmptyState label="No upcoming appointments" />
          ) : (
            upcoming.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                doctorMap={doctorMap}
                canCancel={appt.status === "Pending"}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-4">
          {isLoading ? (
            <Skeleton className="h-36 rounded-xl" />
          ) : past.length === 0 ? (
            <EmptyState label="No past appointments" />
          ) : (
            past.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                doctorMap={doctorMap}
                canCancel={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
