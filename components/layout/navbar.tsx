"use client";

import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          <span>LMS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/courses"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Courses
          </Link>
          {isLoaded && user && (
            <>
              <Link
                href="/my-courses"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Courses
              </Link>
              {user.publicMetadata?.role === "INSTRUCTOR" ||
              user.publicMetadata?.role === "ADMIN" ? (
                <Link
                  href="/instructor/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Instructor
                </Link>
              ) : null}
              {user.publicMetadata?.role === "ADMIN" ? (
                <Link
                  href="/admin/users"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Admin
                </Link>
              ) : null}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isLoaded && user ? (
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/courses">Courses</Link>
              </DropdownMenuItem>
              {isLoaded && user && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/my-courses">My Courses</Link>
                  </DropdownMenuItem>
                  {(user.publicMetadata?.role === "INSTRUCTOR" ||
                    user.publicMetadata?.role === "ADMIN") && (
                    <DropdownMenuItem asChild>
                      <Link href="/instructor/dashboard">Instructor</Link>
                    </DropdownMenuItem>
                  )}
                  {user.publicMetadata?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users">Admin</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
