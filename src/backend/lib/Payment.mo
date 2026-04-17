import Types "../types";
import List "mo:core/List";

module {
  public func getAll(payments : List.List<Types.Payment>) : [Types.Payment] {
    payments.toArray()
  };

  public func get(payments : List.List<Types.Payment>, id : Text) : ?Types.Payment {
    payments.find(func(p) { p.id == id })
  };

  public func add(payments : List.List<Types.Payment>, payment : Types.Payment) : Text {
    payments.add(payment);
    payment.id
  };

  public func updateStatus(payments : List.List<Types.Payment>, id : Text, status : Text) : Bool {
    let idx = payments.findIndex(func(p) { p.id == id });
    switch (idx) {
      case (?i) {
        let existing = payments.at(i);
        payments.put(i, { existing with status });
        true
      };
      case null { false };
    };
  };

  public func updateAppointmentPayment(
    appointments : List.List<Types.Appointment>,
    appointmentId : Text,
    paymentStatus : Text
  ) : Bool {
    let idx = appointments.findIndex(func(a) { a.id == appointmentId });
    switch (idx) {
      case (?i) {
        let existing = appointments.at(i);
        appointments.put(i, { existing with paymentStatus });
        true
      };
      case null { false };
    };
  };
};
