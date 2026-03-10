"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

import { SiteLogo } from "./site-logo";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-40 pt-3">
      <div className="page-shell-wide">
        <div className="rounded-t-[1.5rem] border border-white/10 bg-primary/95 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-2 sm:px-6">
            <SiteLogo className="shrink-0" />
            <nav className="hidden min-w-0 flex-1 items-center justify-between gap-1 lg:flex lg:pl-5 xl:pl-8">
              {navigation.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex-1 border-b-2 border-transparent px-2 py-2 text-center text-sm font-medium whitespace-nowrap text-white/82 transition hover:text-white",
                      active && "border-white text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden shrink-0 items-center gap-2 pl-4 lg:flex">
              <Button asChild variant="accent" size="sm" className="h-9 px-4">
                <Link href="/admin">Login Adm</Link>
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-2 lg:hidden">
              <Button asChild variant="accent" size="sm" className="h-9 px-4">
                <Link href="/admin">Login Adm</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white"
                aria-label="Navegacao do portal"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <nav className="scrollbar-none flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2.5 lg:hidden sm:px-6">
            {navigation.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "border-b-2 border-transparent px-2 py-1.5 text-sm font-medium whitespace-nowrap text-white/82 transition hover:text-white",
                    active && "border-white text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
