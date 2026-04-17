import Types "../types";
import DoctorLib "../lib/Doctor";
import List "mo:core/List";

mixin (doctors : List.List<Types.Doctor>) {
  public query func getDoctors() : async [Types.Doctor] {
    DoctorLib.getAll(doctors)
  };

  public query func getDoctorsByDepartment(departmentId : Text) : async [Types.Doctor] {
    DoctorLib.getByDepartment(doctors, departmentId)
  };

  public func createDoctor(doctor : Types.Doctor) : async Text {
    DoctorLib.add(doctors, doctor)
  };

  public func updateDoctor(doctor : Types.Doctor) : async Bool {
    DoctorLib.update(doctors, doctor)
  };

  public func deleteDoctor(id : Text) : async Bool {
    DoctorLib.remove(doctors, id)
  };
};
