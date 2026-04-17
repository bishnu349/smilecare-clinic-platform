import Types "../types";
import PatientLib "../lib/Patient";
import List "mo:core/List";

mixin (patients : List.List<Types.Patient>) {
  public query func getPatients() : async [Types.Patient] {
    PatientLib.getAll(patients)
  };

  public query func getPatient(patientId : Text) : async ?Types.Patient {
    PatientLib.get(patients, patientId)
  };

  public func createPatient(patient : Types.Patient) : async Text {
    PatientLib.add(patients, patient)
  };

  public func updatePatient(patient : Types.Patient) : async Bool {
    PatientLib.update(patients, patient)
  };
};
