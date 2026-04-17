import Types "../types";
import List "mo:core/List";

module {
  public func getAll(clinics : List.List<Types.Clinic>) : [Types.Clinic] {
    clinics.toArray()
  };

  public func get(clinics : List.List<Types.Clinic>, id : Text) : ?Types.Clinic {
    clinics.find(func(c) { c.id == id })
  };

  public func upsert(clinics : List.List<Types.Clinic>, clinic : Types.Clinic) : Bool {
    let existing = clinics.findIndex(func(c) { c.id == clinic.id });
    switch (existing) {
      case (?idx) {
        clinics.put(idx, clinic);
        true;
      };
      case null {
        clinics.add(clinic);
        true;
      };
    };
  };
};
