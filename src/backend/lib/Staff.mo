import Types "../types";
import List "mo:core/List";

module {
  public func getAll(staff : List.List<Types.Staff>) : [Types.Staff] {
    staff.toArray()
  };

  public func get(staff : List.List<Types.Staff>, id : Text) : ?Types.Staff {
    staff.find(func(s) { s.id == id })
  };

  public func add(staff : List.List<Types.Staff>, member : Types.Staff) : Text {
    staff.add(member);
    member.id
  };

  public func update(staff : List.List<Types.Staff>, member : Types.Staff) : Bool {
    let idx = staff.findIndex(func(s) { s.id == member.id });
    switch (idx) {
      case (?i) { staff.put(i, member); true };
      case null { false };
    };
  };

  public func remove(staff : List.List<Types.Staff>, id : Text) : Bool {
    let filtered = staff.filter(func(s) { s.id != id });
    if (filtered.size() < staff.size()) {
      staff.clear();
      staff.append(filtered);
      true
    } else { false };
  };
};
