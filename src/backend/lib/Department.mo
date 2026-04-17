import Types "../types";
import List "mo:core/List";

module {
  public func getAll(departments : List.List<Types.Department>) : [Types.Department] {
    departments.toArray()
  };

  public func get(departments : List.List<Types.Department>, id : Text) : ?Types.Department {
    departments.find(func(d) { d.id == id })
  };

  public func add(departments : List.List<Types.Department>, dept : Types.Department) : Text {
    departments.add(dept);
    dept.id
  };

  public func update(departments : List.List<Types.Department>, dept : Types.Department) : Bool {
    let idx = departments.findIndex(func(d) { d.id == dept.id });
    switch (idx) {
      case (?i) { departments.put(i, dept); true };
      case null { false };
    };
  };

  public func remove(departments : List.List<Types.Department>, id : Text) : Bool {
    let filtered = departments.filter(func(d) { d.id != id });
    if (filtered.size() < departments.size()) {
      departments.clear();
      departments.append(filtered);
      true
    } else { false };
  };
};
