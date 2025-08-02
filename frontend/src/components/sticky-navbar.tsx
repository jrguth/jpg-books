"use client";

import { useState, useEffect } from "react";
import { LibraryBig, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function StickyNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "My Library", href: "#" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 inline-flex gap-2">
              <LibraryBig />
              Books Books Books!
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-baseline">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "transition-colors duration-200",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="ml-auto">
                  <SignOutButton />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="outline"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/80 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "transition-colors duration-200 text-foreground bg-background/50 backdrop-blur-md",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <Button size="sm" variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      )}
    </>
  );
}
