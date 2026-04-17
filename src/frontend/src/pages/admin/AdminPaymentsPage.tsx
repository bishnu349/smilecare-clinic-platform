import { CreditCard, IndianRupee, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useClinicInfo,
  usePayments,
  useUpdateClinicInfo,
  useUpdatePaymentStatus,
} from "../../hooks/useQueries";
import type { Payment } from "../../types";

const paymentStatusColors: Record<string, string> = {
  Received: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning-foreground",
  Waived: "bg-muted text-muted-foreground",
};

function StatusDropdown({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
}) {
  const updateStatus = useUpdatePaymentStatus();
  const statuses = ["Received", "Pending", "Waived"];

  const handleSelect = (status: string) => {
    updateStatus.mutate({ id: payment.id, status });
    toast.success(`Payment marked as ${status}`);
    onClose();
  };

  return (
    <div
      className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-elevated py-1 min-w-[140px]"
      data-ocid="admin.payments.status_dropdown"
    >
      {statuses.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleSelect(s)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/60 transition-smooth ${
            s === payment.status
              ? "font-semibold text-primary"
              : "text-foreground"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default function AdminPaymentsPage() {
  const { data: payments = [], isLoading } = usePayments();
  const { data: clinicInfo } = useClinicInfo();
  const updateClinicInfo = useUpdateClinicInfo();

  const [filterMethod, setFilterMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [upiId, setUpiId] = useState(clinicInfo?.upiId ?? "");

  const formatDate = (ts: bigint) => {
    const ms = Number(ts);
    if (!ms) return "—";
    return new Date(ms / 1_000_000).toLocaleDateString("en-IN");
  };

  const filtered = payments.filter((p) => {
    if (filterMethod && p.method !== filterMethod) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    const dateStr = formatDate(p.createdAt);
    if (filterFrom && dateStr < filterFrom) return false;
    if (filterTo && dateStr > filterTo) return false;
    return true;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "Received")
    .reduce((s, p) => s + Number(p.amount), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + Number(p.amount), 0);

  const upiTotal = payments
    .filter((p) => p.method === "UPI" && p.status === "Received")
    .reduce((s, p) => s + Number(p.amount), 0);

  const cashTotal = payments
    .filter((p) => p.method === "PayAtClinic" && p.status === "Received")
    .reduce((s, p) => s + Number(p.amount), 0);

  const handleSaveUpi = () => {
    if (!clinicInfo) return;
    updateClinicInfo.mutate({ ...clinicInfo, upiId });
    toast.success("UPI ID updated successfully");
  };

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      color: "text-success",
    },
    {
      label: "Pending Amount",
      value: `₹${pendingAmount.toLocaleString("en-IN")}`,
      color: "text-warning",
    },
    {
      label: "UPI Collected",
      value: `₹${upiTotal.toLocaleString("en-IN")}`,
      color: "text-primary",
    },
    {
      label: "Cash Collected",
      value: `₹${cashTotal.toLocaleString("en-IN")}`,
      color: "text-accent-foreground",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="admin.payments_page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Payments
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {payments.length} total transactions
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border p-4 shadow-subtle"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-xl font-display font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="pay-filter-method"
              className="text-xs font-medium text-muted-foreground"
            >
              Method
            </label>
            <select
              id="pay-filter-method"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.payments.filter_method"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="PayAtClinic">Pay at Clinic</option>
            </select>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="pay-filter-status"
              className="text-xs font-medium text-muted-foreground"
            >
              Status
            </label>
            <select
              id="pay-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.payments.filter_status"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Waived">Waived</option>
            </select>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="pay-filter-from"
              className="text-xs font-medium text-muted-foreground"
            >
              From
            </label>
            <input
              id="pay-filter-from"
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.payments.filter_from"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="pay-filter-to"
              className="text-xs font-medium text-muted-foreground"
            >
              To
            </label>
            <input
              id="pay-filter-to"
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.payments.filter_to"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="admin.payments.empty_state"
          >
            <CreditCard className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              No payments match your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {[
                    "Booking ID",
                    "Patient",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment, i) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border/60 hover:bg-muted/20 transition-smooth"
                    data-ocid={`admin.payments.item.${i + 1}`}
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {payment.appointmentId.slice(-8)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">
                      {payment.patientId}
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">
                      ₹{Number(payment.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {payment.method === "PayAtClinic"
                          ? "Pay at Clinic"
                          : payment.method}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === payment.id ? null : payment.id,
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-smooth ${paymentStatusColors[payment.status] ?? ""}`}
                          data-ocid={`admin.payments.status_badge.${i + 1}`}
                        >
                          {payment.status}
                        </button>
                        {openDropdown === payment.id && (
                          <>
                            <button
                              type="button"
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                              aria-label="Close dropdown"
                            />
                            <StatusDropdown
                              payment={payment}
                              onClose={() => setOpenDropdown(null)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPI Settings */}
      <div className="bg-card rounded-2xl border border-border shadow-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            UPI Settings
          </h2>
        </div>
        <div className="max-w-sm space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="upi-id-input"
              className="text-sm font-medium text-foreground"
            >
              Clinic UPI ID
            </label>
            <input
              id="upi-id-input"
              type="text"
              value={upiId || clinicInfo?.upiId || ""}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="clinic@upi"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="admin.payments.upi_input"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveUpi}
            className="h-10 px-5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth shadow-subtle"
            data-ocid="admin.payments.upi_save_button"
          >
            Save UPI ID
          </button>
        </div>
      </div>
    </div>
  );
}
