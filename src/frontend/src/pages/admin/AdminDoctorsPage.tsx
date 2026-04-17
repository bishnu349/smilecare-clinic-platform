import { Edit2, Plus, Search, Stethoscope, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useCreateDoctor,
  useDeleteDoctor,
  useDepartments,
  useDoctors,
  useUpdateDoctor,
} from "../../hooks/useQueries";
import { getInitials } from "../../lib/adminUtils";
import type { Doctor } from "../../types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_DOCTOR: Omit<Doctor, "id" | "clinicId"> = {
  name: "",
  qualifications: "",
  specialization: "",
  departmentId: "",
  experience: 0n,
  consultationFee: 0n,
  availableDays: [],
  isTodayAvailable: true,
  photoUrl: "",
  bio: "",
};

export default function AdminDoctorsPage() {
  const { data: doctors = [], isLoading } = useDoctors();
  const { data: departments = [] } = useDepartments();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [form, setForm] =
    useState<Omit<Doctor, "id" | "clinicId">>(DEFAULT_DOCTOR);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingDoctor(null);
    setForm(DEFAULT_DOCTOR);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.name,
      qualifications: doc.qualifications,
      specialization: doc.specialization,
      departmentId: doc.departmentId,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      availableDays: doc.availableDays,
      isTodayAvailable: doc.isTodayAvailable,
      photoUrl: doc.photoUrl,
      bio: doc.bio,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.specialization.trim())
      errors.specialization = "Specialization is required";
    if (!form.qualifications.trim())
      errors.qualifications = "Qualifications are required";
    if (!form.departmentId) errors.departmentId = "Department is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingDoctor) {
      updateDoctor.mutate({ ...editingDoctor, ...form });
    } else {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        clinicId: "smilecare-001",
        ...form,
      };
      createDoctor.mutate(newDoc);
    }
    setModalOpen(false);
  };

  const handleToggleToday = (doc: Doctor) => {
    updateDoctor.mutate({ ...doc, isTodayAvailable: !doc.isTodayAvailable });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteDoctor.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  const getDeptName = (deptId: string) =>
    departments.find((d) => d.id === deptId)?.name ?? "—";

  return (
    <div className="space-y-6" data-ocid="admin.doctors_page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Doctors
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {doctors.length} registered
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 h-10 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth shadow-subtle"
          data-ocid="admin.doctors.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="admin.doctors.search_input"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 bg-card rounded-2xl border border-border"
          data-ocid="admin.doctors.empty_state"
        >
          <Stethoscope className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div
              key={doc.id}
              className="bg-card rounded-2xl border border-border p-5 shadow-subtle card-lift space-y-4"
              data-ocid={`admin.doctors.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold">
                    {getInitials(doc.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground truncate">
                    {doc.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doc.specialization}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {doc.qualifications}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getDeptName(doc.departmentId)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {Number(doc.experience)} yrs
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ₹{Number(doc.consultationFee)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {DAYS.map((day) => (
                  <span
                    key={day}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      doc.availableDays.includes(day)
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleToday(doc)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-smooth ${
                      doc.isTodayAvailable ? "bg-success" : "bg-muted"
                    }`}
                    aria-label="Toggle today availability"
                    data-ocid={`admin.doctors.today_toggle.${i + 1}`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        doc.isTodayAvailable ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {doc.isTodayAvailable ? "Available today" : "Not today"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(doc)}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
                    aria-label="Edit"
                    data-ocid={`admin.doctors.edit_button.${i + 1}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(doc)}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-smooth"
                    aria-label="Delete"
                    data-ocid={`admin.doctors.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Form Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          data-ocid="admin.doctor_form.dialog"
        >
          <div className="bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10">
              <h3 className="font-display font-semibold text-foreground">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-muted/60 transition-smooth text-muted-foreground"
                data-ocid="admin.doctor_form.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {(["name", "specialization", "qualifications"] as const).map(
                (field) => (
                  <div key={field} className="space-y-1.5">
                    <label
                      htmlFor={`doctor-form-${field}`}
                      className="text-sm font-medium text-foreground capitalize"
                    >
                      {field}
                    </label>
                    <input
                      id={`doctor-form-${field}`}
                      type="text"
                      value={form[field]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid={`admin.doctor_form.${field}_input`}
                    />
                    {formErrors[field] && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid={`admin.doctor_form.${field}.field_error`}
                      >
                        {formErrors[field]}
                      </p>
                    )}
                  </div>
                ),
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="doctor-form-experience"
                    className="text-sm font-medium text-foreground"
                  >
                    Experience (years)
                  </label>
                  <input
                    id="doctor-form-experience"
                    type="number"
                    min="0"
                    value={Number(form.experience)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        experience: BigInt(e.target.value || "0"),
                      }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="admin.doctor_form.experience_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="doctor-form-fee"
                    className="text-sm font-medium text-foreground"
                  >
                    Consultation Fee (₹)
                  </label>
                  <input
                    id="doctor-form-fee"
                    type="number"
                    min="0"
                    value={Number(form.consultationFee)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        consultationFee: BigInt(e.target.value || "0"),
                      }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="admin.doctor_form.fee_input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="doctor-form-department"
                  className="text-sm font-medium text-foreground"
                >
                  Department
                </label>
                <select
                  id="doctor-form-department"
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, departmentId: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="admin.doctor_form.department_select"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {formErrors.departmentId && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.doctor_form.department.field_error"
                  >
                    {formErrors.departmentId}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="doctor-form-photo"
                  className="text-sm font-medium text-foreground"
                >
                  Photo URL (optional)
                </label>
                <input
                  id="doctor-form-photo"
                  type="url"
                  value={form.photoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, photoUrl: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="admin.doctor_form.photo_input"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Weekly Availability
                </p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium border transition-smooth ${
                        form.availableDays.includes(day)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-muted/60"
                      }`}
                      data-ocid={`admin.doctor_form.day_${day.toLowerCase()}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      isTodayAvailable: !f.isTodayAvailable,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-smooth ${form.isTodayAvailable ? "bg-success" : "bg-muted"}`}
                  aria-label="Toggle today availability"
                  data-ocid="admin.doctor_form.today_toggle"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.isTodayAvailable ? "translate-x-4" : "translate-x-1"}`}
                  />
                </button>
                <span className="text-sm text-foreground">Available today</span>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="doctor-form-bio"
                  className="text-sm font-medium text-foreground"
                >
                  Bio
                </label>
                <textarea
                  id="doctor-form-bio"
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  data-ocid="admin.doctor_form.bio_textarea"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-card px-6 py-4 border-t border-border flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 transition-smooth"
                data-ocid="admin.doctor_form.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-10 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth"
                data-ocid="admin.doctor_form.save_button"
              >
                {editingDoctor ? "Update" : "Add Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          data-ocid="admin.doctor_delete.dialog"
        >
          <div className="bg-card rounded-2xl border border-border shadow-elevated w-full max-w-sm p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                Delete Doctor
              </h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to remove{" "}
                <strong>{deleteTarget.name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 transition-smooth"
                data-ocid="admin.doctor_delete.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-smooth"
                data-ocid="admin.doctor_delete.confirm_button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
