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
      const withoutPhrase = title.replace(/\s*Kampung Palareng\s*/i, " ").replace(/\s+/g, " ").trim();
      const baseWords = withoutPhrase ? withoutPhrase.split(" ") : ["Website", "Resmi"];
      const splitPoint = Math.max(1, baseWords.length - 1);
      const upperLine = baseWords.slice(0, splitPoint).join(" ").trim() || "Website";
      const middleLine = baseWords.slice(splitPoint).join(" ").trim() || "Resmi";
      return [upperLine, middleLine, "Palareng"];
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
      <div className="relative min-h-[620px] overflow-hidden bg-[linear-gradient(135deg,_#0b2f63_0%,_#0f5cb5_52%,_#1a8d6f_100%)] sm:min-h-[640px] md:min-h-[580px]">
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

        <div className="relative container-shell flex min-h-[620px] flex-col justify-center px-4 pb-10 pt-32 text-center sm:min-h-[640px] sm:pt-36 md:min-h-[580px] md:pb-12 md:pt-28">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-white/12 bg-[linear-gradient(180deg,_rgba(8,18,34,0.24),_rgba(8,18,34,0.10))] px-4 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-[3px] sm:px-5 sm:py-6 md:rounded-[1.8rem] md:px-8 md:py-7">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-200 sm:text-xs sm:tracking-[0.28em] md:text-sm">
                {hero.hero_badge}
              </p>
              <h1 className="mt-3 font-serif text-[2rem] font-bold leading-[1.04] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.34)] sm:text-4xl md:text-5xl lg:text-6xl">
                {titleParts.map((line, lineIndex) => {
                  const previousLength = titleParts
                    .slice(0, lineIndex)
                    .reduce((sum, item) => sum + item.length, 0);

                  return (
                    <span
                      key={`${line}-${lineIndex}`}
                      className={`block ${lineIndex > 0 ? "mt-1 md:mt-2" : ""} ${lineIndex === titleParts.length - 1 ? "whitespace-nowrap" : ""}`}
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
              <div className="mx-auto mt-3 h-px w-16 bg-[linear-gradient(90deg,_transparent,_rgba(250,204,21,0.95),_transparent)] sm:w-20" />
              {hero.hero_description ? (
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/86 sm:leading-7 md:text-base">
                  {hero.hero_description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={hero.hero_primary_url}
              className="rounded-full border border-white/30 bg-white/12 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
            >
              {hero.hero_primary_label}
            </Link>
            <Link
              href={hero.hero_secondary_url}
              className="rounded-full border border-sky-300/40 bg-sky-600/82 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              {hero.hero_secondary_label}
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-6 md:gap-7">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group flex flex-col items-center text-white">
                <span className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] border border-white/28 bg-[linear-gradient(180deg,_rgba(34,97,219,0.92),_rgba(16,64,161,0.82))] p-3 text-white shadow-[0_18px_32px_rgba(8,29,84,0.35)] transition group-hover:-translate-y-1 sm:h-16 sm:w-16 sm:rounded-[1.35rem] sm:p-4">
                  {item.icon}
                </span>
                <span className="mt-2 text-center text-[11px] font-medium leading-4 tracking-[0.04em] text-white/88 drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:mt-2.5 sm:text-xs sm:tracking-[0.08em] md:text-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6">
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

          <div className="mt-4 text-center text-[11px] text-white/68 sm:mt-5 sm:text-xs md:text-sm">
            {hero.official_name}
          </div>
        </div>
      </div>
    </section>
  );
}
