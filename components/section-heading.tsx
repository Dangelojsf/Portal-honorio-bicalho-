import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-primary/70">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p> : null}
    </div>
  );
}
