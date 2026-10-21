import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRIMARY = [
  { to: "/", label: "Dashboard", match: (p: string) => p === "/" },
  { to: "/students", label: "Students", match: (p: string) => p.startsWith("/students") },
  { to: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") },
  { to: "/teams", label: "Teams", match: (p: string) => p.startsWith("/teams") },
  { to: "/attendance", label: "Attendance", match: (p: string) => p.startsWith("/attendance") },
  { to: "/calendar", label: "Calendar", match: (p: string) => p.startsWith("/calendar") },
] as const;

const MORE = [
  { to: "/form-builder", label: "Form Builder" },
  { to: "/posts", label: "Posts" },
  { to: "/pms", label: "Project Managers" },
  { to: "/register", label: "Public form" },
] as const;

function moreActive(path: string) {
  return MORE.some((item) => path.startsWith(item.to) && item.to !== "/register");
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const moreOn = moreActive(path);

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-[1400px] px-3 pt-4 pb-16 sm:px-6 sm:pt-6">
        <header className="sticky top-3 z-40 mb-6 sm:mb-8">
          <nav className="flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-nav sm:px-5">
            <Link to="/" className="shrink-0 px-2 text-base font-semibold tracking-tight text-ink sm:px-3">
              Incubation
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
              {PRIMARY.map((item) => {
                const active = item.match(path);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-card text-ink shadow-pill"
                        : "text-nav hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium outline-none",
                    moreOn ? "bg-card text-ink shadow-pill" : "text-nav hover:text-ink",
                  )}
                >
                  More
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {MORE.map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link to={item.to}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open menu"
              >
                {open ? <X /> : <Menu />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-card text-sm font-semibold text-ink shadow-soft hover:bg-muted"
                    aria-label="Admin Profile"
                  >
                    A
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-semibold text-ink" disabled>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Switch Account / Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async () => {
                      const { adminAuth } = await import("@/lib/auth/admin-auth");
                      await adminAuth.logout();
                      window.location.href = "/login";
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {open ? (
            <div className="mt-2 rounded-2xl bg-card p-2 shadow-nav lg:hidden">
              {PRIMARY.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium",
                    item.match(path) ? "bg-muted text-ink" : "text-nav",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {MORE.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium",
                    path.startsWith(item.to) && item.to !== "/register"
                      ? "bg-muted text-ink"
                      : "text-nav",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
