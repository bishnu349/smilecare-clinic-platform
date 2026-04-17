import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_FORM: ContactForm = { name: "", email: "", phone: "", message: "" };

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "123 Park Street, Kolkata, West Bengal 700016",
    href: undefined,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@smilecare.in",
    href: "mailto:info@smilecare.in",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon–Sat: 9:00 AM – 8:00 PM",
    href: undefined,
  },
];

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const e: Partial<ContactForm> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    toast.success("Message sent successfully! We'll get back to you soon.");
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero */}
      <section
        className="gradient-hero py-14 px-4"
        data-ocid="contact.hero_section"
      >
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-primary-foreground transition-smooth"
              data-ocid="contact.breadcrumb_home"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-foreground font-medium">
              Contact Us
            </span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground leading-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl text-lg">
            Have questions or need to reach us? We're here to help, every step
            of the way.
          </p>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section
        className="py-16 px-4 bg-background"
        data-ocid="contact.info_section"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Visit us at the clinic or reach out via phone or email. Our
                friendly staff is happy to assist you.
              </p>
            </div>

            <div className="space-y-5">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-md">
                    <Icon className="w-4.5 h-4.5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-foreground font-medium hover:text-primary transition-smooth"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-smooth"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div
            className="rounded-2xl overflow-hidden border border-border shadow-elevated"
            data-ocid="contact.map_section"
          >
            <iframe
              title="SmileCare Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.8223!2d88.26495!3d22.535565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="py-16 px-4 bg-muted/30"
        data-ocid="contact.form_section"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground">
              Send Us a Message
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fill in the form below and we'll respond within 24 hours.
            </p>
          </div>

          <Card className="shadow-elevated border-border">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ananya Das"
                      value={form.name}
                      onChange={handleChange}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                      data-ocid="contact.name_input"
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-xs text-destructive"
                        data-ocid="contact.name_input.field_error"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ananya@example.com"
                      value={form.email}
                      onChange={handleChange}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      aria-invalid={!!errors.email}
                      data-ocid="contact.email_input"
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-xs text-destructive"
                        data-ocid="contact.email_input.field_error"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone (optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-medium">
                    Phone{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    data-ocid="contact.phone_input"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="font-medium">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="How can we help you? Describe your query or feedback…"
                    value={form.message}
                    onChange={handleChange}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    aria-invalid={!!errors.message}
                    data-ocid="contact.message_textarea"
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-xs text-destructive"
                      data-ocid="contact.message_textarea.field_error"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-gold transition-smooth h-11"
                  data-ocid="contact.submit_button"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
