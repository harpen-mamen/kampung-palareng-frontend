import { Mail, MapPin, Phone, TimerReset } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { getPublicHero } from "@/lib/api";

export default async function KontakPage() {
  const hero = await getPublicHero();

  return (
    <div className="bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_42%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/kontak" />
        <PublicPageHero
          hero={hero}
          eyebrow="Kontak Kampung"
          title="Hubungi Pemerintah Kampung Palareng"
          description="Halaman kontak disiapkan untuk layanan administrasi, informasi umum kampung, serta koordinasi pembaruan data warga dan layanan publik."
          stats={[
            {
              label: "Layanan",
              value: "Administrasi",
              caption: "Surat, bantuan, dan informasi umum kampung.",
              tone: "sky",
            },
            {
              label: "Jam Kantor",
              value: "08.00-14.00",
              caption: "Pelayanan utama pada hari kerja kantor kampung.",
              tone: "emerald",
            },
            {
              label: "Respon",
              value: "Terarah",
              caption: "Warga dapat memilih saluran sesuai kebutuhan layanan.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#kontak-detail",
              label: "Alamat Kantor",
              icon: <MapPin className="h-7 w-7" />,
            },
            {
              href: "#kontak-detail",
              label: "Email",
              icon: <Mail className="h-7 w-7" />,
            },
            {
              href: "#kontak-detail",
              label: "Layanan",
              icon: <Phone className="h-7 w-7" />,
            },
          ]}
        />
      </div>

      <main id="kontak-detail" className="container-shell relative z-10 -mt-10 pb-16 md:-mt-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.85rem] border border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f4f9ff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] bg-sky-50 p-3 text-sky-700">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Informasi Kantor</h3>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-sky-600" />
                Kampung Palareng, Kabupaten Kepulauan Sangihe
              </p>
              <p className="flex items-start gap-3">
                <TimerReset className="mt-1 h-4 w-4 shrink-0 text-sky-600" />
                Senin - Kamis, 08.00 - 14.00 WITA
              </p>
            </div>
          </div>
          <div className="rounded-[1.85rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fff9)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] bg-emerald-50 p-3 text-emerald-700">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Saluran Layanan</h3>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                Email: admin@palareng.id
              </p>
              <p className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                Portal ini mendukung pengajuan surat dan bantuan secara online.
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
