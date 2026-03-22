/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  BellRing,
  Compass,
  Facebook,
  HandHelping,
  Home,
  House,
  MessageCircle,
  Newspaper,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { HeroSection } from "@/components/public/hero";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicMap } from "@/components/maps/public-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourismCard } from "@/components/shared/tourism-card";
import {
  getAnnouncements,
  getPublicHero,
  getPublicMap,
  getPublicNews,
  getPublicStats,
  getPublicWisata,
} from "@/lib/api";

function formatDate(value?: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function absoluteArticleUrl(slug?: string) {
  return slug ? `${appUrl}/berita/${slug}` : `${appUrl}/berita`;
}

function excerptText(text?: string, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export default async function HomePage() {
  const [stats, news, announcements, mapData, hero, wisata] = await Promise.all([
    getPublicStats(),
    getPublicNews({ per_page: 12 }),
    getAnnouncements(),
    getPublicMap(),
    getPublicHero(),
    getPublicWisata(),
  ]);
  const featuredNews = news.data[0];
  const activityNews = news.data[1] ?? news.data[0];
  const kapitalaungMember =
    hero.government_structure?.find((member) =>
      member.position.toLowerCase().includes("kapitalaung"),
    ) ?? hero.government_structure?.[0];
  const kapitalaungName = kapitalaungMember?.name || hero.official_name;
  const kapitalaungPhoto = kapitalaungMember?.photo || hero.official_photo;
  const quickStats = [
    {
      label: "Jumlah Keluarga",
      value: stats.jumlah_keluarga,
      helper: "Keluarga yang sudah tercatat dalam database kampung.",
      icon: <Users className="h-7 w-7" />,
      tone: "sky",
    },
    {
      label: "Jumlah Penduduk",
      value: stats.jumlah_penduduk,
      helper: "Akumulasi penduduk dari seluruh keluarga aktif.",
      icon: <Home className="h-7 w-7" />,
      tone: "emerald",
    },
    {
      label: "Jumlah Rumah",
      value: stats.jumlah_rumah,
      helper: "Rumah warga yang sudah memiliki data lokasi dan identitas.",
      icon: <House className="h-7 w-7" />,
      tone: "amber",
    },
    {
      label: "Penerima Bantuan",
      value: stats.jumlah_penerima_bantuan,
      helper: "Warga penerima bantuan yang tercatat pada data aktif.",
      icon: <HandHelping className="h-7 w-7" />,
      tone: "rose",
    },
  ];

  return (
    <div suppressHydrationWarning>
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/" />
        <HeroSection hero={hero} />
      </div>
      <main className="pb-12">
        <section className="container-shell mt-12">
          <div data-reveal-card className="overflow-hidden rounded-[2.3rem] border border-[#dbe6f4] bg-[linear-gradient(180deg,_#ffffff,_#f5f9ff)] px-6 py-10 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-10 md:py-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  <Sparkles className="h-4 w-4" />
                  Profil Singkat
                </div>
                <h2 className="mt-5 font-serif text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  {hero.hero_panel_title || "Selayang Pandang"}
                </h2>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-1.5 w-20 rounded-full bg-amber-400" />
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Pemerintahan Kampung
                  </span>
                </div>
                <p className="mt-8 text-xl font-semibold text-slate-900">
                  {kapitalaungName}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                  Kapitalaung Palareng
                </p>
                <div className="mt-8 rounded-[1.6rem] border border-slate-100 bg-[linear-gradient(135deg,_#ffffff,_#f8fbff)] px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-base leading-9 text-slate-700 md:text-[1.05rem]">
                  {hero.official_message || hero.hero_panel_description}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/profil"
                    className="rounded-full bg-sky-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-800"
                  >
                    Baca Selengkapnya
                  </Link>
                  <span className="text-sm font-medium text-slate-500">
                    Profil pemerintahan kampung dan perangkat desa
                  </span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[295px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_56px_rgba(15,23,42,0.14)]">
                  <div className="absolute left-0 top-0 h-28 w-28 rounded-br-[2.2rem] bg-[linear-gradient(135deg,_#0ea5e9,_#ffffff)] opacity-85" />
                  <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-[2.8rem] bg-[linear-gradient(135deg,_#ffffff,_#16a34a)] opacity-85" />
                  <div className="relative overflow-hidden rounded-[1.55rem] bg-[linear-gradient(180deg,_#edf4ff,_#ffffff)]">
                    {kapitalaungPhoto ? (
                      <div className="relative">
                        <img
                          src={kapitalaungPhoto}
                          alt={kapitalaungName}
                          className="h-[390px] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.03)_10%,_rgba(15,23,42,0.68)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="rounded-[1.35rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.74))] px-4 py-4 text-white backdrop-blur-md">
                            <p className="mt-2 font-serif text-[1.45rem] font-bold leading-snug text-white">
                              {kapitalaungName}
                            </p>
                            <p className="mt-1 text-sm text-white/78">Kapitalaung Palareng</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[390px] items-center justify-center bg-[linear-gradient(180deg,_#dbeafe,_#f8fafc)] px-6 text-center">
                        <div>
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
                            <Users className="h-9 w-9 text-sky-700" />
                          </div>
                          <p className="mt-5 font-serif text-xl font-bold text-slate-900">
                            {kapitalaungName}
                          </p>
                          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-600">
                            Kapitalaung Palareng
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell mt-16">
          <SectionHeading
            eyebrow="Peta Digital"
            title="Preview peta interaktif rumah warga"
            description="Peta publik tetap dipertahankan sebagai bagian penting dashboard agar pengunjung bisa melihat sebaran rumah kampung."
          />
          <div data-reveal-card className="card-panel rounded-[1.75rem] p-3">
            <PublicMap markers={mapData.markers} />
          </div>
        </section>

        <section className="container-shell mt-12">
          <div data-reveal-card className="rounded-[2.2rem] border border-[#dfe9f6] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(242,248,255,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-8">
            <SectionHeading
              eyebrow="Berita & Informasi"
              title="Ringkasan informasi publik Kampung Palareng"
              description="Beranda hanya menampilkan tiga preview utama agar tetap rapi. Untuk membaca semua berita dan informasi lengkap, warga bisa masuk ke halaman berita."
            />
            <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr_1fr]">
              <article data-reveal-card className="group overflow-hidden rounded-[1.9rem] border border-sky-100 border-l-[6px] border-l-sky-500 bg-[linear-gradient(145deg,_rgba(239,246,255,0.98),_rgba(255,255,255,0.98))] shadow-[0_20px_60px_rgba(37,99,235,0.10)]">
                <div className="relative min-h-[460px]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,_#dbeafe,_#93c5fd,_#0f766e)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3),_transparent_40%)]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                      <BellRing className="h-4 w-4" />
                      Pengumuman Penting
                    </div>
                    <div className="rounded-[1rem] bg-white/15 p-3 text-white backdrop-blur-md shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="rounded-[1.6rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.72))] p-5 text-white backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/90">
                        Informasi warga
                      </p>
                      <p className="mt-3 font-serif text-[1.55rem] font-bold leading-snug text-white">
                        {announcements[0]?.judul ?? "Pengumuman kampung"}
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/82">
                        {excerptText(
                          announcements[0]?.isi ??
                            "Informasi pelayanan dan kegiatan terbaru dari pemerintah kampung.",
                          130,
                        )}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                        <span className="text-sm text-white/72">Penting untuk warga kampung</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-white/80">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Bagikan</span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`https://wa.me/?text=${encodeURIComponent(`Pengumuman Kampung Palareng: ${announcements[0]?.judul ?? "Pengumuman kampung"} ${appUrl}/berita`)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${appUrl}/berita`)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Facebook className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://t.me/share/url?url=${encodeURIComponent(`${appUrl}/berita`)}&text=${encodeURIComponent(announcements[0]?.judul ?? "Pengumuman kampung")}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Send className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                          <Link href="/berita" className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800">
                            Baca selengkapnya
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article data-reveal-card className="group overflow-hidden rounded-[1.9rem] border border-amber-100 border-l-[6px] border-l-amber-500 bg-[linear-gradient(145deg,_rgba(255,251,235,0.98),_rgba(255,255,255,0.98))] shadow-[0_20px_60px_rgba(180,83,9,0.10)]">
                <div className="relative min-h-[460px]">
                  {featuredNews?.gambar ? (
                    <img
                      src={featuredNews.gambar}
                      alt={featuredNews.judul}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,_#f59e0b,_#fbbf24,_#fdba74)]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.1)_8%,_rgba(15,23,42,0.72)_100%)]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                      <Newspaper className="h-4 w-4" />
                      Berita
                    </div>
                    <div className="rounded-[1rem] bg-white/15 p-3 text-white backdrop-blur-md shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                      <Newspaper className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="rounded-[1.6rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.75))] p-5 text-white backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/90">
                        {featuredNews?.kategori ?? "Berita Kampung"}
                      </p>
                      <p className="mt-3 font-serif text-[1.8rem] font-bold leading-tight text-white">
                        {featuredNews?.judul ?? "Berita kampung"}
                      </p>
                      <p className="mt-2 text-sm text-white/72">
                        Diterbitkan: {formatDate(featuredNews?.created_at)}
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/84">
                        {excerptText(
                          featuredNews?.ringkasan ?? "Ringkasan berita terbaru dari Kampung Palareng.",
                          120,
                        )}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                        <span className="text-sm text-white/72">{news.data.length} berita tersedia</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-white/80">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Bagikan</span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`https://wa.me/?text=${encodeURIComponent(`${featuredNews?.judul ?? "Berita kampung"} ${absoluteArticleUrl(featuredNews?.slug)}`)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteArticleUrl(featuredNews?.slug))}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Facebook className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://t.me/share/url?url=${encodeURIComponent(absoluteArticleUrl(featuredNews?.slug))}&text=${encodeURIComponent(featuredNews?.judul ?? "Berita kampung")}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Send className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                          <Link
                            href={featuredNews ? `/berita/${featuredNews.slug}` : "/berita"}
                            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                          >
                            Baca selengkapnya
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article data-reveal-card className="group overflow-hidden rounded-[1.9rem] border border-emerald-100 border-l-[6px] border-l-emerald-500 bg-[linear-gradient(145deg,_rgba(236,253,245,0.98),_rgba(255,255,255,0.98))] shadow-[0_20px_60px_rgba(22,138,101,0.10)]">
                <div className="relative min-h-[460px]">
                  {activityNews?.gambar ? (
                    <img
                      src={activityNews.gambar}
                      alt={activityNews.judul}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,_#34d399,_#10b981,_#065f46)]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.08)_8%,_rgba(15,23,42,0.72)_100%)]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                      <Compass className="h-4 w-4" />
                      Kegiatan Kampung
                    </div>
                    <div className="rounded-[1rem] bg-white/15 p-3 text-white backdrop-blur-md shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                      <Compass className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="rounded-[1.6rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.75))] p-5 text-white backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/90">
                        Sorotan kegiatan
                      </p>
                      <p className="mt-3 font-serif text-[1.6rem] font-bold leading-snug text-white">
                        {activityNews?.judul ?? "Kegiatan kampung hijau dan gotong royong"}
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/84">
                        {excerptText(
                          activityNews?.ringkasan ??
                            "Update kegiatan warga, kerja bakti, dan agenda kampung yang sedang berjalan.",
                          120,
                        )}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                        <span className="text-sm text-white/72">Kegiatan terbaru kampung</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-white/80">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Bagikan</span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`https://wa.me/?text=${encodeURIComponent(`${activityNews?.judul ?? "Kegiatan kampung"} ${absoluteArticleUrl(activityNews?.slug)}`)}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteArticleUrl(activityNews?.slug))}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Facebook className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`https://t.me/share/url?url=${encodeURIComponent(absoluteArticleUrl(activityNews?.slug))}&text=${encodeURIComponent(activityNews?.judul ?? "Kegiatan kampung")}`}
                                target="_blank"
                                className="rounded-full border border-white/20 bg-white/10 p-2 transition hover:bg-white/20"
                              >
                                <Send className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                          <Link
                            href={activityNews ? `/berita/${activityNews.slug}` : "/berita"}
                            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                          >
                            Baca selengkapnya
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/berita"
                className="rounded-full border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Buka semua berita dan informasi
              </Link>
            </div>
          </div>
        </section>

        <section className="container-shell mt-16">
          <div
            data-reveal-card
            className="rounded-[2.2rem] border border-[#dfe9f6] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,248,255,0.95))] px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-8"
          >
            <SectionHeading
              eyebrow="Infografis Singkat"
              title="Gambaran cepat data utama Kampung Palareng"
              description="Ringkasan ini menampilkan angka-angka dasar dari database aktif kampung agar pengunjung bisa memahami kondisi umum warga secara cepat."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((item) => (
              <div
                key={item.label}
                data-reveal-card
                className={`rounded-[1.8rem] border p-5 shadow-[0_22px_60px_rgba(15,23,42,0.07)] ${
                  item.tone === "sky"
                    ? "border-sky-100 bg-[linear-gradient(180deg,_#f8fbff,_#eef6ff)]"
                    : item.tone === "emerald"
                      ? "border-emerald-100 bg-[linear-gradient(180deg,_#f5fcf8,_#effcf5)]"
                      : item.tone === "amber"
                        ? "border-amber-100 bg-[linear-gradient(180deg,_#fffaf2,_#fff3df)]"
                        : "border-rose-100 bg-[linear-gradient(180deg,_#fff7f8,_#fff0f3)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`inline-flex rounded-[1.25rem] p-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ${
                      item.tone === "sky"
                        ? "bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] text-sky-700"
                        : item.tone === "emerald"
                          ? "bg-[linear-gradient(135deg,_#d1fae5,_#ecfdf5)] text-emerald-700"
                          : item.tone === "amber"
                            ? "bg-[linear-gradient(135deg,_#fef3c7,_#fffbeb)] text-amber-700"
                            : "bg-[linear-gradient(135deg,_#ffe4e6,_#fff1f2)] text-rose-700"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      item.tone === "sky"
                        ? "bg-sky-100 text-sky-700"
                        : item.tone === "emerald"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.tone === "amber"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    Data Aktif
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.helper}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="container-shell mt-16">
          <div data-reveal-card className="rounded-[2.2rem] border border-[#ead9c5] bg-[linear-gradient(180deg,_#fffaf4,_#fffcf7)] px-6 py-8 shadow-[0_28px_80px_rgba(120,74,32,0.10)] md:px-8">
            <SectionHeading
              eyebrow="Wisata"
              title="Beberapa tempat wisata di Kampung Palareng"
              description="Tampilan tiga kartu wisata dibuat seperti sketsa: foto di atas, nama tempat dan lokasi di bawah, sederhana tetapi tetap rapi."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {wisata.map((item) => (
                <TourismCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Link
                href="/wisata"
                className="rounded-full border border-[#d6b58a] bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
              >
                Lihat semua wisata
              </Link>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>
  );
}
