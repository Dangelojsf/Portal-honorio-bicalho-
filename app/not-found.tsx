import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <section className="page-shell py-20">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-6 p-10 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/70">404</p>
          <h1 className="text-4xl font-semibold">Conteudo nao encontrado</h1>
          <p className="text-muted-foreground">
            A pagina ou noticia que voce tentou acessar nao esta disponivel no momento.
          </p>
          <Button asChild variant="accent">
            <Link href="/">Voltar para a home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
