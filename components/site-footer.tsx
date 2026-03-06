import Link from "next/link";

import { navigation, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-primary/10 bg-white/80 py-10 backdrop-blur">
      <div className="page-shell-wide flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-primary/70">Portal comunitario</p>
            <h2 className="text-2xl font-semibold text-foreground">{siteConfig.name}</h2>
            <p className="max-w-xl text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground transition hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.location}</p>
          <p>© 2026 Portal Honorio Bicalho</p>
        </div>
      </div>
    </footer>
  );
}
