import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesso administrativo do Portal Honorio Bicalho."
};

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Administracao"
          title="Entrar no dashboard"
          description="Use as credenciais administrativas para moderar conteudos, eventos e negocios do portal."
          align="center"
        />
        <LoginForm callbackUrl={searchParams?.callbackUrl} />
      </div>
    </section>
  );
}
