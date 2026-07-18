import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppHeader } from "@/components/layout/AppHeader";
import { ROLES } from "@/types/auth.types";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
