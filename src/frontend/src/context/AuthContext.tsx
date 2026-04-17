import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AdminSession, PatientSession } from "../types";

const PATIENT_SESSION_KEY = "patient_session";
const ADMIN_SESSION_KEY = "admin_session";
const ADMIN_EMAIL = "admin@smilecare.in";

interface AuthContextValue {
  patientSession: PatientSession | null;
  adminSession: AdminSession | null;
  loginPatient: (patient: PatientSession) => void;
  loginAdmin: (email: string) => boolean;
  logoutPatient: () => void;
  logoutAdmin: () => void;
  isPatientLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  patientSession: null,
  adminSession: null,
  loginPatient: () => {},
  loginAdmin: () => false,
  logoutPatient: () => {},
  logoutAdmin: () => {},
  isPatientLoggedIn: false,
  isAdminLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [patientSession, setPatientSession] = useState<PatientSession | null>(
    () => {
      try {
        const raw = localStorage.getItem(PATIENT_SESSION_KEY);
        return raw ? (JSON.parse(raw) as PatientSession) : null;
      } catch {
        return null;
      }
    },
  );

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (patientSession) {
      localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(patientSession));
    } else {
      localStorage.removeItem(PATIENT_SESSION_KEY);
    }
  }, [patientSession]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [adminSession]);

  const loginPatient = (patient: PatientSession) => setPatientSession(patient);

  const loginAdmin = (email: string): boolean => {
    if (email === ADMIN_EMAIL) {
      setAdminSession({ email });
      return true;
    }
    return false;
  };

  const logoutPatient = () => setPatientSession(null);
  const logoutAdmin = () => setAdminSession(null);

  return (
    <AuthContext.Provider
      value={{
        patientSession,
        adminSession,
        loginPatient,
        loginAdmin,
        logoutPatient,
        logoutAdmin,
        isPatientLoggedIn: patientSession !== null,
        isAdminLoggedIn: adminSession !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
