import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminSignOutButton } from "@/components/admin-signout-button";
import { EmptyState } from "@/components/empty-state";
import { FormSubmitButton } from "@/components/form-submit-button";
import { ImageUploadField } from "@/components/image-upload-field";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  approveCommunityPostAction,
  deleteBusinessAction,
  deleteCommunityPostAction,
  deleteEventAction,
  deleteNewsAction,
  deleteTourismSpotAction,
  rejectCommunityPostAction,
  saveBusinessAction,
  saveEventAction,
  saveModeratorAction,
  saveNewsAction,
  saveSiteSettingsAction,
  saveTourismSpotAction
} from "@/app/admin/actions";
import { authOptions } from "@/lib/auth";
import { getAdminSnapshot, getAuditLogs, getModeratorUsers } from "@/lib/repositories";
import type { PortalAuditLog, PortalBusiness, PortalEvent, PortalNews, PortalSiteSettings, PortalTourismSpot, PortalUser } from "@/types/portal";

function toDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function categoriesByType(
  categories: Awaited<ReturnType<typeof getAdminSnapshot>>["categories"],
  type: "news" | "business" | "community"
) {
  return categories.filter((item) => item.type === type);
}

function isNextControlFlowError(error: unknown) {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  const digest = typeof error.digest === "string" ? error.digest : "";
  return (
    digest === "DYNAMIC_SERVER_USAGE" ||
    digest === "NEXT_NOT_FOUND" ||
    digest.startsWith("NEXT_REDIRECT;") ||
    digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;")
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions).catch((error) => {
    if (isNextControlFlowError(error)) {
      throw error;
    }

    console.error("[admin] Falha ao recuperar sessao:", error);
    return null;
  });

  const isAdmin = session?.user.role === "admin";
  const canAccessAdmin = session?.user && (session.user.role === "admin" || session.user.role === "moderator");

  if (!canAccessAdmin) {
    redirect("/login?callbackUrl=/painel");
  }

  const snapshotPromise = getAdminSnapshot();
  const moderatorsPromise = isAdmin ? getModeratorUsers() : Promise.resolve([] as PortalUser[]);
  const auditLogsPromise = isAdmin ? getAuditLogs(60) : Promise.resolve([] as PortalAuditLog[]);

  const [snapshotResult, moderatorsResult, auditLogsResult] = await Promise.allSettled([
    snapshotPromise,
    moderatorsPromise,
    auditLogsPromise
  ]);

  if (snapshotResult.status !== "fulfilled") {
    console.error("[admin] Falha ao carregar snapshot administrativo:", snapshotResult.reason);
    throw new Error("Nao foi possivel carregar o painel administrativo.");
  }

  if (moderatorsResult.status !== "fulfilled") {
    console.error("[admin] Falha ao carregar moderadores:", moderatorsResult.reason);
  }

  if (auditLogsResult.status !== "fulfilled") {
    console.error("[admin] Falha ao carregar historico:", auditLogsResult.reason);
  }

  const snapshot = snapshotResult.value;
  const moderators = moderatorsResult.status === "fulfilled" ? moderatorsResult.value : [];
  const auditLogs = auditLogsResult.status === "fulfilled" ? auditLogsResult.value : [];
  const newsCategories = categoriesByType(snapshot.categories, "news");
  const businessCategories = categoriesByType(snapshot.categories, "business");
  const metrics = isAdmin
    ? [...snapshot.metrics, { label: "Moderadores", value: moderators.length.toString() }]
    : snapshot.metrics;

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Painel administrativo"
            title={isAdmin ? "Gerencie o portal" : "Gerencie os conteudos"}
            description={
              isAdmin
                ? "Cadastre noticias, eventos, negocios, pontos turisticos, modere a comunidade e gerencie moderadores."
                : "Cadastre noticias, eventos, negocios, pontos turisticos e modere as publicacoes da comunidade."
            }
          />
          <AdminSignOutButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="news" className="space-y-4">
          <TabsList>
            <TabsTrigger value="news">Noticias</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="businesses">Negocios</TabsTrigger>
            <TabsTrigger value="tourism">Turismo</TabsTrigger>
            <TabsTrigger value="community">Comunidade</TabsTrigger>
            {isAdmin ? <TabsTrigger value="appearance">Aparencia</TabsTrigger> : null}
            {isAdmin ? <TabsTrigger value="users">Usuarios</TabsTrigger> : null}
            {isAdmin ? <TabsTrigger value="history">Historico</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="news">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <AdminCard title="Nova noticia">
                <NewsForm action={saveNewsAction} categories={newsCategories} />
              </AdminCard>
              <div className="space-y-4">
                {snapshot.news.map((item) => (
                  <AdminCard key={item.id} title={item.title}>
                    <NewsForm action={saveNewsAction} categories={newsCategories} initial={item} />
                    <DeleteForm action={deleteNewsAction} id={item.id} title={item.title} />
                  </AdminCard>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <AdminCard title="Novo evento">
                <EventForm action={saveEventAction} />
              </AdminCard>
              <div className="space-y-4">
                {snapshot.events.map((item) => (
                  <AdminCard key={item.id} title={item.title}>
                    <EventForm action={saveEventAction} initial={item} />
                    <DeleteForm action={deleteEventAction} id={item.id} title={item.title} />
                  </AdminCard>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="businesses">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <AdminCard title="Novo negocio">
                <BusinessForm action={saveBusinessAction} categories={businessCategories} />
              </AdminCard>
              <div className="space-y-4">
                {snapshot.businesses.map((item) => (
                  <AdminCard key={item.id} title={item.name}>
                    <BusinessForm action={saveBusinessAction} categories={businessCategories} initial={item} />
                    <DeleteForm action={deleteBusinessAction} id={item.id} title={item.name} />
                  </AdminCard>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tourism">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <AdminCard title="Novo ponto turistico">
                <TourismForm action={saveTourismSpotAction} />
              </AdminCard>
              <div className="space-y-4">
                {snapshot.tourismSpots.map((item) => (
                  <AdminCard key={item.id} title={item.name}>
                    <TourismForm action={saveTourismSpotAction} initial={item} />
                    <DeleteForm action={deleteTourismSpotAction} id={item.id} title={item.name} />
                  </AdminCard>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="community">
            {snapshot.communityPosts.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {snapshot.communityPosts.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.authorName}</p>
                        </div>
                        <Badge variant={item.status === "approved" ? "default" : item.status === "pending" ? "accent" : "muted"}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                      <div className="flex flex-wrap gap-3">
                        <InlineActionForm action={approveCommunityPostAction} id={item.id} title={item.title} label="Aprovar" />
                        <InlineActionForm action={rejectCommunityPostAction} id={item.id} title={item.title} label="Rejeitar" variant="secondary" />
                        <InlineActionForm action={deleteCommunityPostAction} id={item.id} title={item.title} label="Excluir" variant="ghost" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sem publicacoes para moderar"
                description="Novos posts do quadro comunitario aparecerao aqui para aprovacao ou rejeicao."
              />
            )}
          </TabsContent>

          {isAdmin ? (
            <TabsContent value="appearance">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <AdminCard title="Imagens e textos globais">
                  <SiteSettingsForm action={saveSiteSettingsAction} initial={snapshot.siteSettings} />
                </AdminCard>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Preview rapido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Hero da home</p>
                      <div className="overflow-hidden rounded-[1.5rem] border border-border">
                        <img
                          src={snapshot.siteSettings.heroImage}
                          alt={snapshot.siteSettings.heroTitle}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                      <p className="text-lg font-semibold">{snapshot.siteSettings.heroTitle}</p>
                      <p className="text-sm text-muted-foreground">{snapshot.siteSettings.heroSubtitle}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Bloco de historia</p>
                      <div className="overflow-hidden rounded-[1.5rem] border border-border">
                        <img
                          src={snapshot.siteSettings.historyImage}
                          alt={snapshot.siteSettings.historyTitle}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                      <p className="text-lg font-semibold">{snapshot.siteSettings.historyTitle}</p>
                      <p className="text-sm text-muted-foreground">{snapshot.siteSettings.historyDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ) : null}

          {isAdmin ? (
            <TabsContent value="users">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <AdminCard title="Novo moderador">
                  <ModeratorForm action={saveModeratorAction} />
                </AdminCard>
                <div className="space-y-4">
                  {moderators.length ? (
                    moderators.map((item) => (
                      <AdminCard key={item.id} title={item.name}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-muted-foreground">{item.email}</p>
                          <Badge variant={item.isActive ? "default" : "muted"}>{item.isActive ? "ativo" : "inativo"}</Badge>
                        </div>
                        <ModeratorForm action={saveModeratorAction} initial={item} />
                      </AdminCard>
                    ))
                  ) : (
                    <EmptyState
                      title="Nenhum moderador cadastrado"
                      description="Crie moderadores para ajudar com conteudo sem liberar alteracoes de aparencia ou usuarios."
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          ) : null}

          {isAdmin ? (
            <TabsContent value="history">
              {auditLogs.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {auditLogs.map((item) => (
                    <AuditLogCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Sem historico registrado"
                  description="As proximas alteracoes feitas no painel aparecerao aqui com usuario, acao e horario."
                />
              )}
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </section>
  );
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required = true
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} required={required} />
    </div>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <Textarea id={name} name={name} defaultValue={defaultValue ?? ""} placeholder={placeholder} required />
    </div>
  );
}

function CategorySelect({
  name,
  label,
  categories,
  defaultValue
}: {
  name: string;
  label: string;
  categories: Array<{ id: string; name: string }>;
  defaultValue?: string | null;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="flex h-11 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Selecione</option>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function NewsForm({
  action,
  categories,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Array<{ id: string; name: string }>;
  initial?: PortalNews;
}) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <Field label="Titulo" name="title" defaultValue={initial?.title} />
      <Field label="Slug" name="slug" defaultValue={initial?.slug} placeholder="titulo-da-noticia" />
      <Field label="Autor" name="author" defaultValue={initial?.author ?? "Redacao do Portal"} />
      <ImageUploadField label="Imagem" name="image" defaultValue={initial?.image ?? "/images/news-scene.svg"} />
      <Field label="Publicado em" name="publishedAt" type="datetime-local" defaultValue={initial ? toDateTimeLocal(initial.publishedAt) : ""} />
      <CategorySelect name="categoryId" label="Categoria" categories={categories} defaultValue={initial?.category?.id} />
      <TextareaField label="Conteudo" name="content" defaultValue={initial?.content} />
      <FormSubmitButton type="submit" variant="accent">
        {initial ? "Salvar alteracoes" : "Cadastrar noticia"}
      </FormSubmitButton>
    </form>
  );
}

function EventForm({
  action,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: PortalEvent;
}) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <Field label="Titulo" name="title" defaultValue={initial?.title} />
      <Field label="Data" name="date" type="datetime-local" defaultValue={initial ? toDateTimeLocal(initial.date) : ""} />
      <Field label="Horario" name="time" defaultValue={initial?.time} placeholder="19h" />
      <Field label="Local" name="location" defaultValue={initial?.location} />
      <Field label="Organizador" name="organizer" defaultValue={initial?.organizer} />
      <ImageUploadField label="Imagem" name="image" defaultValue={initial?.image ?? "/images/event-scene.svg"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude" name="latitude" type="number" defaultValue={initial?.latitude} required={false} />
        <Field label="Longitude" name="longitude" type="number" defaultValue={initial?.longitude} required={false} />
      </div>
      <TextareaField label="Descricao" name="description" defaultValue={initial?.description} />
      <FormSubmitButton type="submit" variant="accent">
        {initial ? "Salvar evento" : "Cadastrar evento"}
      </FormSubmitButton>
    </form>
  );
}

function BusinessForm({
  action,
  categories,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Array<{ id: string; name: string }>;
  initial?: PortalBusiness;
}) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <Field label="Nome" name="name" defaultValue={initial?.name} />
      <Field label="Slug" name="slug" defaultValue={initial?.slug} />
      <CategorySelect name="categoryId" label="Categoria" categories={categories} defaultValue={initial?.category?.id} />
      <Field label="Endereco" name="address" defaultValue={initial?.address} />
      <Field label="Telefone" name="phone" defaultValue={initial?.phone} />
      <Field label="Website" name="website" defaultValue={initial?.website} required={false} />
      <Field label="Instagram" name="instagram" defaultValue={initial?.instagram} required={false} />
      <ImageUploadField
        label="Imagem"
        name="images"
        defaultValue={initial?.images[0] ?? "/images/business-scene.svg"}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude" name="latitude" type="number" defaultValue={initial?.latitude} required={false} />
        <Field label="Longitude" name="longitude" type="number" defaultValue={initial?.longitude} required={false} />
      </div>
      <TextareaField label="Descricao" name="description" defaultValue={initial?.description} />
      <FormSubmitButton type="submit" variant="accent">
        {initial ? "Salvar negocio" : "Cadastrar negocio"}
      </FormSubmitButton>
    </form>
  );
}

function TourismForm({
  action,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: PortalTourismSpot;
}) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <Field label="Nome" name="name" defaultValue={initial?.name} />
      <Field label="Slug" name="slug" defaultValue={initial?.slug} />
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="type">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          defaultValue={initial?.type ?? "trilhas"}
          className="flex h-11 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="trilhas">Trilhas</option>
          <option value="cachoeiras">Cachoeiras</option>
          <option value="mirantes">Mirantes</option>
          <option value="historico">Historico</option>
        </select>
      </div>
      <Field label="Dificuldade" name="difficulty" defaultValue={initial?.difficulty} />
      <Field label="Local" name="location" defaultValue={initial?.location} />
      <ImageUploadField label="Imagem" name="image" defaultValue={initial?.image ?? "/images/tourism-scene.svg"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude" name="latitude" type="number" defaultValue={initial?.latitude} required={false} />
        <Field label="Longitude" name="longitude" type="number" defaultValue={initial?.longitude} required={false} />
      </div>
      <TextareaField label="Descricao" name="description" defaultValue={initial?.description} />
      <FormSubmitButton type="submit" variant="accent">
        {initial ? "Salvar ponto" : "Cadastrar ponto"}
      </FormSubmitButton>
    </form>
  );
}

function DeleteForm({
  action,
  id,
  title
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  title: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="entityTitle" value={title} />
      <FormSubmitButton type="submit" variant="ghost">
        Excluir
      </FormSubmitButton>
    </form>
  );
}

function InlineActionForm({
  action,
  id,
  title,
  label,
  variant = "accent"
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  title: string;
  label: string;
  variant?: "accent" | "secondary" | "ghost";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="entityTitle" value={title} />
      <FormSubmitButton type="submit" variant={variant} size="sm">
        {label}
      </FormSubmitButton>
    </form>
  );
}

function auditActionLabel(action: PortalAuditLog["action"]) {
  switch (action) {
    case "create":
      return "criado";
    case "update":
      return "atualizado";
    case "delete":
      return "excluido";
    case "approve":
      return "aprovado";
    case "reject":
      return "rejeitado";
    case "activate":
      return "ativado";
    default:
      return "desativado";
  }
}

function auditEntityLabel(entityType: PortalAuditLog["entityType"]) {
  switch (entityType) {
    case "news":
      return "Noticia";
    case "event":
      return "Evento";
    case "business":
      return "Negocio";
    case "tourism":
      return "Turismo";
    case "community":
      return "Comunidade";
    case "site-settings":
      return "Aparencia";
    default:
      return "Moderador";
  }
}

function AuditLogCard({ item }: { item: PortalAuditLog }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{item.entityTitle ?? auditEntityLabel(item.entityType)}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{auditEntityLabel(item.entityType)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{auditActionLabel(item.action)}</Badge>
            <Badge variant={item.actorRole === "admin" ? "default" : "accent"}>{item.actorRole}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{item.summary}</p>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{item.actorName}</p>
          <p>{formatDateTime(item.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeratorForm({
  action,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: PortalUser;
}) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <Field label="Nome" name="name" defaultValue={initial?.name} />
      <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
      <Field
        label={initial ? "Nova senha" : "Senha"}
        name="password"
        type="password"
        placeholder={initial ? "Deixe em branco para manter a atual" : "Minimo de 6 caracteres"}
        required={!initial}
      />
      <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium">
        <input type="checkbox" name="isActive" defaultChecked={initial ? initial.isActive : true} className="h-4 w-4 rounded border-border" />
        Moderador ativo
      </label>
      <FormSubmitButton type="submit" variant="accent">
        {initial ? "Salvar moderador" : "Criar moderador"}
      </FormSubmitButton>
    </form>
  );
}

function SiteSettingsForm({
  action,
  initial
}: {
  action: (formData: FormData) => Promise<void>;
  initial: PortalSiteSettings;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Titulo da home" name="heroTitle" defaultValue={initial.heroTitle} />
      <TextareaField label="Subtitulo da home" name="heroSubtitle" defaultValue={initial.heroSubtitle} />
      <ImageUploadField label="Imagem principal da home" name="heroImage" defaultValue={initial.heroImage} />
      <ImageUploadField label="Imagem SEO/OpenGraph" name="seoImage" defaultValue={initial.seoImage} />
      <Field label="Titulo do bloco de historia" name="historyTitle" defaultValue={initial.historyTitle} />
      <TextareaField label="Descricao do bloco de historia" name="historyDescription" defaultValue={initial.historyDescription} />
      <ImageUploadField label="Imagem da historia" name="historyImage" defaultValue={initial.historyImage} />
      <FormSubmitButton type="submit" variant="accent">
        Salvar aparencia do portal
      </FormSubmitButton>
    </form>
  );
}
