import Types "../types";
import ClinicLib "../lib/Clinic";
import List "mo:core/List";

mixin (clinics : List.List<Types.Clinic>) {
  public query func getClinicInfo() : async ?Types.Clinic {
    clinics.find(func(c) { c.id == "clinic-smilecare" })
  };

  public func updateClinicInfo(clinic : Types.Clinic) : async Bool {
    ClinicLib.upsert(clinics, clinic)
  };
};
