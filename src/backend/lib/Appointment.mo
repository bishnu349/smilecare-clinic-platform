import Types "../types";
import List "mo:core/List";

module {
  public func getAll(appointments : List.List<Types.Appointment>) : [Types.Appointment] {
    appointments.toArray()
  };

  public func get(appointments : List.List<Types.Appointment>, id : Text) : ?Types.Appointment {
    appointments.find(func(a) { a.id == id })
  };

  public func getByPatient(appointments : List.List<Types.Appointment>, patientId : Text) : [Types.Appointment] {
    appointments.filter(func(a) { a.patientId == patientId }).toArray()
  };

  public func getByDoctor(appointments : List.List<Types.Appointment>, doctorId : Text) : [Types.Appointment] {
    appointments.filter(func(a) { a.doctorId == doctorId }).toArray()
  };

  public func getByDate(appointments : List.List<Types.Appointment>, date : Text) : [Types.Appointment] {
    appointments.filter(func(a) { a.date == date }).toArray()
  };

  public func countByDoctorAndDate(appointments : List.List<Types.Appointment>, doctorId : Text, date : Text) : Nat {
    appointments.filter(func(a) {
      a.doctorId == doctorId and a.date == date and
      (a.status == "Pending" or a.status == "Approved")
    }).size()
  };

  public func add(appointments : List.List<Types.Appointment>, appt : Types.Appointment) : Text {
    appointments.add(appt);
    appt.id
  };

  public func updateStatus(
    appointments : List.List<Types.Appointment>,
    id : Text,
    status : Text,
    suggestedDate : Text,
    suggestedTime : Text
  ) : Bool {
    let idx = appointments.findIndex(func(a) { a.id == id });
    switch (idx) {
      case (?i) {
        let existing = appointments.at(i);
        appointments.put(i, { existing with status; suggestedDate; suggestedTime });
        true
      };
      case null { false };
    };
  };
};
