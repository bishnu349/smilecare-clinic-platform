import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import { ClinicProvider } from "./context/ClinicContext";
import { router } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <RouterProvider router={router} />
      </ClinicProvider>
    </AuthProvider>
  );
}
