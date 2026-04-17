import Types "../types";
import List "mo:core/List";

module {
  public func getAll(patients : List.List<Types.Patient>) : [Types.Patient] {
    patients.toArray()
  };

  public func get(patients : List.List<Types.Patient>, id : Text) : ?Types.Patient {
    patients.find(func(p) { p.id == id })
  };

  public func add(patients : List.List<Types.Patient>, patient : Types.Patient) : Text {
    patients.add(patient);
    patient.id
  };

  public func update(patients : List.List<Types.Patient>, patient : Types.Patient) : Bool {
    let idx = patients.findIndex(func(p) { p.id == patient.id });
    switch (idx) {
      case (?i) { patients.put(i, patient); true };
      case null { false };
    };
  };
};
