import Types "../types";
import List "mo:core/List";

module {
  public func getAll(doctors : List.List<Types.Doctor>) : [Types.Doctor] {
    doctors.toArray()
  };

  public func get(doctors : List.List<Types.Doctor>, id : Text) : ?Types.Doctor {
    doctors.find(func(d) { d.id == id })
  };

  public func getByDepartment(doctors : List.List<Types.Doctor>, departmentId : Text) : [Types.Doctor] {
    doctors.filter(func(d) { d.departmentId == departmentId }).toArray()
  };

  public func add(doctors : List.List<Types.Doctor>, doctor : Types.Doctor) : Text {
    doctors.add(doctor);
    doctor.id
  };

  public func update(doctors : List.List<Types.Doctor>, doctor : Types.Doctor) : Bool {
    let idx = doctors.findIndex(func(d) { d.id == doctor.id });
    switch (idx) {
      case (?i) { doctors.put(i, doctor); true };
      case null { false };
    };
  };

  public func remove(doctors : List.List<Types.Doctor>, id : Text) : Bool {
    let filtered = doctors.filter(func(d) { d.id != id });
    if (filtered.size() < doctors.size()) {
      doctors.clear();
      doctors.append(filtered);
      true
    } else { false };
  };
};
