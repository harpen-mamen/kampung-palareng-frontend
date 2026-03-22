import { FileCheck2, ShieldCheck, UserRoundPlus } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { SuratForm } from "@/components/public/surat-form";
import { getPublicHero } from "@/lib/api";

export default async function SuratPage() {
  const hero = await getPublicHero();

  return (
    <div className="bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_42%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/surat" />
        <PublicPageHero
          hero={hero}
          eyebrow="Layanan Surat"
          title="Registrasi warga, login, lalu ajukan surat resmi kampung"
          description="Warga mendaftar memakai data keluarga yang valid terlebih dahulu. Setelah disetujui admin, akun bisa dipakai untuk masuk, memilih jenis surat, dan mengajukan layanan secara resmi."
          stats={[
            {
              label: "Registrasi",
              value: "Terverifikasi",
              caption: "Data keluarga dan lindongan dicocokkan dengan database kampung.",
              tone: "sky",
            },
            {
              label: "Persetujuan",
              value: "Admin",
              caption: "Akun warga aktif hanya setelah ditinjau dan disetujui.",
              tone: "emerald",
            },
            {
              label: "Layanan",
              value: "Resmi",
              caption: "Surat dibuat dengan alur administrasi kampung yang tertata.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#form-surat",
              label: "Ajukan Surat",
              icon: <FileCheck2 className="h-7 w-7" />,
            },
            {
              href: "#form-surat",
              label: "Registrasi",
              icon: <UserRoundPlus className="h-7 w-7" />,
            },
            {
              href: "#form-surat",
              label: "Verifikasi",
              icon: <ShieldCheck className="h-7 w-7" />,
            },
          ]}
        />
      </div>

      <main id="form-surat" className="container-shell relative z-10 -mt-10 pb-16 md:-mt-12">
        <SuratForm />
      </main>
      <PublicFooter />
    </div>
  );
}
