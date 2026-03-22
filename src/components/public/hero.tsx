"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HeroSetting } from "@/types/portal";

export function HeroSection({ hero }: { hero: HeroSetting }) {
  const slides = useMemo(() => {
    const sections = hero.hero_sections?.filter((item) => item.image) ?? [];

    if (sections.length > 0) {
      return sections.map((item) => item.image).filter(Boolean) as string[];
    }

    const gallery = hero.hero_images?.filter(Boolean) ?? [];
    const fallbackImage = gallery[0] ?? hero.hero_image ?? null;

    return fallbackImage ? [fallbackImage] : [];
  }, [hero]);

  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndex = slides.length > 0 ? activeIndex % slides.length : 0;
  const title = (hero.hero_title || "Palareng").trim() || "Palareng";
  const titleParts = useMemo(() => {
    if (/kampung palareng/i.test(title)) {
      const firstLine = title.replace(/\s*Kampung Palareng\s*/i, "").trim() || "Website Resmi";
      return [firstLine, "Kampung Palareng"];
    }

    return [title];
  }, [title]);
  const quickLinks = [
    {
      href: "/profil",
      label: "Profil Kampung",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M4 20h16v-2H4v2Zm2-3h4v-6H6v6Zm8 0h4V7h-4v10ZM6 9h4V5H6v4Zm8-4v2h4V5h-4Z" />
        </svg>
      ),
    },
    {
      href: "/statistik",
      label: "Infografis",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M5 19h14v2H5v-2Zm1-3h3V9H6v7Zm5 0h3V5h-3v11Zm5 0h3v-5h-3v5Z" />
        </svg>
      ),
    },
    {
      href: "/surat",
      label: "Layanan",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M4 5h16a1 1 0 0 1 1 1v9H3V6a1 1 0 0 1 1-1Zm-1 12h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Zm3-9v5h12V8H6Z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative">
      <div className="relative min-h-[520px] overflow-hidden bg-[linear-gradient(135deg,_#0b2f63_0%,_#0f5cb5_52%,_#1a8d6f_100%)] md:min-h-[580px]">
        <div className="absolute inset-0">
          {slides.length > 0
            ? slides.map((slide, index) => (
                <div
                  key={`${slide}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                >
                  {slide ? (
                    <Image
                      src={slide}
                      alt={hero.hero_title}
                      fill
                      priority={index === 0}
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                </div>
              ))
            : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(8,18,34,0.60)_0%,_rgba(8,18,34,0.38)_24%,_rgba(8,18,34,0.54)_60%,_rgba(8,18,34,0.80)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.07),_transparent_32%)]" />

        <div className="relative container-shell flex min-h-[520px] flex-col justify-center px-4 pb-10 pt-24 text-center md:min-h-[580px] md:pb-12 md:pt-28">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-4xl rounded-[1.8rem] border border-white/12 bg-[linear-gradient(180deg,_rgba(8,18,34,0.24),_rgba(8,18,34,0.10))] px-5 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-[3px] md:px-8 md:py-7">
                <p className="text-xs font-semibold tracking-[0.28em] text-amber-200 md:text-sm">
                {hero.hero_badge}
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.08] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.34)] sm:text-4xl md:text-5xl lg:text-6xl">
                {titleParts.map((line, lineIndex) => {
                  const previousLength = titleParts
                    .slice(0, lineIndex)
                    .reduce((sum, item) => sum + item.length, 0);

                  return (
                    <span
                      key={`${line}-${lineIndex}`}
                      className={`block ${lineIndex === 1 ? "mt-1 md:mt-2" : ""}`}
                    >
                      {Array.from(line).map((char, index) => (
                        <span
                          key={`${char}-${lineIndex}-${index}`}
                          className="hero-title-letter"
                          style={{ animationDelay: `${(previousLength + index) * 0.045}s` }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </h1>
              <div className="mx-auto mt-3 h-px w-20 bg-[linear-gradient(90deg,_transparent,_rgba(250,204,21,0.95),_transparent)]" />
            {hero.hero_description ? (
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/86 md:text-base">
                {hero.hero_description}
              </p>
            ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={hero.hero_primary_url}
              className="rounded-full border border-white/30 bg-white/12 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
            >
              {hero.hero_primary_label}
            </Link>
            <Link
              href={hero.hero_secondary_url}
              className="rounded-full border border-sky-300/40 bg-sky-600/82 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              {hero.hero_secondary_label}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-start justify-center gap-6 md:gap-7">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group flex flex-col items-center text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/28 bg-[linear-gradient(180deg,_rgba(34,97,219,0.92),_rgba(16,64,161,0.82))] p-4 text-white shadow-[0_18px_32px_rgba(8,29,84,0.35)] transition group-hover:-translate-y-1">
                  {item.icon}
                </span>
                <span className="mt-2.5 text-xs font-medium tracking-[0.08em] text-white/88 drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] md:text-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.length > 1
              ? slides.map((slide, index) => (
                  <button
                    key={`${slide}-dot-${index}`}
                    type="button"
                    aria-label={`Pilih foto hero ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentIndex ? "w-10 bg-amber-400" : "w-2.5 bg-white/55"
                    }`}
                  />
                ))
              : null}
          </div>

          <div className="mt-5 text-center text-xs text-white/68 md:text-sm">
            {hero.official_name}
          </div>
        </div>
      </div>
    </section>
  );
}
