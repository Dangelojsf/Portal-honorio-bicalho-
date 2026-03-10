import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesso da equipe do Portal Honorio Bicalho."
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
          eyebrow="Equipe do portal"
          title="Entrar no dashboard"
          description="Use suas credenciais de admin ou moderador para acessar o painel e gerenciar os conteudos permitidos."
          align="center"
        />
        <LoginForm callbackUrl={searchParams?.callbackUrl} />
      </div>
    </section>
  );
}
