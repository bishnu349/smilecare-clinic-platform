import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Award,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { useDoctors, useReviews } from "../../hooks/useQueries";
import { useTranslation } from "../../i18n/translations";
import type { Doctor, Review } from "../../types";

// ─── Intersection Observer Hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="font-display text-2xl font-bold text-primary">
        {value}
      </span>
      <span className="text-center text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── Department Card ──────────────────────────────────────────────────────────
const departmentData = [
  {
    id: "dept-general",
    name: "General Medicine",
    description:
      "Comprehensive primary care for all age groups. Preventive health, chronic disease management, and urgent care.",
    icon: <Stethoscope size={28} />,
    gradient: "from-teal-600 to-teal-800",
    color: "bg-teal-50 text-teal-700",
    href: "/departments",
  },
  {
    id: "dept-dentistry",
    name: "Dentistry",
    description:
      "Complete dental care: cleanings, fillings, orthodontics, and cosmetic treatments for a healthy smile.",
    icon: <Heart size={28} />,
    gradient: "from-blue-600 to-blue-800",
    color: "bg-blue-50 text-blue-700",
    href: "/departments",
  },
  {
    id: "dept-skin",
    name: "Skin Care",
    description:
      "Expert dermatological consultations, treatments for acne, eczema, and anti-aging cosmetic procedures.",
    icon: <Sparkles size={28} />,
    gradient: "from-rose-500 to-rose-700",
    color: "bg-rose-50 text-rose-700",
    href: "/departments",
  },
];

