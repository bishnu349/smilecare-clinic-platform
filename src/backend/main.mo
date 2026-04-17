import Types "types";
import List "mo:core/List";
import Time "mo:core/Time";

import ClinicApi "mixins/clinic-api";
import DepartmentApi "mixins/department-api";
import DoctorApi "mixins/doctor-api";
import PatientApi "mixins/patient-api";
import AppointmentApi "mixins/appointment-api";
import PaymentApi "mixins/payment-api";
import CouponApi "mixins/coupon-api";
import MedicalRecordApi "mixins/medical-record-api";
import ReviewApi "mixins/review-api";

actor {
  // ── State ─────────────────────────────────────────────────────────────────
  let clinics      = List.empty<Types.Clinic>();
  let departments  = List.empty<Types.Department>();
  let doctors      = List.empty<Types.Doctor>();
  let patients     = List.empty<Types.Patient>();
  let appointments = List.empty<Types.Appointment>();
  let payments     = List.empty<Types.Payment>();
  let coupons      = List.empty<Types.Coupon>();
  let records      = List.empty<Types.MedicalRecord>();
  let staff        = List.empty<Types.Staff>();
  let reviews      = List.empty<Types.Review>();

  // ── Seed data ─────────────────────────────────────────────────────────────
  let _seedInit : Bool = do {
    // Clinic
    clinics.add({
      id           = "clinic-smilecare";
      name         = "SmileCare Clinic";
      tagline      = "Your Health, Our Priority";
      address      = "123 Park Street, Kolkata, West Bengal 700016";
      city         = "Kolkata";
      phone        = "+91 98765 43210";
      email        = "info@smilecare.in";
      workingHours = "Mon\u{2013}Sat: 9:00 AM \u{2013} 8:00 PM";
      primaryColor = "#0F766E";
      accentColor  = "#D97706";
      upiId        = "smilecare@upi";
      website      = "https://smilecare.in";
    });

    // Departments
    departments.add({
      id          = "dept-gm";
      clinicId    = "clinic-smilecare";
      name        = "General Medicine";
      description = "Comprehensive primary care for all ages. Our general medicine department handles routine check-ups, chronic disease management, fever, infections, and preventive healthcare.";
      icon        = "stethoscope";
    });
    departments.add({
      id          = "dept-dent";
      clinicId    = "clinic-smilecare";
      name        = "Dentistry";
      description = "Complete dental care including cleaning, fillings, root canals, extractions, orthodontics, and cosmetic dentistry. We make your smile brighter.";
      icon        = "tooth";
    });
    departments.add({
      id          = "dept-skin";
      clinicId    = "clinic-smilecare";
      name        = "Skin Care";
      description = "Expert dermatology and cosmetology services covering acne treatment, skin allergies, pigmentation, anti-aging treatments, and general skin health.";
      icon        = "sparkles";
    });

    // Doctors
    doctors.add({
      id              = "doc-rahul";
      clinicId        = "clinic-smilecare";
      name            = "Dr. Rahul Sharma";
      qualifications  = "BDS";
      specialization  = "Dentistry";
      experience      = 5;
      consultationFee = 500;
      departmentId    = "dept-dent";
      availableDays   = ["Monday", "Wednesday", "Friday", "Saturday"];
      isTodayAvailable = true;
      photoUrl        = "";
      bio             = "Dr. Rahul Sharma is a skilled dental surgeon with 5 years of experience in general and cosmetic dentistry. He specialises in painless procedures and patient comfort.";
    });
    doctors.add({
      id              = "doc-priya";
      clinicId        = "clinic-smilecare";
      name            = "Dr. Priya Sen";
      qualifications  = "MBBS";
      specialization  = "General Medicine";
      experience      = 8;
      consultationFee = 600;
      departmentId    = "dept-gm";
      availableDays   = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      isTodayAvailable = true;
      photoUrl        = "";
      bio             = "Dr. Priya Sen brings 8 years of clinical expertise in general medicine. She is known for her empathetic approach, thorough diagnosis, and effective treatment of acute and chronic conditions.";
    });
    doctors.add({
      id              = "doc-anika";
      clinicId        = "clinic-smilecare";
      name            = "Dr. Anika Gupta";
      qualifications  = "MBBS, MD Dermatology";
      specialization  = "Skin Care";
      experience      = 6;
      consultationFee = 700;
      departmentId    = "dept-skin";
      availableDays   = ["Tuesday", "Thursday", "Saturday"];
      isTodayAvailable = false;
      photoUrl        = "";
      bio             = "Dr. Anika Gupta is a board-certified dermatologist with 6 years of experience. She specialises in acne management, cosmetic procedures, and treating complex skin disorders.";
    });

    // Patients
    patients.add({ id = "pat-001"; name = "Arjun Das"; email = "arjun.das@email.com"; phone = "+91 90001 11111"; age = 32; gender = "Male"; address = "45 Salt Lake, Kolkata"; createdAt = 1700000000000000000 });
    patients.add({ id = "pat-002"; name = "Sunita Banerjee"; email = "sunita.b@email.com"; phone = "+91 90002 22222"; age = 45; gender = "Female"; address = "12 Ballygunge, Kolkata"; createdAt = 1700000001000000000 });
    patients.add({ id = "pat-003"; name = "Rohit Ghosh"; email = "rohit.ghosh@email.com"; phone = "+91 90003 33333"; age = 28; gender = "Male"; address = "8 New Town, Kolkata"; createdAt = 1700000002000000000 });
    patients.add({ id = "pat-004"; name = "Meena Chakraborty"; email = "meena.c@email.com"; phone = "+91 90004 44444"; age = 55; gender = "Female"; address = "22 Behala, Kolkata"; createdAt = 1700000003000000000 });
    patients.add({ id = "pat-005"; name = "Saurav Mondal"; email = "saurav.m@email.com"; phone = "+91 90005 55555"; age = 38; gender = "Male"; address = "67 Kasba, Kolkata"; createdAt = 1700000004000000000 });
    patients.add({ id = "pat-006"; name = "Priti Roy"; email = "priti.roy@email.com"; phone = "+91 90006 66666"; age = 29; gender = "Female"; address = "15 Dum Dum, Kolkata"; createdAt = 1700000005000000000 });

    // Appointments
    appointments.add({
      id = "appt-001"; clinicId = "clinic-smilecare"; patientId = "pat-001"; doctorId = "doc-priya"; departmentId = "dept-gm";
      date = "2026-04-17"; timeWindow = "Morning"; status = "Approved"; paymentStatus = "Received"; paymentMethod = "UPI";
      amount = 600; couponCode = ""; discount = 0; reason = "Fever and cough"; queuePosition = 1;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000010000000000;
    });
    appointments.add({
      id = "appt-002"; clinicId = "clinic-smilecare"; patientId = "pat-002"; doctorId = "doc-rahul"; departmentId = "dept-dent";
      date = "2026-04-17"; timeWindow = "Afternoon"; status = "Pending"; paymentStatus = "Pending"; paymentMethod = "PayAtClinic";
      amount = 500; couponCode = ""; discount = 0; reason = "Tooth pain"; queuePosition = 2;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000011000000000;
    });
    appointments.add({
      id = "appt-003"; clinicId = "clinic-smilecare"; patientId = "pat-003"; doctorId = "doc-priya"; departmentId = "dept-gm";
      date = "2026-04-17"; timeWindow = "Evening"; status = "Pending"; paymentStatus = "Pending"; paymentMethod = "UPI";
      amount = 600; couponCode = "SAVE10"; discount = 60; reason = "Routine check-up"; queuePosition = 3;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000012000000000;
    });
    appointments.add({
      id = "appt-004"; clinicId = "clinic-smilecare"; patientId = "pat-004"; doctorId = "doc-anika"; departmentId = "dept-skin";
      date = "2026-04-15"; timeWindow = "Morning"; status = "Completed"; paymentStatus = "Received"; paymentMethod = "UPI";
      amount = 700; couponCode = ""; discount = 0; reason = "Acne treatment follow-up"; queuePosition = 1;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000013000000000;
    });
    appointments.add({
      id = "appt-005"; clinicId = "clinic-smilecare"; patientId = "pat-005"; doctorId = "doc-rahul"; departmentId = "dept-dent";
      date = "2026-04-14"; timeWindow = "Afternoon"; status = "Completed"; paymentStatus = "Received"; paymentMethod = "PayAtClinic";
      amount = 500; couponCode = "FLAT100"; discount = 100; reason = "Dental cleaning"; queuePosition = 2;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000014000000000;
    });
    appointments.add({
      id = "appt-006"; clinicId = "clinic-smilecare"; patientId = "pat-006"; doctorId = "doc-priya"; departmentId = "dept-gm";
      date = "2026-04-13"; timeWindow = "Morning"; status = "Rejected"; paymentStatus = "Waived"; paymentMethod = "UPI";
      amount = 600; couponCode = ""; discount = 0; reason = "Back pain"; queuePosition = 1;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000015000000000;
    });
    appointments.add({
      id = "appt-007"; clinicId = "clinic-smilecare"; patientId = "pat-001"; doctorId = "doc-anika"; departmentId = "dept-skin";
      date = "2026-04-18"; timeWindow = "Morning"; status = "Pending"; paymentStatus = "Pending"; paymentMethod = "PayAtClinic";
      amount = 700; couponCode = ""; discount = 0; reason = "Skin rash"; queuePosition = 1;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000016000000000;
    });
    appointments.add({
      id = "appt-008"; clinicId = "clinic-smilecare"; patientId = "pat-002"; doctorId = "doc-priya"; departmentId = "dept-gm";
      date = "2026-04-10"; timeWindow = "Afternoon"; status = "Completed"; paymentStatus = "Received"; paymentMethod = "UPI";
      amount = 600; couponCode = ""; discount = 0; reason = "Diabetes management"; queuePosition = 4;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000017000000000;
    });
    appointments.add({
      id = "appt-009"; clinicId = "clinic-smilecare"; patientId = "pat-003"; doctorId = "doc-rahul"; departmentId = "dept-dent";
      date = "2026-04-19"; timeWindow = "Morning"; status = "SuggestedNewTime"; paymentStatus = "Pending"; paymentMethod = "PayAtClinic";
      amount = 500; couponCode = ""; discount = 0; reason = "Braces consultation"; queuePosition = 1;
      suggestedDate = "2026-04-21"; suggestedTime = "Morning"; createdAt = 1700000018000000000;
    });
    appointments.add({
      id = "appt-010"; clinicId = "clinic-smilecare"; patientId = "pat-004"; doctorId = "doc-priya"; departmentId = "dept-gm";
      date = "2026-04-20"; timeWindow = "Evening"; status = "Approved"; paymentStatus = "Pending"; paymentMethod = "UPI";
      amount = 600; couponCode = "SAVE10"; discount = 60; reason = "Thyroid check-up"; queuePosition = 2;
      suggestedDate = ""; suggestedTime = ""; createdAt = 1700000019000000000;
    });

    // Payments
    payments.add({ id = "pay-001"; appointmentId = "appt-001"; patientId = "pat-001"; amount = 600; method = "UPI"; status = "Received"; createdAt = 1700000020000000000 });
    payments.add({ id = "pay-002"; appointmentId = "appt-004"; patientId = "pat-004"; amount = 700; method = "UPI"; status = "Received"; createdAt = 1700000021000000000 });
    payments.add({ id = "pay-003"; appointmentId = "appt-005"; patientId = "pat-005"; amount = 400; method = "PayAtClinic"; status = "Received"; createdAt = 1700000022000000000 });
    payments.add({ id = "pay-004"; appointmentId = "appt-008"; patientId = "pat-002"; amount = 600; method = "UPI"; status = "Received"; createdAt = 1700000023000000000 });
    payments.add({ id = "pay-005"; appointmentId = "appt-006"; patientId = "pat-006"; amount = 0; method = "UPI"; status = "Waived"; createdAt = 1700000024000000000 });

    // Coupons
    coupons.add({
      id = "coup-001"; clinicId = "clinic-smilecare"; code = "SAVE10"; discountType = "Percentage";
      discountValue = 10; expiryDate = "2026-12-31"; maxUses = 100; usedCount = 5; isActive = true;
    });
    coupons.add({
      id = "coup-002"; clinicId = "clinic-smilecare"; code = "FLAT100"; discountType = "Flat";
      discountValue = 100; expiryDate = "2026-12-31"; maxUses = 50; usedCount = 3; isActive = true;
    });

    // Reviews
    reviews.add({ id = "rev-001"; clinicId = "clinic-smilecare"; patientId = "pat-001"; patientName = "Arjun Das"; rating = 5; comment = "Excellent experience! Dr. Priya was very thorough and explained everything clearly. The clinic is clean and well-organised."; date = "2026-04-10" });
    reviews.add({ id = "rev-002"; clinicId = "clinic-smilecare"; patientId = "pat-002"; patientName = "Sunita Banerjee"; rating = 5; comment = "Dr. Rahul is wonderful with nervous patients like me. Made the entire dental procedure painless. Highly recommend!"; date = "2026-04-12" });
    reviews.add({ id = "rev-003"; clinicId = "clinic-smilecare"; patientId = "pat-003"; patientName = "Rohit Ghosh"; rating = 4; comment = "Good clinic with professional staff. Waiting time was a bit long but the consultation quality was great."; date = "2026-03-28" });
    reviews.add({ id = "rev-004"; clinicId = "clinic-smilecare"; patientId = "pat-004"; patientName = "Meena Chakraborty"; rating = 5; comment = "Dr. Anika completely transformed my skin! After 3 months of treatment, my acne is under control. Amazing doctor."; date = "2026-04-05" });
    reviews.add({ id = "rev-005"; clinicId = "clinic-smilecare"; patientId = "pat-005"; patientName = "Saurav Mondal"; rating = 5; comment = "Very affordable and professional. The queue-based system works smoothly and I got timely updates. Will visit again."; date = "2026-04-14" });
    reviews.add({ id = "rev-006"; clinicId = "clinic-smilecare"; patientId = "pat-006"; patientName = "Priti Roy"; rating = 4; comment = "Friendly staff and knowledgeable doctors. The clinic has a comfortable waiting area. Booking online was very easy."; date = "2026-03-20" });
    reviews.add({ id = "rev-007"; clinicId = "clinic-smilecare"; patientId = "pat-001"; patientName = "Arjun Das"; rating = 5; comment = "Second visit was even better. The follow-up care is excellent. Dr. Priya remembered my case details without needing reminders."; date = "2026-04-16" });
    reviews.add({ id = "rev-008"; clinicId = "clinic-smilecare"; patientId = "pat-002"; patientName = "Sunita Banerjee"; rating = 4; comment = "Satisfied with the dermatology consultation. Dr. Anika prescribed the right treatment and results are visible in just 2 weeks."; date = "2026-04-08" });

    // Staff
    staff.add({ id = "staff-001"; clinicId = "clinic-smilecare"; name = "Admin Owner"; email = "admin@smilecare.in"; role = "Owner"; doctorId = ""; isActive = true });
    staff.add({ id = "staff-002"; clinicId = "clinic-smilecare"; name = "Kavita Nair"; email = "reception@smilecare.in"; role = "Receptionist"; doctorId = ""; isActive = true });
    staff.add({ id = "staff-003"; clinicId = "clinic-smilecare"; name = "Dr. Rahul Sharma"; email = "dr.rahul@smilecare.in"; role = "Doctor"; doctorId = "doc-rahul"; isActive = true });
    staff.add({ id = "staff-004"; clinicId = "clinic-smilecare"; name = "Dr. Priya Sen"; email = "dr.priya@smilecare.in"; role = "Doctor"; doctorId = "doc-priya"; isActive = true });
    staff.add({ id = "staff-005"; clinicId = "clinic-smilecare"; name = "Dr. Anika Gupta"; email = "dr.anika@smilecare.in"; role = "Doctor"; doctorId = "doc-anika"; isActive = true });

    true
  };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include ClinicApi(clinics);
  include DepartmentApi(departments);
  include DoctorApi(doctors);
  include PatientApi(patients);
  include AppointmentApi(appointments, coupons);
  include PaymentApi(payments, appointments);
  include CouponApi(coupons);
  include MedicalRecordApi(records);
  include ReviewApi(reviews);
};
