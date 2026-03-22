import { Camera, Compass, Palmtree } from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { TourismCard } from "@/components/shared/tourism-card";
import { getPublicHero, getPublicWisata } from "@/lib/api";

export default async function WisataPage() {
  const [wisata, hero] = await Promise.all([getPublicWisata(), getPublicHero()]);

  return (
    <div className="bg-[linear-gradient(180deg,_#f2f8f4_0%,_#fff9f0_18%,_#ffffff_42%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/wisata" />
        <PublicPageHero
          hero={hero}
          eyebrow="Wisata Kampung"
          title="Beberapa tempat wisata di Kampung Palareng"
          description="Halaman wisata menampilkan lokasi dan potensi destinasi kampung dengan susunan yang lebih menarik, ringan, dan mudah dijelajahi pengunjung."
          stats={[
            {
              label: "Destinasi",
              value: wisata.length,
              caption: "Lokasi wisata yang sudah dipublikasikan di portal kampung.",
              tone: "sky",
            },
            {
              label: "Nuansa",
              value: "Lokal",
              caption: "Menonjolkan identitas kampung dan daya tarik setempat.",
              tone: "emerald",
            },
            {
              label: "Publikasi",
              value: "Terbuka",
              caption: "Wisata dapat diperkenalkan kepada tamu dan pengunjung kampung.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#destinasi-wisata",
              label: "Destinasi",
              icon: <Palmtree className="h-7 w-7" />,
            },
            {
              href: "#destinasi-wisata",
              label: "Jelajahi",
              icon: <Compass className="h-7 w-7" />,
            },
            {
              href: "#destinasi-wisata",
              label: "Galeri",
              icon: <Camera className="h-7 w-7" />,
            },
          ]}
        />
      </div>

      <main id="destinasi-wisata" className="container-shell relative z-10 -mt-10 pb-16 md:-mt-12">
        <section className="rounded-[2rem] border border-[#ead9c5] bg-[linear-gradient(180deg,_#fff7ed,_#fffbf5)] px-6 py-8 shadow-[0_26px_70px_rgba(120,74,32,0.10)] md:px-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {wisata.map((item) => (
              <TourismCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
