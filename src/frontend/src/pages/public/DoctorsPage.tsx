import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  IndianRupee,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDepartments, useDoctors } from "../../hooks/useQueries";
import type { Doctor } from "../../types";

// ─── Day Mapping ──────────────────────────────────────────────────────────────

const TODAY_FULL = new Date().toLocaleDateString("en-US", { weekday: "long" });
const DAY_ABBR_MAP: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};
const TODAY_ABBR = DAY_ABBR_MAP[TODAY_FULL] ?? "";

const DAY_COLORS: Record<string, string> = {
  Mon: "bg-primary/10 text-primary border-primary/20",
  Tue: "bg-accent/10 text-accent-foreground border-accent/20",
  Wed: "bg-primary/10 text-primary border-primary/20",
  Thu: "bg-accent/10 text-accent-foreground border-accent/20",
  Fri: "bg-primary/10 text-primary border-primary/20",
  Sat: "bg-secondary text-secondary-foreground border-border",
  Sun: "bg-muted text-muted-foreground border-border",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function isTodayAvailable(doctor: Doctor) {
  return doctor.availableDays.includes(TODAY_ABBR) || doctor.isTodayAvailable;
}

// ─── Doctor Card ──────────────────────────────────────────────────────────────

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const available = isTodayAvailable(doctor);

  return (
    <article
      data-ocid={`doctors.item.${index + 1}`}
      className="bg-card rounded-2xl border border-border shadow-subtle card-lift flex flex-col overflow-hidden"
    >
      {/* Avatar + availability */}
      <div className="relative pt-8 pb-4 px-6 flex flex-col items-center gap-3 bg-teal-subtle">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-elevated">
          <span className="text-primary-foreground text-2xl font-display font-bold tracking-wide">
            {getInitials(doctor.name)}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            available
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${available ? "bg-green-500" : "bg-red-500"}`}
          />
          {available ? "Available Today" : "Not Available Today"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground leading-tight">
            {doctor.name}
          </h3>
          <p className="text-sm font-semibold text-gradient-gold mt-0.5">
            {doctor.specialization}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {doctor.qualifications}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">
              {String(doctor.experience)} Yrs Exp
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <IndianRupee className="w-4 h-4 text-accent-foreground flex-shrink-0" />
            <span className="font-bold">₹{String(doctor.consultationFee)}</span>
          </div>
        </div>

        {/* Available Days */}
        <div className="flex flex-wrap gap-1.5">
          {doctor.availableDays.map((day) => (
            <span
              key={day}
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                day === TODAY_ABBR
                  ? "bg-primary text-primary-foreground border-primary"
                  : (DAY_COLORS[day] ??
                    "bg-muted text-muted-foreground border-border")
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => {
              window.location.href = `/smilecare/book?doctorId=${doctor.id}`;
            }}
            data-ocid={`doctors.book_button.${index + 1}`}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-gold transition-smooth"
          >
            Book Appointment
          </Button>
          <Link
            to="/doctors"
            data-ocid={`doctors.view_profile.${index + 1}`}
            className="text-center text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200 py-1"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function DoctorCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex flex-col items-center gap-3 pb-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-12 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorsPage() {
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const { data: departments = [] } = useDepartments();

  const [deptFilter, setDeptFilter] = useState("all");
  const [availableToday, setAvailableToday] = useState(false);
  const [feeRange, setFeeRange] = useState("all");

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      if (deptFilter !== "all" && doc.departmentId !== deptFilter) return false;
      if (availableToday && !isTodayAvailable(doc)) return false;
      if (feeRange !== "all") {
        const fee = Number(doc.consultationFee);
        if (feeRange === "under500" && fee >= 500) return false;
        if (feeRange === "500-600" && (fee < 500 || fee > 600)) return false;
        if (feeRange === "600-700" && (fee < 600 || fee > 700)) return false;
        if (feeRange === "above700" && fee <= 700) return false;
      }
      return true;
    });
  }, [doctors, deptFilter, availableToday, feeRange]);

  const hasActiveFilters =
    deptFilter !== "all" || availableToday || feeRange !== "all";

  function clearFilters() {
    setDeptFilter("all");
    setAvailableToday(false);
    setFeeRange("all");
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="doctors.page">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link
              to="/"
              className="hover:text-primary-foreground transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-foreground font-medium">
              Our Doctors
            </span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground leading-tight">
            Our <span className="text-gradient-gold">Expert Doctors</span>
          </h1>
          <p className="text-primary-foreground/80 mt-3 text-lg max-w-xl">
            Meet the dedicated medical professionals committed to your health
            and well-being at SmileCare Clinic.
          </p>
        </div>
      </section>

      {/* ── Sticky Filter Bar ──────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 bg-card border-b border-border shadow-subtle"
        data-ocid="doctors.filter.section"
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-primary flex-shrink-0" />

            {/* Department Filter */}
            <select
              data-ocid="doctors.filter.department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Fee Range Filter */}
            <select
              data-ocid="doctors.filter.fee"
              value={feeRange}
              onChange={(e) => setFeeRange(e.target.value)}
              className="text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth cursor-pointer"
            >
              <option value="all">All Fees</option>
              <option value="under500">Under ₹500</option>
              <option value="500-600">₹500 – ₹600</option>
              <option value="600-700">₹600 – ₹700</option>
              <option value="above700">Above ₹700</option>
            </select>

            {/* Available Today Toggle */}
            <label
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              data-ocid="doctors.filter.available_today"
            >
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span className="text-foreground font-medium">
                Available Today
              </span>
              {TODAY_ABBR && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {TODAY_FULL}
                </Badge>
              )}
            </label>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                data-ocid="doctors.filter.clear_button"
                className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 font-medium transition-colors duration-200 ml-auto"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            {!doctorsLoading && (
              <span className="text-xs text-muted-foreground ml-auto">
                {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Doctors Grid ───────────────────────────────────────────────────── */}
      <section
        className="max-w-6xl mx-auto px-4 py-12"
        data-ocid="doctors.list"
      >
        {doctorsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="doctors.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                No doctors found
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                No doctors match your current filters. Try adjusting your
                criteria.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              data-ocid="doctors.empty_state.clear_button"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor, idx) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      {!doctorsLoading && filtered.length > 0 && (
        <section className="bg-teal-subtle border-t border-border py-12 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Ready to book your appointment?
            </h2>
            <p className="text-muted-foreground text-sm">
              Choose your preferred doctor and book a convenient slot.
              Queue-based system ensures minimal wait times.
            </p>
            <Button
              type="button"
              onClick={() => {
                window.location.href = "/smilecare/book";
              }}
              data-ocid="doctors.bottom_cta.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold transition-smooth shadow-elevated"
            >
              Book an Appointment
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
