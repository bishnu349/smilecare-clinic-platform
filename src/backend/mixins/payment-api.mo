import Types "../types";
import PaymentLib "../lib/Payment";
import List "mo:core/List";

mixin (
  payments : List.List<Types.Payment>,
  appointments : List.List<Types.Appointment>
) {
  public query func getPayments() : async [Types.Payment] {
    PaymentLib.getAll(payments)
  };

  public func createPayment(payment : Types.Payment) : async Text {
    // Sync payment status on the appointment too
    ignore PaymentLib.updateAppointmentPayment(appointments, payment.appointmentId, payment.status);
    PaymentLib.add(payments, payment)
  };

  public func updatePaymentStatus(id : Text, status : Text) : async Bool {
    // Find the payment to sync appointment
    switch (PaymentLib.get(payments, id)) {
      case (?p) {
        ignore PaymentLib.updateAppointmentPayment(appointments, p.appointmentId, status);
      };
      case null {};
    };
    PaymentLib.updateStatus(payments, id, status)
  };
};
