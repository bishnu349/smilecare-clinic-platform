import Types "../types";
import MedicalRecordLib "../lib/MedicalRecord";
import List "mo:core/List";

mixin (records : List.List<Types.MedicalRecord>) {
  public query func getMedicalRecords(patientId : Text) : async [Types.MedicalRecord] {
    MedicalRecordLib.getByPatient(records, patientId)
  };

  public func addMedicalRecord(record : Types.MedicalRecord) : async Text {
    MedicalRecordLib.add(records, record)
  };
};
