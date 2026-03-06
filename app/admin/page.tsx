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
  saveNewsAction,
  saveSiteSettingsAction,
  saveTourismSpotAction
} from "@/app/admin/actions";
import { authOptions } from "@/lib/auth";
import { getAdminSnapshot } from "@/lib/repositories";
import type { PortalBusiness, PortalEvent, PortalNews, PortalSiteSettings, PortalTourismSpot } from "@/types/portal";

function toDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function categoriesByType(
  categories: Awaited<ReturnType<typeof getAdminSnapshot>>["categories"],
  type: "news" | "business" | "community"
) {
  return categories.filter((item) => item.type === type);
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  const snapshot = await getAdminSnapshot();
  const newsCategories = categoriesByType(snapshot.categories, "news");
  const businessCategories = categoriesByType(snapshot.categories, "business");

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Painel administrativo"
            title="Gerencie o portal"
            description="Cadastre noticias, eventos, negocios, pontos turisticos e modere as publicacoes da comunidade."
          />
          <AdminSignOutButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {snapshot.metrics.map((metric) => (
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
            <TabsTrigger value="appearance">Aparencia</TabsTrigger>
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
                    <DeleteForm action={deleteNewsAction} id={item.id} />
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
                    <DeleteForm action={deleteEventAction} id={item.id} />
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
                    <DeleteForm action={deleteBusinessAction} id={item.id} />
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
                    <DeleteForm action={deleteTourismSpotAction} id={item.id} />
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
                        <InlineActionForm action={approveCommunityPostAction} id={item.id} label="Aprovar" />
                        <InlineActionForm action={rejectCommunityPostAction} id={item.id} label="Rejeitar" variant="secondary" />
                        <InlineActionForm action={deleteCommunityPostAction} id={item.id} label="Excluir" variant="ghost" />
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
  id
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <FormSubmitButton type="submit" variant="ghost">
        Excluir
      </FormSubmitButton>
    </form>
  );
}

function InlineActionForm({
  action,
  id,
  label,
  variant = "accent"
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  variant?: "accent" | "secondary" | "ghost";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <FormSubmitButton type="submit" variant={variant} size="sm">
        {label}
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
