"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const groupedNavItems = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil Kampung" },
  {
    label: "Informasi",
    items: [
      { href: "/wisata", label: "Wisata" },
      { href: "/berita", label: "Berita" },
      { href: "/statistik", label: "Infografis Penduduk" },
      { href: "/peta", label: "Peta Digital" },
    ],
  },
  {
    label: "Layanan",
    items: [
      { href: "/surat", label: "Layanan Surat" },
      { href: "/bantuan", label: "Bantuan" },
    ],
  },
  { href: "/kontak", label: "Kontak" },
];

type PublicNavbarProps = {
  variant?: "default" | "overlay";
  activeHref?: string;
};

function isGroupActive(items: { href: string; label: string }[], activeHref?: string) {
  return items.some((item) => item.href === activeHref);
}

export function PublicNavbar({
  variant = "default",
  activeHref,
}: PublicNavbarProps) {
  const isOverlay = variant === "overlay";
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        isScrolled
          ? "fixed inset-x-0 top-0 z-40 border-b border-white/20 bg-[linear-gradient(135deg,_rgba(11,94,215,0.96),_rgba(22,138,101,0.92))] shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          : "absolute inset-x-0 top-0 z-30"
      }
    >
      <div className="container-shell flex items-center justify-between gap-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          {logoFailed ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,_#0b5ed7,_#168a65)] text-sm font-black text-white">
              KP
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.35rem] bg-transparent">
              <Image
                src="/logo-sangihe.png"
                alt="Logo Pemerintah Kabupaten Kepulauan Sangihe"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
                onError={() => setLogoFailed(true)}
                unoptimized
              />
            </div>
          )}
          <div className="max-w-sm">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                isScrolled || isOverlay ? "text-sky-100/90" : "text-sky-700"
              }`}
            >
              Portal Resmi
            </p>
            <p
              className={`mt-1 text-base font-bold leading-tight ${
                isScrolled || isOverlay ? "text-white" : "text-slate-900"
              }`}
            >
              Pemerintahan Kampung Palareng
            </p>
            <p
              className={`mt-0.5 text-sm font-medium ${
                isScrolled || isOverlay ? "text-white/82" : "text-slate-600"
              }`}
            >
              Kabupaten Kepulauan Sangihe
            </p>
          </div>
        </Link>

        <nav
          className={`hidden flex-wrap items-center gap-8 text-sm font-semibold lg:flex ${
            isScrolled || isOverlay ? "text-white/90" : "text-slate-700"
          }`}
        >
          {groupedNavItems.map((item) =>
            "href" in item ? (
              <div key={item.href} className="flex flex-col items-center gap-2">
                <Link
                  href={item.href}
                  className={`transition ${
                    isScrolled || isOverlay
                      ? "text-white/88 hover:text-white"
                      : "text-slate-700 hover:text-sky-700"
                  }`}
                >
                  {item.label}
                </Link>
                <span
                  className={`h-1 rounded-full transition-all ${
                    activeHref === item.href ? "w-10 bg-amber-400" : "w-2 bg-transparent"
                  }`}
                />
              </div>
            ) : (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={`flex items-center gap-2 transition ${
                    isScrolled || isOverlay
                      ? "text-white/88 hover:text-white"
                      : "text-slate-700 hover:text-sky-700"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px]">▼</span>
                </button>
                <span
                  className={`mt-2 block h-1 rounded-full transition-all ${
                    isGroupActive(item.items, activeHref)
                      ? "w-10 bg-amber-400"
                      : "w-2 bg-transparent"
                  }`}
                />
                <div className="invisible absolute left-1/2 top-full z-40 mt-4 w-56 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 opacity-0 shadow-[0_22px_50px_rgba(15,23,42,0.14)] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-xl px-4 py-3 transition hover:bg-sky-50 hover:text-sky-700 ${
                        activeHref === child.href ? "bg-sky-50 text-sky-700" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
        </nav>

        <details className="relative lg:hidden">
          <summary
            className={`flex cursor-pointer list-none items-center rounded-xl border px-4 py-2 text-sm font-semibold ${
              isScrolled || isOverlay
                ? "border-white/30 bg-white/10 text-white"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            Menu
          </summary>
          <div className="absolute right-0 top-full z-40 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-[0_22px_50px_rgba(15,23,42,0.14)]">
            {groupedNavItems.map((item) =>
              "href" in item ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 transition hover:bg-sky-50 hover:text-sky-700 ${
                    activeHref === item.href ? "bg-sky-50 text-sky-700" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <details key={item.label} className="rounded-xl">
                  <summary className="cursor-pointer rounded-xl px-4 py-3 font-semibold text-slate-900">
                    {item.label}
                  </summary>
                  <div className="mt-1 space-y-1">
                    {item.items.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-xl px-4 py-3 transition hover:bg-sky-50 hover:text-sky-700 ${
                          activeHref === child.href ? "bg-sky-50 text-sky-700" : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ),
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
