import { ClipboardList, HandCoins, ShieldEllipsis } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { BantuanForm } from "@/components/public/bantuan-form";
import { BantuanCard } from "@/components/shared/bantuan-card";
import { getPublicAvailableBantuan, getPublicHero } from "@/lib/api";

export default async function BantuanPage() {
  const [hero, availableBantuan] = await Promise.all([getPublicHero(), getPublicAvailableBantuan()]);

  return (
    <div className="bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_42%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/bantuan" />
        <PublicPageHero
          hero={hero}
          eyebrow="Layanan Bantuan"
          title="Informasi bantuan kampung dan pengajuan yang lebih tertata"
          description="Admin membuka jenis bantuan beserta kuotanya dari dashboard. Bantuan yang sedang tersedia akan otomatis muncul di dashboard masyarakat agar warga hanya mengajukan program yang memang sedang dibuka."
          shortcuts={[
            {
              href: "#layanan-bantuan",
              label: "Jenis Bantuan",
              icon: <HandCoins className="h-7 w-7" />,
            },
            {
              href: "#layanan-bantuan",
              label: "Ajukan",
              icon: <ClipboardList className="h-7 w-7" />,
            },
            {
              href: "#layanan-bantuan",
              label: "Verifikasi",
              icon: <ShieldEllipsis className="h-7 w-7" />,
            },
          ]}
        />
      </div>

      <main id="layanan-bantuan" className="container-shell relative z-10 -mt-10 space-y-8 pb-16 md:-mt-12">
        <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(245,250,255,0.96))] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Bantuan Aktif
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Jenis bantuan yang sedang dibuka admin
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Hanya bantuan yang dibuka admin dan masih tersedia kuotanya yang muncul di sini.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm font-semibold text-emerald-700">
              {availableBantuan.length} bantuan tersedia
            </div>
          </div>

          {availableBantuan.length > 0 ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {availableBantuan.map((item) => (
                <BantuanCard
                  key={item.id}
                  title={item.nama_bantuan}
                  source={item.sumber}
                  category={item.kategori}
                  description={item.deskripsi ?? "Deskripsi bantuan belum ditambahkan admin."}
                  period={item.periode}
                  kuota={item.kuota}
                  remaining={item.remaining_quota}
                  isOpen={item.is_open_for_submission}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.6rem] border border-amber-100 bg-[linear-gradient(180deg,_#fffaf0,_#ffffff)] px-5 py-5 text-sm leading-7 text-slate-600">
              Saat ini belum ada program bantuan yang dibuka admin untuk pengajuan masyarakat.
            </div>
          )}
        </section>

        <BantuanForm availableBantuan={availableBantuan} />
      </main>
      <PublicFooter />
    </div>
  );
}
