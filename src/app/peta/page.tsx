import { Filter, MapPinned, Users } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { PublicMapPanel } from "@/components/maps/public-map-panel";
import { getPublicHero, getPublicMap } from "@/lib/api";

export default async function PetaPage() {
  const [map, hero] = await Promise.all([getPublicMap(), getPublicHero()]);

  return (
    <div className="bg-[linear-gradient(180deg,_#edf6f3_0%,_#f4f9ff_18%,_#ffffff_42%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/peta" />
        <PublicPageHero
          hero={hero}
          eyebrow="Peta Digital Publik"
          title="Peta interaktif rumah warga Kampung Palareng"
          description="Peta publik menampilkan persebaran rumah warga, batas lindongan, dan informasi umum rumah dalam tampilan yang lebih rapi, jelas, dan mudah dipakai warga."
          stats={[
            {
              label: "Cakupan",
              value: `${map.filters.lindongan.length} Lindongan`,
              caption: "Wilayah yang sudah muncul pada data rumah aktif.",
              tone: "sky",
            },
            {
              label: "Marker",
              value: map.markers.length,
              caption: "Titik rumah warga yang sudah tersimpan di database.",
              tone: "emerald",
            },
            {
              label: "Mode",
              value: "Publik",
              caption: "Informasi umum tanpa membuka data sensitif warga.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#peta-utama",
              label: "Lihat Peta",
              icon: <MapPinned className="h-7 w-7" />,
            },
            {
              href: "#peta-utama",
              label: "Filter Data",
              icon: <Filter className="h-7 w-7" />,
            },
            {
              href: "/statistik",
              label: "Statistik",
              icon: <Users className="h-7 w-7" />,
            },
          ]}
        />
      </div>

      <main id="peta-utama" className="container-shell relative z-10 -mt-10 pb-16 md:-mt-12">
        <div className="rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm">
          <PublicMapPanel initialData={map} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
