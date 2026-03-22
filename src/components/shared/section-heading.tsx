type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
    </div>
  );
}
