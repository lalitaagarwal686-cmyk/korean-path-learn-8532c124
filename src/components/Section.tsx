import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  korean,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  korean?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {korean ? <span className="font-kr text-primary">{korean}</span> : null}
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-4 text-3xl leading-tight font-semibold text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-24",
        tone === "muted" && "bg-secondary/50",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
