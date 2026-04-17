import Time "mo:core/Time";

module {
  public type Clinic = {
    id : Text;
    name : Text;
    tagline : Text;
    address : Text;
    city : Text;
    phone : Text;
    email : Text;
    workingHours : Text;
    primaryColor : Text;
    accentColor : Text;
    upiId : Text;
    website : Text;
  };

  public type Department = {
    id : Text;
    clinicId : Text;
    name : Text;
    description : Text;
    icon : Text;
  };

  public type Doctor = {
    id : Text;
    clinicId : Text;
    name : Text;
    qualifications : Text;
    specialization : Text;
    experience : Nat;
    consultationFee : Nat;
    departmentId : Text;
    availableDays : [Text];
    isTodayAvailable : Bool;
    photoUrl : Text;
    bio : Text;
  };

  public type Patient = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    age : Nat;
    gender : Text;
    address : Text;
    createdAt : Int;
  };

  public type Appointment = {
    id : Text;
    clinicId : Text;
    patientId : Text;
    doctorId : Text;
    departmentId : Text;
    date : Text;
    timeWindow : Text;
    status : Text; // Pending | Approved | Rejected | SuggestedNewTime | Completed
    paymentStatus : Text; // Pending | Received | Waived
    paymentMethod : Text; // UPI | PayAtClinic
    amount : Nat;
    couponCode : Text;
    discount : Nat;
    reason : Text;
    queuePosition : Nat;
    suggestedDate : Text;
    suggestedTime : Text;
    createdAt : Int;
  };

  public type Payment = {
    id : Text;
    appointmentId : Text;
    patientId : Text;
    amount : Nat;
    method : Text;
    status : Text;
    createdAt : Int;
  };

  public type Coupon = {
    id : Text;
    clinicId : Text;
    code : Text;
    discountType : Text; // Percentage | Flat
    discountValue : Nat;
    expiryDate : Text;
    maxUses : Nat;
    usedCount : Nat;
    isActive : Bool;
  };

  public type MedicalRecord = {
    id : Text;
    patientId : Text;
    appointmentId : Text;
    fileName : Text;
    fileType : Text;
    uploadedAt : Int;
  };

  public type Staff = {
    id : Text;
    clinicId : Text;
    name : Text;
    email : Text;
    role : Text; // Owner | Receptionist | Doctor
    doctorId : Text;
    isActive : Bool;
  };

  public type Review = {
    id : Text;
    clinicId : Text;
    patientId : Text;
    patientName : Text;
    rating : Nat;
    comment : Text;
    date : Text;
  };
};
