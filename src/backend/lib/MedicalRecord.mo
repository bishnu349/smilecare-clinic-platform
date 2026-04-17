import Types "../types";
import List "mo:core/List";

module {
  public func getByPatient(records : List.List<Types.MedicalRecord>, patientId : Text) : [Types.MedicalRecord] {
    records.filter(func(r) { r.patientId == patientId }).toArray()
  };

  public func add(records : List.List<Types.MedicalRecord>, record : Types.MedicalRecord) : Text {
    records.add(record);
    record.id
  };
};
