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
      <div className="relative min-h-[420px] bg-[linear-gradient(135deg,_#0b2f63_0%,_#0f5cb5_52%,_#1a8d6f_100%)] md:min-h-[420px]">
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

        <div className="relative container-shell flex min-h-[420px] flex-col justify-end px-4 pb-10 pt-30 sm:pt-32 md:min-h-[420px] md:pb-14 md:pt-32">
          <div className="max-w-4xl rounded-[1.5rem] border border-white/14 bg-[linear-gradient(180deg,_rgba(10,20,36,0.30),_rgba(10,20,36,0.12))] px-4 py-5 shadow-[0_26px_70px_rgba(0,0,0,0.20)] backdrop-blur-[3px] sm:px-6 sm:py-6 md:rounded-[2rem] md:px-8 md:py-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200 sm:text-xs sm:tracking-[0.34em] md:text-sm">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-[2rem] font-black leading-tight text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.38)] sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.65rem]">
              {title}
            </h1>
            <div className="mt-3 h-px w-18 bg-[linear-gradient(90deg,_transparent,_rgba(250,204,21,0.95),_transparent)] sm:mt-4 sm:w-24" />
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/84 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
              {description}
            </p>
          </div>

          {shortcuts.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-4">
              {shortcuts.map((item, index) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`group rounded-[1.35rem] border px-4 py-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:-translate-y-1 sm:rounded-[1.6rem] sm:px-5 sm:py-5 ${shortcutToneClasses(index)}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[1.1rem] border border-white/28 bg-[linear-gradient(180deg,_rgba(34,97,219,0.92),_rgba(16,64,161,0.82))] p-3 text-white shadow-[0_18px_32px_rgba(8,29,84,0.35)] transition group-hover:bg-[linear-gradient(180deg,_rgba(45,114,239,0.96),_rgba(18,76,185,0.88))] sm:h-16 sm:w-16 sm:rounded-[1.35rem] sm:p-4">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px] sm:tracking-[0.28em]">
                        Navigasi
                      </p>
                      <p className="mt-1 text-base font-bold text-white sm:text-lg">
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
