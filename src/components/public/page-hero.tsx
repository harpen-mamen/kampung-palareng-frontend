import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSetting } from "@/types/portal";

type HeroStat = {
  label: string;
  value: string | number;
  caption: string;
  tone?: "sky" | "emerald" | "amber" | "violet";
};

type PublicPageHeroProps = {
  hero: HeroSetting;
  eyebrow: string;
  title: string;
  description: string;
  stats?: HeroStat[];
  shortcuts?: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
};

function resolveHeroImages(hero: HeroSetting) {
  const images = hero.hero_images?.filter(Boolean) ?? [];

  if (images.length > 0) {
    return images;
  }

  if (hero.hero_image) {
    return [hero.hero_image];
  }

  if (hero.profile_image) {
    return [hero.profile_image];
  }

  return [];
}

function shortcutToneClasses(index: number) {
  switch (index % 4) {
    case 1:
      return "border-emerald-200/40 bg-[linear-gradient(180deg,_rgba(16,185,129,0.28),_rgba(8,18,34,0.18))]";
    case 2:
      return "border-amber-200/40 bg-[linear-gradient(180deg,_rgba(245,158,11,0.28),_rgba(8,18,34,0.18))]";
    case 3:
      return "border-violet-200/40 bg-[linear-gradient(180deg,_rgba(139,92,246,0.28),_rgba(8,18,34,0.18))]";
    default:
      return "border-sky-200/40 bg-[linear-gradient(180deg,_rgba(59,130,246,0.28),_rgba(8,18,34,0.18))]";
  }
}

export function PublicPageHero({
  hero,
  eyebrow,
  title,
  description,
  shortcuts = [],
}: PublicPageHeroProps) {
  const images = resolveHeroImages(hero);
  const backgroundImage = images[0];

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[360px] bg-[linear-gradient(135deg,_#0b2f63_0%,_#0f5cb5_52%,_#1a8d6f_100%)] md:min-h-[420px]">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(8,18,34,0.72)_0%,_rgba(8,18,34,0.48)_26%,_rgba(8,18,34,0.62)_68%,_rgba(8,18,34,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_34%)]" />

        <div className="relative container-shell flex min-h-[360px] flex-col justify-end px-4 pb-12 pt-28 md:min-h-[420px] md:pb-14 md:pt-32">
          <div className="max-w-4xl rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,_rgba(10,20,36,0.30),_rgba(10,20,36,0.12))] px-6 py-6 shadow-[0_26px_70px_rgba(0,0,0,0.20)] backdrop-blur-[3px] md:px-8 md:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-200 md:text-sm">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-black leading-tight text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.38)] md:text-5xl lg:text-[3.65rem]">
              {title}
            </h1>
            <div className="mt-4 h-px w-24 bg-[linear-gradient(90deg,_transparent,_rgba(250,204,21,0.95),_transparent)]" />
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/84 md:text-lg">
              {description}
            </p>
          </div>

          {shortcuts.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {shortcuts.map((item, index) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`group rounded-[1.6rem] border px-5 py-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:-translate-y-1 ${shortcutToneClasses(index)}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-white/28 bg-[linear-gradient(180deg,_rgba(34,97,219,0.92),_rgba(16,64,161,0.82))] p-4 text-white shadow-[0_18px_32px_rgba(8,29,84,0.35)] transition group-hover:bg-[linear-gradient(180deg,_rgba(45,114,239,0.96),_rgba(18,76,185,0.88))]">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                        Navigasi
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
