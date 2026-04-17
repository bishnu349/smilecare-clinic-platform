import {
  ChevronDown,
  ChevronRight,
  FileText,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useAppointments,
  useMedicalRecords,
  usePatients,
} from "../../hooks/useQueries";
import { getInitials, getStatusColor } from "../../lib/adminUtils";
import type { Patient } from "../../types";

function PatientDetailPanel({ patient }: { patient: Patient }) {
  const { data: appointments = [] } = useAppointments();
  const { data: records = [] } = useMedicalRecords(patient.id);
  const patientAppts = appointments.filter((a) => a.patientId === patient.id);

  return (
    <div className="border-t border-border bg-muted/20 px-6 py-5 space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Age", value: `${Number(patient.age)} yrs` },
          { label: "Gender", value: patient.gender },
          { label: "Phone", value: patient.phone },
          { label: "Email", value: patient.email },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium text-foreground mt-0.5 truncate">
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>

      {patient.address && (
        <div>
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="text-sm text-foreground mt-0.5">{patient.address}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Appointment History ({patientAppts.length})
        </p>
        {patientAppts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments yet</p>
        ) : (
          <div className="space-y-2">
            {patientAppts.map((appt, i) => (
              <div
                key={appt.id}
                className="flex items-center justify-between bg-card rounded-xl px-4 py-2.5 border border-border"
                data-ocid={`admin.patient_detail.appointment.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {appt.date} · {appt.timeWindow}
                  </p>
                  <p className="text-xs text-muted-foreground">{appt.reason}</p>
                </div>
                <Badge
                  className={getStatusColor(appt.status)}
                  variant="secondary"
                >
                  {appt.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Medical Records ({records.length})
        </p>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records uploaded</p>
        ) : (
          <div className="space-y-1.5">
            {records.map((rec, i) => (
              <div
                key={rec.id}
                className="flex items-center gap-3 bg-card rounded-xl px-4 py-2.5 border border-border"
                data-ocid={`admin.patient_detail.record.${i + 1}`}
              >
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {rec.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {rec.fileType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPatientsPage() {
  const { data: patients = [], isLoading } = usePatients();
  const { data: appointments = [] } = useAppointments();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  const getAppointmentCount = (patientId: string) =>
    appointments.filter((a) => a.patientId === patientId).length;

  const formatDate = (ts: bigint) => {
    const ms = Number(ts);
    if (!ms) return "—";
    return new Date(ms / 1_000_000).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6" data-ocid="admin.patients_page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Patient Records
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {patients.length} registered patients
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="admin.patients.search_input"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="admin.patients.empty_state"
          >
            <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No patients found</p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] px-5 py-3 border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
              <span>Patient</span>
              <span>Phone</span>
              <span>Age / Gender</span>
              <span>Appointments</span>
              <span>Joined</span>
              <span />
            </div>

            {filtered.map((patient, i) => (
              <div key={patient.id} data-ocid={`admin.patients.item.${i + 1}`}>
                <button
                  type="button"
                  className="w-full grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] items-center px-5 py-4 border-b border-border/60 hover:bg-muted/20 cursor-pointer transition-smooth text-left"
                  onClick={() =>
                    setExpandedId(expandedId === patient.id ? null : patient.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground text-xs font-bold">
                        {getInitials(patient.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  <div className="md:block hidden text-sm text-muted-foreground">
                    {patient.phone}
                  </div>
                  <div className="md:block hidden text-sm text-muted-foreground">
                    {Number(patient.age)} yrs · {patient.gender}
                  </div>
                  <div className="md:block hidden">
                    <Badge variant="secondary" className="text-xs">
                      {getAppointmentCount(patient.id)} appts
                    </Badge>
                  </div>
                  <div className="md:block hidden text-sm text-muted-foreground">
                    {formatDate(patient.createdAt)}
                  </div>
                  <div className="flex justify-end text-muted-foreground">
                    {expandedId === patient.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {expandedId === patient.id && (
                  <PatientDetailPanel patient={patient} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
