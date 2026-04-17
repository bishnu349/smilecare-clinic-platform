import { MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { getStatusColor } from "../../lib/adminUtils";
import type { Appointment } from "../../types";
import { Badge } from "../ui/badge";

interface Props {
  appointment: Appointment;
  doctorName: string;
  onClose: () => void;
  showWhatsApp?: boolean;
}

export function AppointmentDetailModal({
  appointment: appt,
  doctorName,
  onClose,
  showWhatsApp,
}: Props) {
  const fields = [
    { label: "Appointment ID", value: appt.id },
    { label: "Patient ID", value: appt.patientId },
    { label: "Doctor", value: doctorName },
    { label: "Date", value: appt.date },
    { label: "Time Window", value: appt.timeWindow },
    { label: "Reason", value: appt.reason || "—" },
    { label: "Payment Method", value: appt.paymentMethod },
    {
      label: "Amount",
      value: `₹${Number(appt.amount).toLocaleString("en-IN")}`,
    },
    { label: "Coupon Code", value: appt.couponCode || "—" },
    { label: "Queue Position", value: `#${Number(appt.queuePosition)}` },
  ];

  if (appt.suggestedDate) {
    fields.push(
      { label: "Suggested Date", value: appt.suggestedDate },
      { label: "Suggested Time", value: appt.suggestedTime },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      data-ocid="admin.appointment_detail.dialog"
    >
      <div className="bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-semibold text-foreground">
              Appointment Details
            </h3>
            <Badge className={getStatusColor(appt.status)} variant="secondary">
              {appt.status}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-muted/60 transition-smooth text-muted-foreground"
            data-ocid="admin.appointment_detail.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-start justify-between gap-4 py-2 border-b border-border/40 last:border-0"
            >
              <span className="text-sm text-muted-foreground shrink-0">
                {label}
              </span>
              <span className="text-sm font-medium text-foreground text-right break-all">
                {value}
              </span>
            </div>
          ))}
        </div>

        {showWhatsApp && (
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => toast.success("WhatsApp notification sent!")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-success/15 text-success border border-success/20 text-sm font-medium hover:bg-success/25 transition-smooth"
              data-ocid="admin.appointment_detail.whatsapp_button"
            >
              <MessageCircle className="w-4 h-4" />
              Send WhatsApp Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
