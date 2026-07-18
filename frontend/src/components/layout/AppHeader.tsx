"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/types/auth.types";

const STUDENT_NAV = [
  { href: "/student/courses", label: "Catálogo" },
  { href: "/student/certificates", label: "Certificados" },
];

const INSTRUCTOR_NAV = [
  { href: "/instructor/dashboard", label: "Dashboard" },
  { href: "/instructor/courses", label: "Meus Cursos" },
];

export function AppHeader() {
  const { user, hasRole, logout } = useAuth();
  const navItems = hasRole(ROLES.INSTRUCTOR) ? INSTRUCTOR_NAV : STUDENT_NAV;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/80 px-6 py-4 backdrop-blur">
      <nav className="flex items-center gap-6">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          EduStream
        </span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">{user?.name}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-elevated"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
