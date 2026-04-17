import Types "../types";
import AppointmentLib "../lib/Appointment";
import CouponLib "../lib/Coupon";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  appointments : List.List<Types.Appointment>,
  coupons : List.List<Types.Coupon>
) {
  public query func getAppointments() : async [Types.Appointment] {
    AppointmentLib.getAll(appointments)
  };

  public query func getAppointmentsByPatient(patientId : Text) : async [Types.Appointment] {
    AppointmentLib.getByPatient(appointments, patientId)
  };

  public query func getAppointmentsByDoctor(doctorId : Text) : async [Types.Appointment] {
    AppointmentLib.getByDoctor(appointments, doctorId)
  };

  public query func getTodayAppointments(date : Text) : async [Types.Appointment] {
    AppointmentLib.getByDate(appointments, date)
  };

  public func createAppointment(appointment : Types.Appointment) : async Text {
    // Increment coupon usage if code provided
    if (appointment.couponCode != "") {
      CouponLib.incrementUsage(coupons, appointment.couponCode);
    };
    let queuePos = AppointmentLib.countByDoctorAndDate(appointments, appointment.doctorId, appointment.date) + 1;
    let apptWithQueue = { appointment with queuePosition = queuePos; createdAt = Time.now() };
    AppointmentLib.add(appointments, apptWithQueue)
  };

  public func updateAppointmentStatus(
    id : Text,
    status : Text,
    suggestedDate : Text,
    suggestedTime : Text
  ) : async Bool {
    AppointmentLib.updateStatus(appointments, id, status, suggestedDate, suggestedTime)
  };
};
