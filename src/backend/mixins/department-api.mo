import Types "../types";
import DepartmentLib "../lib/Department";
import List "mo:core/List";

mixin (departments : List.List<Types.Department>) {
  public query func getDepartments() : async [Types.Department] {
    DepartmentLib.getAll(departments)
  };
};