function DepartmentCard({
  dept,
  delay,
  inView,
}: {
  dept: (typeof departmentData)[0];
  delay: number;
  inView: boolean;
}) {
  return (
    <div
      data-ocid={`dept.card.${dept.id}`}
      className="card-lift group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-subtle"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className={`bg-gradient-to-br ${dept.gradient} p-6`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-white">
          {dept.icon}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {dept.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {dept.description}
        </p>
        <Link
          to="/departments"
          data-ocid={`dept.view_doctors_link.${dept.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View Doctors <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ─── Doctor Avatar ────────────────────────────────────────────────────────────
function DoctorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter((_, i) => i < 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-subtle">
      {initials}
    </div>
  );
}

// ─── Doctor Card ──────────────────────────────────────────────────────────────
const dayAbbrev: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function DoctorCard({
  doctor,
  index,
  inView,
}: {
  doctor: Doctor;
  index: number;
  inView: boolean;
}) {
  return (
    <div
      data-ocid={`doctor.card.${index + 1}`}
      className="card-lift flex min-w-[280px] flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:min-w-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s ease ${index * 120}ms`,
      }}
    >
      <div className="flex items-center gap-4">
        <DoctorAvatar name={doctor.name} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-foreground">
            {doctor.name}
          </h3>
          <p className="text-sm text-primary">{doctor.specialization}</p>
          {doctor.isTodayAvailable ? (
            <Badge className="mt-1 bg-success/15 text-success border-success/20 hover:bg-success/20 text-xs">
              Available Today
            </Badge>
          ) : (
            <Badge variant="secondary" className="mt-1 text-xs">
              Not Today
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Qual:</span>{" "}
          {doctor.qualifications}
        </p>
        <p>
          <span className="font-medium text-foreground">Exp:</span>{" "}
          {Number(doctor.experience)} yrs
        </p>
        <p>
          <span className="font-medium text-foreground">Fee:</span>{" "}
          <span className="font-semibold text-primary">
            ₹{Number(doctor.consultationFee)}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {doctor.availableDays.map((day) => (
          <span
            key={day}
            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {dayAbbrev[day] ?? day}
          </span>
        ))}
      </div>

      <Link
        to="/smilecare/book"
        search={{ doctorId: doctor.id }}
        data-ocid={`doctor.book_button.${index + 1}`}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <CalendarCheck size={14} className="mr-2" />
          Book Appointment
        </Button>
      </Link>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

// ─── Static fallback reviews ──────────────────────────────────────────────────
const fallbackReviews: Review[] = [
  {
    id: "r1",
    clinicId: "clinic-1",
    patientId: "p1",
    patientName: "Ananya Bose",
    rating: BigInt(5),
    comment:
      "Excellent experience at SmileCare! Dr. Priya Sen was very thorough and kind. The staff was polite and the clinic was very clean.",
    date: "2024-12-10",
  },
  {
    id: "r2",
    clinicId: "clinic-1",
    patientId: "p2",
    patientName: "Suresh Mehta",
    rating: BigInt(5),
    comment:
      "Dr. Rahul Sharma is an amazing dentist. My dental treatment was painless and efficient. Highly recommend SmileCare Clinic.",
    date: "2024-12-08",
  },
  {
    id: "r3",
    clinicId: "clinic-1",
    patientId: "p3",
    patientName: "Priti Das",
    rating: BigInt(4),
    comment:
      "Dr. Anika Gupta treated my skin condition professionally. Great advice, clear prescription. Will definitely visit again!",
    date: "2024-12-05",
  },
  {
    id: "r4",
    clinicId: "clinic-1",
    patientId: "p4",
    patientName: "Rajiv Chatterjee",
    rating: BigInt(5),
    comment:
      "The booking process was seamless and I barely waited. Doctors are genuinely caring here. My family has been coming for 2 years.",
    date: "2024-12-01",
  },
];

// ─── Testimonial Carousel ─────────────────────────────────────────────────────
function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[active];
  if (!review) return null;

  return (
    <section
      ref={ref}
      data-ocid="testimonials.section"
      className="py-20"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.06 178) 0%, oklch(0.35 0.09 185) 100%)",
      }}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              What Our Patients Say
            </h2>
            <p className="mt-2 text-white/70">
              Real stories from real patients in Kolkata
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm md:p-10">
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-display text-lg font-bold text-white">
                {review.patientName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{review.patientName}</p>
                <p className="text-xs text-white/60">{review.date}</p>
              </div>
            </div>
            <StarRating rating={Number(review.rating)} />
            <p className="mt-4 text-lg leading-relaxed text-white/90 italic">
              "{review.comment}"
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              data-ocid="testimonials.prev_button"
              aria-label="Previous review"
              onClick={() =>
                setActive((p) => (p - 1 + reviews.length) % reviews.length)
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-smooth hover:bg-white/30"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {reviews.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  data-ocid={`testimonials.dot.${i + 1}`}
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              data-ocid="testimonials.next_button"
              aria-label="Next review"
              onClick={() => setActive((p) => (p + 1) % reviews.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-smooth hover:bg-white/30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { language } = useClinic();
  const { t } = useTranslation(language);

  const { data: doctors, isLoading: doctorsLoading } = useDoctors();
  const { data: reviews } = useReviews();

  const displayReviews =
    reviews && reviews.length > 0 ? reviews : fallbackReviews;

  // Sections
  const deptSection = useInView();
  const doctorSection = useInView();
  const ctaSection = useInView();

  // Hero slide-up on mount
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section
        data-ocid="hero.section"
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.20 0.07 178) 0%, oklch(0.32 0.10 182) 50%, oklch(0.24 0.06 172) 100%)",
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-medical.dim_1200x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />

        {/* Decorative rings */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/5 opacity-60" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/5 opacity-60" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-white/5 opacity-60" />
        </div>

        <div
          className="relative z-10 flex flex-col items-center gap-6"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
            <Activity size={14} className="text-amber-400" />
            SmileCare Clinic · Kolkata
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {t("hero_title")}
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {t("hero_subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/smilecare/book"
              search={{ doctorId: "" }}
              data-ocid="hero.book_cta_button"
            >
              <Button
                type="button"
                size="lg"
                className="min-w-[200px] bg-amber-500 text-white shadow-gold hover:bg-amber-400 font-semibold"
              >
                <CalendarCheck size={18} className="mr-2" />
                {t("hero_cta")}
              </Button>
            </Link>
            <Link to="/doctors" data-ocid="hero.doctors_link">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-w-[200px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                Meet Our Doctors
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 1.2s ease 0.6s",
          }}
          aria-hidden="true"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-white/30" />
        </div>
      </section>

      {/* ── Quick Stats Bar ── */}
      <section
        data-ocid="stats.section"
        className="border-b border-border bg-card shadow-subtle"
      >
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
            <StatItem
              icon={<Users size={20} />}
              value="3+"
              label="Expert Doctors"
            />
            <StatItem
              icon={<Award size={20} />}
              value="19+"
              label="Years Combined Exp."
            />
            <StatItem
              icon={<Heart size={20} />}
              value="5,000+"
              label="Patients Served"
            />
            <StatItem
              icon={<Shield size={20} />}
              value="3"
              label="Specialities"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Departments ── */}
      <section
        ref={deptSection.ref}
        data-ocid="departments.section"
        className="bg-background py-20"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Our Specialities
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive Care Under One Roof
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              SmileCare Clinic brings together specialists across key medical
              domains for holistic health management.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departmentData.map((dept, i) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                delay={i * 120}
                inView={deptSection.inView}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/departments" data-ocid="departments.view_all_link">
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                View All Departments
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Doctors ── */}
      <section
        ref={doctorSection.ref}
        data-ocid="doctors.section"
        className="bg-muted/30 py-20"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Meet Our Doctors
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Experienced & Caring Specialists
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Our doctors bring years of experience and genuine compassion to
              every consultation.
            </p>
          </div>

          {doctorsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
              {(doctors ?? []).map((doc, i) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  index={i}
                  inView={doctorSection.inView}
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/doctors" data-ocid="doctors.view_all_link">
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                View All Doctors
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection reviews={displayReviews} />

      {/* ── CTA Strip ── */}
      <section
        ref={ctaSection.ref}
        data-ocid="cta.section"
        className="bg-card py-16"
      >
        <div
          className="container mx-auto max-w-3xl px-4 text-center"
          style={{
            opacity: ctaSection.inView ? 1 : 0,
            transform: ctaSection.inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="rounded-2xl border border-amber-200/40 bg-amber-50/60 p-10 shadow-gold">
            <CalendarCheck
              size={36}
              className="mx-auto mb-4 text-amber-600"
              aria-hidden="true"
            />
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Ready to Book Your Appointment?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Skip the wait. Book online, arrive 15 minutes early, and get
              queue-based priority care at SmileCare Clinic.
            </p>
            <Link
              to="/smilecare/book"
              search={{ doctorId: "" }}
              className="mt-6 inline-block"
            >
              <Button
                type="button"
                size="lg"
                data-ocid="cta.book_now_button"
                className="bg-amber-500 text-white shadow-gold hover:bg-amber-400 font-semibold"
              >
                <CalendarCheck size={18} className="mr-2" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
