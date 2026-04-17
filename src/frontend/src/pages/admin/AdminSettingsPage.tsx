import { Building2, Globe, Palette, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";
import { useClinic } from "../../context/ClinicContext";
import { useClinicInfo, useUpdateClinicInfo } from "../../hooks/useQueries";
import type { Clinic, Language } from "../../types";

const LANGUAGES: {
  code: Language;
  label: string;
  flag: string;
  native: string;
}[] = [
  { code: "en", label: "English", flag: "🇬🇧", native: "English" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { code: "bn", label: "Bengali", flag: "🇧🇩", native: "বাংলা" },
];

export default function AdminSettingsPage() {
  const { data: clinicInfo, isLoading } = useClinicInfo();
  const updateClinicInfo = useUpdateClinicInfo();
  const { language, setLanguage } = useClinic();

  const [form, setForm] = useState<Clinic | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#0f766e");
  const [accentColor, setAccentColor] = useState("#b5832d");

  useEffect(() => {
    if (clinicInfo && !form) {
      setForm(clinicInfo);
      if (clinicInfo.primaryColor) setPrimaryColor(clinicInfo.primaryColor);
      if (clinicInfo.accentColor) setAccentColor(clinicInfo.accentColor);
    }
  }, [clinicInfo, form]);

  const handleSaveInfo = () => {
    if (!form) return;
    updateClinicInfo.mutate(form);
    toast.success("Clinic information updated");
  };

  const handleSaveColors = () => {
    if (!form) return;
    updateClinicInfo.mutate({ ...form, primaryColor, accentColor });
    toast.success("Brand colors updated");
  };

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    toast.success(
      `Language switched to ${LANGUAGES.find((l) => l.code === lang)?.label}`,
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.settings_page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage clinic information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinic Information */}
        <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Clinic Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {form && (
              <>
                {(
                  [
                    { key: "name", label: "Clinic Name" },
                    { key: "tagline", label: "Tagline" },
                    { key: "address", label: "Address" },
                    { key: "phone", label: "Phone Number" },
                    { key: "email", label: "Email Address" },
                    { key: "workingHours", label: "Working Hours" },
                  ] as { key: keyof Clinic; label: string }[]
                ).map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <label
                      htmlFor={`clinic-${key}`}
                      className="text-sm font-medium text-foreground"
                    >
                      {label}
                    </label>
                    <input
                      id={`clinic-${key}`}
                      type={key === "email" ? "email" : "text"}
                      value={String(form[key] ?? "")}
                      onChange={(e) =>
                        setForm((f) =>
                          f ? { ...f, [key]: e.target.value } : f,
                        )
                      }
                      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid={`admin.settings.${key}_input`}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSaveInfo}
                  disabled={updateClinicInfo.isPending}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-smooth shadow-subtle"
                  data-ocid="admin.settings.save_info_button"
                >
                  <Save className="w-4 h-4" />
                  {updateClinicInfo.isPending ? "Saving…" : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Brand Colors
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Primary Color */}
            <div className="space-y-2">
              <label
                htmlFor="primary-color-picker"
                className="text-sm font-medium text-foreground"
              >
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    id="primary-color-picker"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-input cursor-pointer p-0.5 bg-transparent"
                    data-ocid="admin.settings.primary_color_picker"
                  />
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="admin.settings.primary_color_input"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label
                htmlFor="accent-color-picker"
                className="text-sm font-medium text-foreground"
              >
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="accent-color-picker"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-input cursor-pointer p-0.5 bg-transparent"
                  data-ocid="admin.settings.accent_color_picker"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="admin.settings.accent_color_input"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Preview
              </p>
              <div
                className="rounded-xl p-4 space-y-3 border border-border"
                style={{ background: "#f8fafaf" }}
              >
                <div
                  className="h-9 px-4 rounded-lg flex items-center justify-center text-sm font-medium text-white shadow"
                  style={{ background: primaryColor }}
                >
                  Book Appointment
                </div>
                <div
                  className="h-9 px-4 rounded-lg flex items-center justify-center text-sm font-medium text-white shadow"
                  style={{ background: accentColor }}
                >
                  Learn More
                </div>
                <div
                  className="h-10 rounded-lg flex items-center px-4 text-sm font-semibold text-white"
                  style={{ background: primaryColor }}
                >
                  SmileCare Clinic — Admin Panel
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveColors}
              disabled={updateClinicInfo.isPending}
              className="flex items-center gap-2 h-10 px-5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-smooth shadow-subtle"
              data-ocid="admin.settings.save_colors_button"
            >
              <Save className="w-4 h-4" />
              Save Colors
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            Language Settings
          </h2>
          <span className="text-sm text-muted-foreground ml-1">
            — for public website
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangSelect(lang.code)}
                  className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-smooth text-center ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                  }`}
                  data-ocid={`admin.settings.lang_${lang.code}`}
                >
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
                  )}
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <p
                      className={`font-display font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {lang.native}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Selected language will be applied to the public-facing website —
            Home, Booking, and navigation translations.
          </p>
        </div>
      </div>
    </div>
  );
}
