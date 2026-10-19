import type { ReactNode } from "react";

export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-taupe">{intro}</p>}
      <div className="mt-10 space-y-10">{children}</div>
    </div>
  );
}

export function InfoSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-taupe">
        {children}
      </div>
    </section>
  );
}
