import { Calendar, CheckCircle, MessageCircle, X, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentDetailModal } from "../../components/admin/AppointmentDetailModal";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useAppointments,
  useDoctors,
  usePatients,
  useUpdateAppointmentStatus,
} from "../../hooks/useQueries";
import { getInitials, getStatusColor } from "../../lib/adminUtils";
import type { Appointment } from "../../types";

const PAGE_SIZE = 10;

export default function AdminAppointmentsPage() {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: doctors = [] } = useDoctors();
  const { data: patients = [] } = usePatients();
  const updateStatus = useUpdateAppointmentStatus();

  const patientMap: Record<string, string> = {};
  for (const p of patients) {
    patientMap[p.id] = p.name;
  }

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [suggestAppt, setSuggestAppt] = useState<Appointment | null>(null);
  const [suggestDate, setSuggestDate] = useState("");
  const [suggestTime, setSuggestTime] = useState("Morning");

  const getDoctorName = (doctorId: string) =>
    doctors.find((d) => d.id === doctorId)?.name ?? "Unknown";

  const filtered = appointments.filter((a) => {
    if (filterDoctor && a.doctorId !== filterDoctor) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterFrom && a.date < filterFrom) return false;
    if (filterTo && a.date > filterTo) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = (id: string) =>
    updateStatus.mutate({
      id,
      status: "Approved",
      suggestedDate: "",
      suggestedTime: "",
    });
  const handleReject = (id: string) =>
    updateStatus.mutate({
      id,
      status: "Rejected",
      suggestedDate: "",
      suggestedTime: "",
    });
  const handleComplete = (id: string) =>
    updateStatus.mutate({
      id,
      status: "Completed",
      suggestedDate: "",
      suggestedTime: "",
    });
  const handleSuggest = () => {
    if (!suggestAppt) return;
    updateStatus.mutate({
      id: suggestAppt.id,
      status: "SuggestedNewTime",
      suggestedDate: suggestDate,
      suggestedTime: suggestTime,
    });
    setSuggestAppt(null);
    toast.success("New time suggested successfully");
  };

  return (
    <div className="space-y-6" data-ocid="admin.appointments_page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Appointments
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {filtered.length} records found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="filter-from"
              className="text-xs font-medium text-muted-foreground"
            >
              From Date
            </label>
            <input
              id="filter-from"
              type="date"
              value={filterFrom}
              onChange={(e) => {
                setFilterFrom(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.appointments.filter_from"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="filter-to"
              className="text-xs font-medium text-muted-foreground"
            >
              To Date
            </label>
            <input
              id="filter-to"
              type="date"
              value={filterTo}
              onChange={(e) => {
                setFilterTo(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.appointments.filter_to"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="filter-doctor"
              className="text-xs font-medium text-muted-foreground"
            >
              Doctor
            </label>
            <select
              id="filter-doctor"
              value={filterDoctor}
              onChange={(e) => {
                setFilterDoctor(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.appointments.filter_doctor"
            >
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="filter-status"
              className="text-xs font-medium text-muted-foreground"
            >
              Status
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.appointments.filter_status"
            >
              <option value="">All Statuses</option>
              {[
                "Pending",
                "Approved",
                "Rejected",
                "SuggestedNewTime",
                "Completed",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="admin.appointments.empty_state"
          >
            <Calendar className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              No appointments match your filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "#",
                      "Patient",
                      "Doctor",
                      "Date",
                      "Time",
                      "Status",
                      "Payment",
                      "Amount",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((appt, i) => {
                    const idx = (page - 1) * PAGE_SIZE + i + 1;
                    return (
                      <tr
                        key={appt.id}
                        className="border-b border-border/60 hover:bg-muted/30 cursor-pointer transition-smooth"
                        onClick={() => setSelectedAppt(appt)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setSelectedAppt(appt)
                        }
                        tabIndex={0}
                        data-ocid={`admin.appointments.item.${idx}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {idx}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0">
                              <span className="text-primary-foreground text-[9px] font-bold">
                                {getInitials(
                                  patientMap[appt.patientId] ?? appt.patientId,
                                )}
                              </span>
                            </div>
                            <span className="font-medium text-foreground truncate max-w-[100px]">
                              {patientMap[appt.patientId] ?? appt.patientId}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {getDoctorName(appt.doctorId)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {appt.date}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {appt.timeWindow}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={getStatusColor(appt.status)}
                            variant="secondary"
                          >
                            {appt.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              appt.paymentStatus === "Received"
                                ? "bg-success/15 text-success"
                                : "bg-warning/15 text-warning-foreground"
                            }
                            variant="secondary"
                          >
                            {appt.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          ₹{Number(appt.amount).toLocaleString("en-IN")}
                        </td>
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1.5">
                            {appt.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(appt.id)}
                                  className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-smooth"
                                  aria-label="Approve"
                                  data-ocid={`admin.appointments.approve_button.${idx}`}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(appt.id)}
                                  className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-smooth"
                                  aria-label="Reject"
                                  data-ocid={`admin.appointments.reject_button.${idx}`}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSuggestAppt(appt);
                                    setSuggestDate(appt.date);
                                  }}
                                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
                                  aria-label="Suggest new time"
                                  data-ocid={`admin.appointments.suggest_button.${idx}`}
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {appt.status === "Approved" && (
                              <button
                                type="button"
                                onClick={() => handleComplete(appt.id)}
                                className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-smooth"
                                aria-label="Mark completed"
                                data-ocid={`admin.appointments.complete_button.${idx}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 px-3 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted/60 transition-smooth"
                  data-ocid="admin.appointments.pagination_prev"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-3 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted/60 transition-smooth"
                  data-ocid="admin.appointments.pagination_next"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          doctorName={getDoctorName(selectedAppt.doctorId)}
          onClose={() => setSelectedAppt(null)}
          showWhatsApp
        />
      )}

      {/* Suggest New Time Modal */}
      {suggestAppt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          data-ocid="admin.suggest_time.dialog"
        >
          <div className="bg-card rounded-2xl border border-border shadow-elevated w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">
                Suggest New Time
              </h3>
              <button
                type="button"
                onClick={() => setSuggestAppt(null)}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-muted/60 transition-smooth text-muted-foreground"
                data-ocid="admin.suggest_time.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="suggest-date"
                  className="text-sm font-medium text-foreground"
                >
                  New Date
                </label>
                <input
                  id="suggest-date"
                  type="date"
                  value={suggestDate}
                  onChange={(e) => setSuggestDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="suggest-time"
                  className="text-sm font-medium text-foreground"
                >
                  Time Window
                </label>
                <select
                  id="suggest-time"
                  value={suggestTime}
                  onChange={(e) => setSuggestTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {["Morning", "Afternoon", "Evening"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSuggestAppt(null)}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 transition-smooth"
                data-ocid="admin.suggest_time.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuggest}
                className="flex-1 h-10 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth"
                data-ocid="admin.suggest_time.confirm_button"
              >
                Suggest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* hidden WhatsApp trigger — actual button is inside AppointmentDetailModal */}
      <button
        type="button"
        style={{ display: "none" }}
        onClick={() => toast.success("WhatsApp notification sent!")}
      >
        <MessageCircle />
      </button>
    </div>
  );
}
