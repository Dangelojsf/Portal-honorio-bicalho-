import Image from "next/image";
import Link from "next/link";

import { navigation, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 overflow-hidden border-t border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,_rgba(47,211,214,0.18),_transparent_28%),linear-gradient(135deg,_#062c33_0%,_#0a3a3e_46%,_#0d2f37_100%)] py-10 text-white">
      <div className="page-shell-wide flex flex-col gap-8">
        <div className="flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur md:flex-row md:items-stretch md:justify-between">
          <div className="flex max-w-2xl flex-1 flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Portal comunitario</p>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{siteConfig.name}</h2>
              <p className="max-w-xl text-sm leading-7 text-white/72">{siteConfig.description}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-sm text-white/78 transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[1.75rem] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">Desenvolvido por</p>
            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-[#051e25]/70 p-4">
              <Image
                src="/images/arandu-tech-logo.svg"
                alt="Logo da ARANDU TECH"
                width={720}
                height={280}
                className="h-auto w-full"
                priority={false}
              />
            </div>
            <p className="mt-4 text-base font-medium text-white">Tecnologia para transformar o modo de viver</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Solucoes digitais para conectar servicos, comunidades e experiencias locais com mais clareza, presenca e
              resultado.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/64 md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.location}</p>
          <div className="flex flex-col gap-1 md:items-end">
            <p>Portal Honorio Bicalho</p>
            <p>Assinatura digital por ARANDU TECH</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
