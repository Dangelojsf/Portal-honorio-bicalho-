import type { Metadata } from "next";

import { CommunityCard } from "@/components/community-card";
import { EmptyState } from "@/components/empty-state";
import { FormSubmitButton } from "@/components/form-submit-button";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, getCommunityPosts } from "@/lib/repositories";

import { submitCommunityPostAction } from "./actions";

export const metadata: Metadata = {
  title: "Comunidade",
  description: "Quadro comunitario com anuncios, vagas, servicos e achados e perdidos em Honorio Bicalho."
};

interface CommunityPageProps {
  searchParams?: {
    submitted?: string;
    error?: string;
  };
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const [posts, categories] = await Promise.all([getCommunityPosts("approved"), getCategories("community")]);

  return (
    <section className="page-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="paper-panel">
          <CardHeader>
            <CardTitle>Publicar no quadro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SectionHeading
              eyebrow="Participacao"
              title="Envie um aviso para a comunidade"
              description="As publicacoes passam por moderacao administrativa antes de aparecerem publicamente."
            />
            {searchParams?.submitted ? (
              <div className="rounded-[1.5rem] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                Publicacao enviada com sucesso. Ela sera revisada antes de aparecer no portal.
              </div>
            ) : null}
            {searchParams?.error ? (
              <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Nao foi possivel enviar. Revise os campos e tente novamente.
              </div>
            ) : null}
            <form action={submitCommunityPostAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  Titulo
                </label>
                <Input id="title" name="title" placeholder="Ex.: Procuro ajudante para obra" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="authorName">
                  Seu nome
                </label>
                <Input id="authorName" name="authorName" placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="authorEmail">
                  Email
                </label>
                <Input id="authorEmail" name="authorEmail" type="email" placeholder="voce@exemplo.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="categoryId">
                  Categoria
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="flex h-11 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  defaultValue=""
                >
                  <option value="">Selecione</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="content">
                  Conteudo
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Descreva seu anuncio, vaga, servico ou item perdido."
                  required
                />
              </div>
              <FormSubmitButton type="submit" variant="accent" className="w-full">
                Enviar para moderacao
              </FormSubmitButton>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <SectionHeading
            eyebrow="Quadro comunitario"
            title="Publicacoes aprovadas"
            description="Avisos publicados por moradores e validados pela administracao do portal."
          />
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((item) => (
                <CommunityCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma publicacao aprovada ainda"
              description="Assim que os primeiros avisos forem moderados, eles aparecerao aqui."
            />
          )}
        </div>
      </div>
    </section>
  );
}
