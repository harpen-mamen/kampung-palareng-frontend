/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { BellRing, CalendarDays, Compass, Facebook, MessageCircle, Newspaper, Send, Sparkles } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { getAnnouncements, getPublicHero, getPublicNews } from "@/lib/api";

const headlineFont = Merriweather({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function absoluteArticleUrl(slug?: string) {
  return slug ? `${appUrl}/berita/${slug}` : `${appUrl}/berita`;
}

function excerptText(text?: string, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function formatDate(value?: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BeritaPage() {
  const [news, announcements, hero] = await Promise.all([
    getPublicNews({ per_page: 50 }),
    getAnnouncements(),
    getPublicHero(),
  ]);
  const featuredNews = news.data[0];
  const activityNews = news.data[1] ?? news.data[0];

  return (
    <div className={`bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_46%)] ${bodyFont.className}`}>
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/berita" />
        <PublicPageHero
          hero={hero}
          eyebrow="Berita & Informasi"
          title="Daftar berita kampung dan informasi penting"
          description="Pengumuman penting, berita utama, dan kegiatan kampung ditampilkan dalam susunan yang lebih editorial agar mudah dibaca warga sebelum masuk ke detail berita."
          stats={[
            {
              label: "Pengumuman",
              value: announcements.length,
              caption: "Informasi penting yang dipublikasikan untuk warga.",
              tone: "sky",
            },
            {
              label: "Berita",
              value: news.total,
              caption: "Artikel dan kabar kampung yang sudah diterbitkan.",
              tone: "emerald",
            },
            {
              label: "Sorotan",
              value: "Utama",
              caption: "Berita terbaru tampil lebih menonjol di halaman ini.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#berita-sorotan",
              label: "Sorotan",
              icon: <Newspaper className="h-7 w-7" />,
            },
            {
              href: "#berita-sorotan",
              label: "Pengumuman",
              icon: <BellRing className="h-7 w-7" />,
            },
            {
              href: "#berita-semua",
              label: "Semua Berita",
              icon: <Compass className="h-7 w-7" />,
            },
          ]}
        />
      </div>
      <main className="mx-auto relative z-10 -mt-10 w-[min(1320px,calc(100%-2rem))] pb-16 md:-mt-12">
        <section id="berita-sorotan" className="rounded-[2.2rem] border border-[#dfe9f6] bg-[linear-gradient(180deg,_rgba(255,255,255,0.97),_rgba(242,248,255,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-8 lg:px-10">

          <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr_1fr]">
            <article className="rounded-[1.8rem] border border-sky-100 border-l-[6px] border-l-sky-500 bg-[linear-gradient(145deg,_rgba(239,246,255,0.98),_rgba(255,255,255,0.98))] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.10)]">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-3 text-sky-700 shadow-[0_12px_24px_rgba(59,130,246,0.16)]">
                  <BellRing className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                Pengumuman Penting
                </p>
              </div>
              <div className="mt-5 flex gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,_#dbeafe,_#bfdbfe)] text-sky-700 shadow-[0_18px_32px_rgba(59,130,246,0.18)]">
                  <Sparkles className="h-9 w-9" />
                </div>
                <div className="flex-1">
                  <p className={`${headlineFont.className} text-[1.35rem] font-bold leading-snug text-slate-950`}>
                    {announcements[0]?.judul ?? "Pemberitahuan Kampung"}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {announcements[0]?.isi ?? "Belum ada pengumuman tambahan."}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-sky-100 pt-4 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 text-sky-600" />
                Operator kampung
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-amber-100 border-l-[6px] border-l-amber-500 bg-[linear-gradient(145deg,_rgba(255,251,235,0.98),_rgba(255,255,255,0.98))] p-6 shadow-[0_20px_60px_rgba(180,83,9,0.10)]">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] bg-[linear-gradient(135deg,_#fef3c7,_#fffbeb)] p-3 text-amber-700 shadow-[0_12px_24px_rgba(217,119,6,0.16)]">
                  <Newspaper className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                Berita
                </p>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
                {featuredNews?.gambar ? (
                  <img
                    src={featuredNews.gambar}
                    alt={featuredNews.judul}
                    className="h-40 w-full rounded-[1.35rem] object-cover"
                  />
                ) : (
                  <div className="h-40 rounded-[1.35rem] bg-[linear-gradient(180deg,_#f59e0b,_#fdba74)]" />
                )}
                <div>
                  <p className={`${headlineFont.className} text-[2rem] font-bold leading-tight text-slate-950`}>
                    {featuredNews?.judul ?? "Berita kampung"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Diterbitkan: {formatDate(featuredNews?.created_at)}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {featuredNews?.ringkasan ?? "Ringkasan berita terbaru kampung."}
                  </p>
                </div>
              </div>
              {featuredNews ? (
                <div className="mt-6 border-t border-amber-100 pt-4">
                  <Link
                    href={`/berita/${featuredNews.slug}`}
                    className="text-sm font-semibold text-amber-700"
                  >
                    Baca selengkapnya
                  </Link>
                </div>
              ) : null}
            </article>

            <article className="rounded-[1.8rem] border border-emerald-100 border-l-[6px] border-l-emerald-500 bg-[linear-gradient(145deg,_rgba(236,253,245,0.98),_rgba(255,255,255,0.98))] p-6 shadow-[0_20px_60px_rgba(22,138,101,0.10)]">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] bg-[linear-gradient(135deg,_#d1fae5,_#ecfdf5)] p-3 text-emerald-700 shadow-[0_12px_24px_rgba(16,185,129,0.16)]">
                  <Compass className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Kegiatan Kampung
                </p>
              </div>
              {activityNews?.gambar ? (
                <img
                  src={activityNews.gambar}
                  alt={activityNews.judul}
                  className="mt-5 h-32 w-full rounded-[1.5rem] object-cover"
                />
              ) : (
                <div className="mt-5 flex h-32 items-center justify-center rounded-[1.5rem] border border-emerald-100 bg-white text-lg font-black tracking-[0.2em] text-emerald-700">
                  AKSI
                </div>
              )}
              <p className={`${headlineFont.className} mt-5 text-[1.55rem] font-bold leading-snug text-slate-950`}>
                {activityNews?.judul ?? "Kegiatan Kampung Palareng"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {activityNews?.ringkasan ??
                  "Update kegiatan kerja bakti dan agenda gotong royong kampung."}
              </p>
              <div className="mt-6">
                <Link
                  href={activityNews ? `/berita/${activityNews.slug}` : "/berita"}
                  className="inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Lihat semua
                </Link>
              </div>
            </article>
          </div>

          <section id="berita-semua" className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-[0.95rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-2.5 text-sky-700 shadow-[0_10px_20px_rgba(59,130,246,0.14)]">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Semua Berita
                  </p>
                </div>
                <h2 className={`${headlineFont.className} mt-2 text-[2rem] font-bold text-slate-950`}>
                  Seluruh berita yang sudah dipublikasikan
                </h2>
              </div>
              <p className="text-sm text-slate-500">{news.total} berita tampil</p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {news.data.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[1.9rem] border border-sky-100 border-l-[6px] border-l-sky-500 bg-[linear-gradient(145deg,_rgba(239,246,255,0.98),_rgba(255,255,255,0.98))] shadow-[0_20px_60px_rgba(37,99,235,0.10)] transition hover:-translate-y-1"
                >
                  <div className="relative min-h-[440px]">
                    {item.gambar ? (
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#dbeafe,_#93c5fd,_#0f766e)]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.08)_10%,_rgba(15,23,42,0.76)_100%)]" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                        <Newspaper className="h-4 w-4" />
                        {item.kategori}
                      </div>
                      <div className="rounded-[1rem] bg-white/15 p-3 text-white backdrop-blur-md shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="rounded-[1.6rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.78))] p-5 text-white backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/90">
                          Diterbitkan {formatDate(item.created_at)}
                        </p>
                        <h3 className={`${headlineFont.className} mt-3 text-[1.65rem] font-bold leading-snug text-white`}>
                          {item.judul}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/84">
                          {excerptText(item.ringkasan, 130)}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                          <div className="flex items-center gap-2 text-white/80">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Bagikan</span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`https://wa.me/?text=${encodeURIComponent(`${item.judul} ${absoluteArticleUrl(item.slug)}`)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteArticleUrl(item.slug))}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Facebook className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://t.me/share/url?url=${encodeURIComponent(absoluteArticleUrl(item.slug))}&text=${encodeURIComponent(item.judul)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Send className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                          <Link
                            href={`/berita/${item.slug}`}
                            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                          >
                            Baca selengkapnya
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
