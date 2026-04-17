import {
  Calendar,
  CheckCircle,
  Clock,
  IndianRupee,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AppointmentDetailModal } from "../../components/admin/AppointmentDetailModal";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useAppointments,
  useDoctors,
  usePatients,
  usePayments,
  useTodayAppointments,
  useUpdateAppointmentStatus,
} from "../../hooks/useQueries";
import {
  formatTimeAgo,
  getInitials,
  getStatusColor,
} from "../../lib/adminUtils";
import type { Appointment } from "../../types";

const today = new Date().toISOString().split("T")[0];

export default function AdminDashboard() {
  const { data: todayAppts = [], isLoading: loadingToday } =
    useTodayAppointments(today);
  const { data: allAppts = [], isLoading: loadingAll } = useAppointments();
  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const { data: payments = [], isLoading: loadingPayments } = usePayments();
  const { data: doctors = [] } = useDoctors();
  const updateStatus = useUpdateAppointmentStatus();
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const patientMap: Record<string, string> = {};
  for (const p of patients) {
    patientMap[p.id] = p.name;
  }

  const pendingCount = allAppts.filter((a) => a.status === "Pending").length;
  const totalRevenue = payments
    .filter((p) => p.status === "Received")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const recentActivity = [...allAppts]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const getDoctorName = (doctorId: string) =>
    doctors.find((d) => d.id === doctorId)?.name ?? "Unknown";

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

  const stats = [
    {
      label: "Today's Appointments",
      value: loadingToday ? "—" : todayAppts.length,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-teal-subtle",
    },
    {
      label: "Pending Approvals",
      value: loadingAll ? "—" : pendingCount,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Total Patients",
      value: loadingPatients ? "—" : patients.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-teal-subtle",
    },
    {
      label: "Total Revenue",
      value: loadingPayments ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-accent-foreground",
      bg: "bg-accent/20",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="admin.dashboard_page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="admin.stats_section"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border p-5 shadow-subtle card-lift"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's appointments table */}
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">
              Today's Appointments
            </h2>
            <Badge variant="secondary">{todayAppts.length} total</Badge>
          </div>

          {loadingToday ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : todayAppts.length === 0 ? (
            <div
              className="flex flex-col items-center py-12 text-center"
              data-ocid="admin.today_appts.empty_state"
            >
              <Calendar className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">
                No appointments scheduled for today
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                      Doctor
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                      Time
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppts.map((appt, i) => (
                    <tr
                      key={appt.id}
                      className="border-b border-border/60 hover:bg-muted/30 cursor-pointer transition-smooth"
                      onClick={() => setSelectedAppt(appt)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedAppt(appt)
                      }
                      tabIndex={0}
                      data-ocid={`admin.today_appts.item.${i + 1}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                            <span className="text-primary-foreground text-[10px] font-bold">
                              {getInitials(
                                patientMap[appt.patientId] ?? appt.patientId,
                              )}
                            </span>
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[120px]">
                            {patientMap[appt.patientId] ?? appt.patientId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {getDoctorName(appt.doctorId)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
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
                        <div
                          className="flex gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {appt.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(appt.id)}
                                className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-smooth"
                                aria-label="Approve"
                                data-ocid={`admin.today_appts.approve_button.${i + 1}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(appt.id)}
                                className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-smooth"
                                aria-label="Reject"
                                data-ocid={`admin.today_appts.reject_button.${i + 1}`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">
              Recent Activity
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {loadingAll ? (
              [1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No recent activity
              </p>
            ) : (
              recentActivity.map((appt, i) => (
                <div
                  key={appt.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth"
                  data-ocid={`admin.activity.item.${i + 1}`}
                >
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-[10px] font-bold">
                      {getInitials(
                        patientMap[appt.patientId] ?? appt.patientId,
                      )}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-medium">
                        {patientMap[appt.patientId] ?? appt.patientId}
                      </span>
                      {" booked with "}
                      <span className="font-medium">
                        {getDoctorName(appt.doctorId)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(Number(appt.createdAt))}
                      </p>
                      <Badge
                        className={`text-[10px] py-0 px-1.5 ${getStatusColor(appt.status)}`}
                        variant="secondary"
                      >
                        {appt.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          doctorName={getDoctorName(selectedAppt.doctorId)}
          onClose={() => setSelectedAppt(null)}
        />
      )}
    </div>
  );
}
