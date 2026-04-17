import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useClinicInfo } from "../hooks/useQueries";
import type { Clinic, Language } from "../types";

interface ClinicContextValue {
  clinicInfo: Clinic | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const ClinicContext = createContext<ClinicContextValue>({
  clinicInfo: null,
  language: "en",
  setLanguage: () => {},
  isLoading: true,
});

function ClinicProviderInner({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("lang") as Language) || "en";
  });

  const { data: clinicInfo, isLoading } = useClinicInfo();

  useEffect(() => {
    if (clinicInfo?.primaryColor) {
      document.documentElement.style.setProperty(
        "--color-primary-override",
        clinicInfo.primaryColor,
      );
    }
  }, [clinicInfo]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo: clinicInfo ?? null,
        language,
        setLanguage: handleSetLanguage,
        isLoading,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function ClinicProvider({ children }: { children: ReactNode }) {
  return <ClinicProviderInner>{children}</ClinicProviderInner>;
}

export function useClinic() {
  return useContext(ClinicContext);
}
