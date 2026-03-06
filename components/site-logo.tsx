import { Landmark } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
        <Landmark className="h-5 w-5" />
      </div>
      <div className="leading-none">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/65">Portal</p>
        <p className="mt-1 text-base font-semibold text-white sm:text-lg">Honorio Bicalho</p>
      </div>
    </Link>
  );
}
