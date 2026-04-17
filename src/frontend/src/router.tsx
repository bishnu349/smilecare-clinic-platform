import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { PatientLayout } from "./components/layout/PatientLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctorsPage from "./pages/admin/AdminDoctorsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminPatientsPage from "./pages/admin/AdminPatientsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import BookingPage from "./pages/booking/BookingPage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientLoginPage from "./pages/patient/PatientLoginPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import PatientRecordsPage from "./pages/patient/PatientRecordsPage";
import AboutPage from "./pages/public/AboutPage";
import { ContactPage } from "./pages/public/ContactPage";
import DepartmentsPage from "./pages/public/DepartmentsPage";
import DoctorsPage from "./pages/public/DoctorsPage";
import HomePage from "./pages/public/HomePage";
import { ReviewsPage } from "./pages/public/ReviewsPage";

// ─── Placeholder pages (will be replaced in subsequent waves) ─────────────────

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-3">
      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
        <span className="text-primary-foreground text-xl">✓</span>
      </div>
      <h1 className="text-2xl font-display font-bold text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">Page is loading content…</p>
    </div>
  </div>
);

// ─── Root route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ─── Public routes ────────────────────────────────────────────────────────────

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const departmentsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/departments",
  component: DepartmentsPage,
});

const doctorsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/doctors",
  component: DoctorsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/contact",
  component: ContactPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/reviews",
  component: ReviewsPage,
});

// ─── Booking route ────────────────────────────────────────────────────────────

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/smilecare/book",
  component: BookingPage,
});

// ─── Patient routes ───────────────────────────────────────────────────────────

const patientLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient/login",
  component: PatientLoginPage,
});

const patientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "patient-layout",
  component: () => (
    <PatientLayout>
      <Outlet />
    </PatientLayout>
  ),
});

const patientDashboardRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/patient/dashboard",
  component: PatientDashboard,
});

const patientAppointmentsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/patient/appointments",
  component: PatientAppointmentsPage,
});

const patientRecordsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/patient/records",
  component: PatientRecordsPage,
});

const patientProfileRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/patient/profile",
  component: PatientProfilePage,
});

// ─── Admin routes ─────────────────────────────────────────────────────────────

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminAppointmentsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/appointments",
  component: AdminAppointmentsPage,
});

const adminDoctorsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/doctors",
  component: AdminDoctorsPage,
});

const adminPatientsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/patients",
  component: AdminPatientsPage,
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/payments",
  component: AdminPaymentsPage,
});

const adminCouponsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/coupons",
  component: () => <PlaceholderPage title="Coupon Management" />,
});

const adminStaffRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/staff",
  component: () => <PlaceholderPage title="Staff Management" />,
});

const adminWhatsAppRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/whatsapp",
  component: () => <PlaceholderPage title="WhatsApp Notifications" />,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/settings",
  component: AdminSettingsPage,
});

// ─── Route tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    aboutRoute,
    departmentsRoute,
    doctorsRoute,
    contactRoute,
    reviewsRoute,
  ]),
  bookingRoute,
  patientLoginRoute,
  patientLayoutRoute.addChildren([
    patientDashboardRoute,
    patientAppointmentsRoute,
    patientRecordsRoute,
    patientProfileRoute,
  ]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminAppointmentsRoute,
    adminDoctorsRoute,
    adminPatientsRoute,
    adminPaymentsRoute,
    adminCouponsRoute,
    adminStaffRoute,
    adminWhatsAppRoute,
    adminSettingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
