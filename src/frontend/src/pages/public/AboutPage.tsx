import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Clock,
  DollarSign,
  Heart,
  Home,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({
  end,
  suffix,
  duration = 2000,
}: {
  end: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Patients Served", end: 5000, suffix: "+" },
  { label: "Departments", end: 3, suffix: "" },
  { label: "Years of Service", end: 6, suffix: "+" },
  { label: "Expert Doctors", end: 3, suffix: "" },
];

const whyUs = [
  {
    icon: Award,
    title: "Expert Doctors",
    desc: "Qualified specialists with years of clinical experience across multiple disciplines.",
  },
  {
    icon: Microscope,
    title: "Modern Equipment",
    desc: "State-of-the-art diagnostic and treatment tools for accurate, effective care.",
  },
  {
    icon: Heart,
    title: "Patient-First",
    desc: "Every decision is centered around patient wellbeing, comfort, and recovery.",
  },
  {
    icon: DollarSign,
    title: "Affordable Care",
    desc: "Quality treatment at transparent, fair prices with no hidden costs.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    desc: "Open Monday to Saturday, 9 AM to 8 PM — fitting care into your schedule.",
  },
  {
    icon: Stethoscope,
    title: "Multi-Speciality",
    desc: "General Medicine, Dentistry, and Skin Care all under one trusted roof.",
  },
];

const teamDoctors = [
  {
    initials: "RS",
    name: "Dr. Rahul Sharma",
    specialty: "Dentistry",
    experience: 5,
    color: "bg-primary",
  },
  {
    initials: "PS",
    name: "Dr. Priya Sen",
    specialty: "General Medicine",
    experience: 8,
    color: "bg-accent",
  },
  {
    initials: "AG",
    name: "Dr. Anika Gupta",
    specialty: "Skin Care",
    experience: 6,
    color: "bg-primary",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <section
        data-ocid="about.hero.section"
        className="relative overflow-hidden bg-primary py-16 md:py-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, oklch(0.38 0.11 178) 0%, oklch(0.52 0.13 178) 60%, oklch(0.44 0.11 178) 100%)",
        }}
      >
        {/* decorative circles */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary-foreground/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-primary-foreground/5" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-primary-foreground/70">
            <Home className="w-3.5 h-3.5" />
            <Link
              to="/"
              className="hover:text-primary-foreground transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-foreground font-medium">About</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-display font-bold text-primary-foreground leading-tight"
          >
            About SmileCare Clinic
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-primary-foreground/80 text-base md:text-lg max-w-xl"
          >
            A legacy of care, compassion, and clinical excellence in the heart
            of Kolkata.
          </motion.p>
        </div>
      </section>

      {/* ── Clinic Story ──────────────────────────────────────────────── */}
      <section
        data-ocid="about.story.section"
        className="bg-background py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-l-4 border-primary pl-6"
            >
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                Our Story
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-5 leading-snug">
                Caring for Kolkata <br className="hidden sm:block" />
                Since 2018
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  SmileCare Clinic was founded with a single, powerful purpose:
                  to bring accessible, high-quality multi-speciality healthcare
                  to the people of Kolkata. What began as a small practice in
                  the city has grown into a trusted multi-speciality centre
                  serving thousands of patients every year.
                </p>
                <p>
                  Our journey has been guided by an unwavering commitment to
                  patient-centered care. Every member of our team — from our
                  consultants to our support staff — believes that healing
                  starts with being heard. We combine modern diagnostics and
                  evidence-based medicine with the warmth and empathy that every
                  patient deserves.
                </p>
                <p>
                  Today, SmileCare spans three specializations: General
                  Medicine, Dentistry, and Skin Care. Our experienced doctors
                  bring together decades of combined expertise, making
                  comprehensive care available under one roof at fair,
                  transparent prices.
                </p>
              </div>
            </motion.div>

            {/* decorative card + stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {/* visual card */}
              <div className="relative rounded-2xl overflow-hidden h-52 md:h-64 bg-primary/10 flex items-center justify-center">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.44 0.11 178 / 0.15) 0%, oklch(0.68 0.16 68 / 0.15) 100%)",
                  }}
                />
                <div className="relative z-10 text-center px-8">
                  <Stethoscope className="w-16 h-16 text-primary mx-auto mb-3 opacity-80" />
                  <p className="font-display font-semibold text-foreground text-lg">
                    SmileCare Clinic
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kolkata's Multi-Speciality Healthcare Centre
                  </p>
                </div>
                <div className="pointer-events-none absolute top-4 right-4 w-24 h-24 rounded-full bg-primary/10" />
                <div className="pointer-events-none absolute bottom-4 left-4 w-16 h-16 rounded-full bg-accent/10" />
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="bg-card border border-border rounded-xl p-4 text-center shadow-sm"
                  >
                    <p className="text-2xl md:text-3xl font-display font-bold text-primary">
                      <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────────── */}
      <section
        data-ocid="about.mission.section"
        className="bg-muted/30 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              Purpose & Direction
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Mission &amp; Vision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 h-full border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Delivering accessible, high-quality healthcare to every
                  patient in Kolkata with compassion and modern medical
                  expertise — because everyone deserves care that respects their
                  dignity and time.
                </p>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 h-full border-t-4 border-t-accent shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be Kolkata's most trusted multi-speciality clinic — where
                  every patient feels heard, cared for, and leaves healthier. We
                  envision a healthier city, one family at a time.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <section
        data-ocid="about.why.section"
        className="bg-background py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              Our Strengths
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Why Patients Trust SmileCare
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                data-ocid={`about.why.item.${i + 1}`}
              >
                <Card className="p-6 h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-border">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Highlights ───────────────────────────────────────────── */}
      <section
        data-ocid="about.team.section"
        className="bg-muted/30 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              Meet the Team
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Our Medical Team
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">
              Our doctors bring together years of expertise, compassion, and
              dedication to delivering the best possible care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {teamDoctors.map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                data-ocid={`about.team.item.${i + 1}`}
              >
                <Card className="p-6 flex flex-col items-center text-center group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div
                    className={`w-16 h-16 rounded-full ${doc.color} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <span className="text-xl font-display font-bold text-primary-foreground">
                      {doc.initials}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-1">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{doc.experience} yrs experience</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section
        data-ocid="about.cta.section"
        className="bg-primary py-16 md:py-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, oklch(0.38 0.11 178) 0%, oklch(0.52 0.13 178) 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3 leading-snug">
              Ready to experience compassionate healthcare?
            </h2>
            <p className="text-primary-foreground/75 mb-8 text-sm md:text-base max-w-lg mx-auto">
              Book your appointment at SmileCare Clinic today and take the first
              step toward better health.
            </p>
            <Button
              asChild
              size="lg"
              data-ocid="about.cta.book_button"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/smilecare/book" search={{ doctorId: "" }}>
                Book an Appointment
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
