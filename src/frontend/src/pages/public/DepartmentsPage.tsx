import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Phone,
  Smile,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useDepartments, useDoctors } from "../../hooks/useQueries";
import type { Department, Doctor } from "../../types";

// ─── Icon map ────────────────────────────────────────────────────────────────
function DepartmentIcon({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
}) {
  const lower = name.toLowerCase();
  if (lower.includes("dent"))
    return <Smile size={size} className="text-primary" />;
  if (lower.includes("skin") || lower.includes("derma"))
    return <Sparkles size={size} className="text-primary" />;
  return <Stethoscope size={size} className="text-primary" />;
}

// ─── Doctor chip ─────────────────────────────────────────────────────────────
function DoctorChip({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
      <span className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
        {initials}
      </span>
      <span className="truncate max-w-[120px]">{doctor.name}</span>
    </span>
  );
}

// ─── Department Card ─────────────────────────────────────────────────────────
function DepartmentCard({
  dept,
  doctors,
  isActive,
  onClick,
}: {
  dept: Department;
  doctors: Doctor[];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <Card
        data-ocid={`dept.card.${dept.id}`}
        className={`card-lift h-full cursor-pointer transition-smooth ${
          isActive
            ? "border-primary shadow-elevated ring-2 ring-primary/20"
            : "border-border hover:border-primary/40"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-6 flex flex-col gap-4 h-full">
          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-smooth ${
                isActive ? "bg-primary/10" : "bg-teal-subtle"
              }`}
            >
              <DepartmentIcon name={dept.name} size={26} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground leading-tight">
                {dept.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {dept.description}
          </p>

          {/* Doctors chips */}
          {doctors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {doctors.map((d) => (
                <DoctorChip key={d.id} doctor={d} />
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            data-ocid={`dept.view_doctors_button.${dept.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
              setTimeout(() => {
                document
                  .getElementById("doctors-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
            className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            View All Doctors
            <ChevronRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Doctor Row Card ─────────────────────────────────────────────────────────
function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const initials = doctor.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isAvailableToday =
    doctor.isTodayAvailable &&
    doctor.availableDays.some(
      (d) => d.toLowerCase() === today.toLowerCase().slice(0, 3),
    );

  const bookingHref = `/smilecare/book?doctorId=${encodeURIComponent(doctor.id)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        data-ocid={`doctors.item.${index + 1}`}
        className="card-lift border-border hover:border-primary/30"
      >
        <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display font-semibold text-foreground">
                {doctor.name}
              </h4>
              {isAvailableToday ? (
                <Badge
                  data-ocid={`doctors.available_badge.${index + 1}`}
                  className="bg-success/15 text-success border-success/30 text-xs"
                  variant="outline"
                >
                  Available Today
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground border-border"
                >
                  Not Today
                </Badge>
              )}
            </div>
            <p className="text-sm text-primary font-medium mt-0.5">
              {doctor.qualifications} · {doctor.specialization}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span>{Number(doctor.experience)} yrs experience</span>
              <span className="font-semibold text-accent-foreground">
                ₹{Number(doctor.consultationFee)} / consult
              </span>
              <span>
                {doctor.availableDays.slice(0, 4).join(", ")}
                {doctor.availableDays.length > 4
                  ? ` +${doctor.availableDays.length - 4}`
                  : ""}
              </span>
            </div>
          </div>

          {/* Book CTA */}
          <a href={bookingHref} data-ocid={`doctors.book_button.${index + 1}`}>
            <Button
              type="button"
              size="sm"
              className="gradient-primary text-primary-foreground shadow-subtle hover:shadow-elevated whitespace-nowrap"
            >
              Book with Dr. {doctor.name.split(" ").slice(-1)[0]}
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Page Skeleton ────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-64" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepartmentsPage() {
  const { data: departments = [], isLoading: loadingDepts } = useDepartments();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const [activeDeptId, setActiveDeptId] = useState<string | null>(null);
  const doctorsSectionRef = useRef<HTMLDivElement>(null);

  const isLoading = loadingDepts || loadingDoctors;

  const doctorsByDept = (deptId: string) =>
    doctors.filter((d) => d.departmentId === deptId);

  const activeDept = activeDeptId
    ? departments.find((d) => d.id === activeDeptId)
    : null;

  const visibleDoctors = activeDeptId
    ? doctors.filter((d) => d.departmentId === activeDeptId)
    : doctors;

  function handleDeptClick(deptId: string) {
    setActiveDeptId((prev) => (prev === deptId ? null : deptId));
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="hover:text-primary-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-primary-foreground font-medium">
                Departments
              </span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
              Our <span className="text-gradient-gold">Departments</span>
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-xl text-lg">
              Comprehensive care across specialties — all under one roof at
              SmileCare Clinic.
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* ── Department Cards ── */}
          <section
            data-ocid="departments.section"
            className="container mx-auto px-4 py-14"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  dept={dept}
                  doctors={doctorsByDept(dept.id)}
                  isActive={activeDeptId === dept.id}
                  onClick={() => handleDeptClick(dept.id)}
                />
              ))}
            </div>

            {activeDeptId && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-muted-foreground text-center"
              >
                Showing doctors for{" "}
                <span className="font-medium text-primary">
                  {activeDept?.name}
                </span>
                .{" "}
                <button
                  type="button"
                  data-ocid="departments.clear_filter_button"
                  onClick={() => setActiveDeptId(null)}
                  className="underline hover:text-foreground transition-colors"
                >
                  Show all
                </button>
              </motion.p>
            )}
          </section>

          {/* ── Filtered Doctors ── */}
          <section
            id="doctors-section"
            ref={doctorsSectionRef}
            data-ocid="departments.doctors_section"
            className="bg-muted/40 py-14"
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {activeDept
                    ? `Doctors in ${activeDept.name}`
                    : "All Our Doctors"}
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  {visibleDoctors.length} specialist
                  {visibleDoctors.length !== 1 ? "s" : ""} available
                  {activeDept
                    ? ` in ${activeDept.name}`
                    : " across all departments"}
                </p>
              </motion.div>

              {visibleDoctors.length === 0 ? (
                <div
                  data-ocid="departments.doctors_empty_state"
                  className="text-center py-16 text-muted-foreground"
                >
                  <User size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No doctors found</p>
                  <p className="text-sm mt-1">
                    Please check back later or view all departments.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleDoctors.map((doctor, idx) => (
                    <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Help Strip ── */}
          <section
            data-ocid="departments.help_strip"
            className="bg-card border-t border-border py-8"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-display font-semibold text-foreground text-lg">
                    Need help choosing a department?
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Our friendly reception team is here to guide you.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:+913312345678"
                    data-ocid="departments.phone_link"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-subtle"
                  >
                    <Phone size={16} />
                    +91 33 1234 5678
                  </a>
                  <Link to="/contact" data-ocid="departments.contact_link">
                    <Button type="button" variant="outline" size="sm">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
