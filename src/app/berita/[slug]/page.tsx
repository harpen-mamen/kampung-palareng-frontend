/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowLeft, CalendarDays, Facebook, MessageCircle, Newspaper, Send, Share2 } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { getNewsDetail } from "@/lib/api";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function formatDate(value?: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = await getNewsDetail(slug);
  const articleUrl = `${appUrl}/berita/${slug}`;

  return (
    <div className="bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_46%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/berita" />
        <section className="relative overflow-hidden">
          <div className="relative min-h-[340px] bg-[linear-gradient(135deg,_#0b2f63_0%,_#0f5cb5_52%,_#1a8d6f_100%)] md:min-h-[400px]">
            {berita.gambar ? (
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(8,18,34,0.72)_0%,_rgba(8,18,34,0.48)_24%,_rgba(8,18,34,0.76)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_34%)]" />

            <div className="relative container-shell flex min-h-[340px] flex-col justify-end px-4 pb-12 pt-28 md:min-h-[400px] md:pb-14 md:pt-32">
              <div className="max-w-5xl rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,_rgba(10,20,36,0.30),_rgba(10,20,36,0.12))] px-6 py-6 shadow-[0_26px_70px_rgba(0,0,0,0.20)] backdrop-blur-[3px] md:px-8 md:py-8">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Berita
                </Link>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-white/84">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
                    <Newspaper className="h-4 w-4" />
                    {berita.kategori}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(berita.created_at)}
                  </span>
                </div>
                <h1 className="mt-5 max-w-4xl font-serif text-4xl font-black leading-tight text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.38)] md:text-5xl">
                  {berita.judul}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-white/84 md:text-lg">
                  {berita.ringkasan}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="mx-auto relative z-10 -mt-10 w-[min(1180px,calc(100%-2rem))] pb-16 md:-mt-12">
        <article className="rounded-[2.2rem] border border-[#dfe9f6] bg-[linear-gradient(180deg,_rgba(255,255,255,0.97),_rgba(242,248,255,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              {berita.gambar ? (
                <div className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="h-[320px] w-full object-cover md:h-[420px]"
                  />
                </div>
              ) : null}

              <div className="mx-auto mt-8 max-w-3xl">
                <div className="rounded-[1.6rem] border border-sky-100 bg-[linear-gradient(145deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.98))] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                    Ringkasan Berita
                  </p>
                  <p className="mt-3 text-lg leading-9 text-slate-700">{berita.ringkasan}</p>
                </div>

                <div className="prose prose-slate mt-8 max-w-none text-[1.05rem] leading-9 text-slate-700">
                  {berita.isi
                    .split("\n")
                    .filter((paragraph) => paragraph.trim().length > 0)
                    .map((paragraph, index) => (
                      <p key={`${paragraph.slice(0, 20)}-${index}`} className="mb-6">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-[1rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-3 text-sky-700 shadow-[0_12px_24px_rgba(59,130,246,0.16)]">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                      Bagikan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Sebarkan berita ini ke warga lain</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`https://wa.me/?text=${encodeURIComponent(`${berita.judul} ${articleUrl}`)}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Link>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Link>
                  <Link
                    href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(berita.judul)}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    <Send className="h-4 w-4" />
                    Telegram
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-amber-100 bg-[linear-gradient(145deg,_rgba(255,251,235,0.98),_rgba(255,255,255,0.98))] p-6 shadow-[0_18px_50px_rgba(180,83,9,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                  Detail Artikel
                </p>
                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Kategori</p>
                    <p className="mt-1 font-semibold text-slate-950">{berita.kategori}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Tanggal Terbit</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatDate(berita.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Tujuan</p>
                    <p className="mt-1">Informasi ini dipublikasikan untuk masyarakat Kampung Palareng dan pihak terkait.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
