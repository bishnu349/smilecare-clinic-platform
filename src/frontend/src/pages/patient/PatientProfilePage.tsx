import { useNavigate } from "@tanstack/react-router";
import { LogOut, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { usePatient, useUpdatePatient } from "../../hooks/useQueries";
import type { Patient } from "../../types";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PatientProfilePage() {
  const { patientSession, logoutPatient } = useAuth();
  const navigate = useNavigate();
  const patientId = patientSession?.patientId ?? "";
  const { data: patient, isLoading } = usePatient(patientId);
  const updatePatient = useUpdatePatient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setPhone(patient.phone);
      setAge(patient.age.toString());
      setGender(patient.gender);
      setAddress(patient.address);
    } else if (patientSession) {
      setName(patientSession.name);
      setPhone(patientSession.phone);
    }
  }, [patient, patientSession]);

  function handleSave() {
    const updated: Patient = {
      id: patientId,
      name: name.trim(),
      email: patient?.email ?? patientSession?.email ?? "",
      phone: phone.trim(),
      age: BigInt(Number.parseInt(age) || 0),
      gender,
      address: address.trim(),
      createdAt: patient?.createdAt ?? BigInt(Date.now()),
    };
    updatePatient.mutate(updated, {
      onSuccess: () => toast.success("Profile updated successfully!"),
      onError: () => toast.error("Failed to update profile. Please try again."),
    });
  }

  function handleLogout() {
    logoutPatient();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  }

  const initials = (patientSession?.name ?? "P")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="patient.profile.page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Avatar section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-2xl flex-shrink-0 shadow-elevated">
            {initials}
          </div>
          <div>
            <p className="text-lg font-display font-semibold text-foreground">
              {patientSession?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {patientSession?.email || patientSession?.phone}
            </p>
            <button
              type="button"
              className="mt-1 text-xs text-primary hover:text-primary/80 transition-colors"
              onClick={() => toast.info("Photo upload coming soon")}
            >
              Edit Photo
            </button>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle">
        <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Personal Information
        </h2>

        {isLoading ? (
          <div className="space-y-4" data-ocid="patient.profile.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  data-ocid="patient.profile.name_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={patient?.email ?? patientSession?.email ?? ""}
                  readOnly
                  className="bg-muted/40 cursor-not-allowed text-muted-foreground"
                  data-ocid="patient.profile.email_input"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  data-ocid="patient.profile.phone_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 32"
                  data-ocid="patient.profile.age_input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-ocid="patient.profile.gender_select"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your residential address"
                rows={3}
                data-ocid="patient.profile.address_input"
              />
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={updatePatient.isPending}
              className="w-full sm:w-auto"
              data-ocid="patient.profile.save_button"
            >
              <Save className="w-4 h-4 mr-2" />
              {updatePatient.isPending ? "Saving…" : "Save Changes"}
            </Button>

            {updatePatient.isSuccess && (
              <p
                className="text-sm text-success"
                data-ocid="patient.profile.success_state"
              >
                Profile updated successfully!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Account details */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Account Details
        </h2>
        <dl className="space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Patient ID</dt>
            <dd className="font-mono text-foreground text-xs bg-muted px-2 py-0.5 rounded">
              {patientId}
            </dd>
          </div>
          {patient?.createdAt && (
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Member Since</dt>
              <dd className="text-foreground">
                {formatDate(patient.createdAt)}
              </dd>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Clinic</dt>
            <dd className="text-foreground">SmileCare Clinic, Kolkata</dd>
          </div>
        </dl>
      </div>

      {/* Logout */}
      <div className="pb-4">
        <Button
          type="button"
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50"
          onClick={handleLogout}
          data-ocid="patient.profile.logout_button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout from Patient Portal
        </Button>
      </div>
    </div>
  );
}
