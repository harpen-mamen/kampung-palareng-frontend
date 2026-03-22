"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { updateAdminHeroSetting } from "@/lib/api";
import type { HeroSetting } from "@/types/portal";

type StructureMember = NonNullable<HeroSetting["government_structure"]>[number];
type HeroSectionItem = NonNullable<HeroSetting["hero_sections"]>[number];

const emptyMember: StructureMember = {
  position: "",
  name: "",
  photo: null,
  photo_path: null,
};

function createHeroSectionItem(
  hero: HeroSetting,
  patch?: Partial<HeroSectionItem>,
): HeroSectionItem {
  return {
    badge: hero.hero_badge,
    title: hero.hero_title,
    description: hero.hero_description,
    primary_label: hero.hero_primary_label,
    primary_url: hero.hero_primary_url,
    secondary_label: hero.hero_secondary_label,
    secondary_url: hero.hero_secondary_url,
    image: null,
    image_path: null,
    ...patch,
  };
}

export function HeroSettingsManager({ initialHero }: { initialHero: HeroSetting }) {
  const [hero, setHero] = useState<HeroSetting>(initialHero);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImages, setHeroImages] = useState<File[]>([]);
  const [heroSectionImages, setHeroSectionImages] = useState<Record<number, File | null>>({});
  const [officialPhoto, setOfficialPhoto] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [structurePhotos, setStructurePhotos] = useState<Record<number, File | null>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const structure = hero.government_structure ?? [];
  const heroSections =
    hero.hero_sections?.length
      ? hero.hero_sections
      : (hero.hero_images?.length
          ? hero.hero_images.map((image) => createHeroSectionItem(hero, { image, image_path: null }))
          : [createHeroSectionItem(hero, { image: hero.hero_image ?? null, image_path: null })]);

  useEffect(() => {
    setHero(initialHero);
  }, [initialHero]);

  function updateStructureMember(index: number, patch: Partial<StructureMember>) {
    const next = [...structure];
    next[index] = { ...next[index], ...patch };
    setHero((prev) => ({ ...prev, government_structure: next }));
  }

  function addHeroSection() {
    setHero((prev) => ({
      ...prev,
      hero_sections: [...(prev.hero_sections ?? heroSections), createHeroSectionItem(prev)],
    }));
  }

  function removeHeroSection(index: number) {
    const next = [...heroSections];
    next.splice(index, 1);
    setHero((prev) => ({
      ...prev,
      hero_sections: next.length > 0 ? next : [createHeroSectionItem(prev)],
    }));
    setHeroSectionImages((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  }

  function addStructureMember() {
    setHero((prev) => ({
      ...prev,
      government_structure: [...(prev.government_structure ?? []), { ...emptyMember }],
    }));
  }

  function removeStructureMember(index: number) {
    const next = [...structure];
    next.splice(index, 1);
    setHero((prev) => ({ ...prev, government_structure: next }));
    setStructurePhotos((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setMessage("");
          setError("");

          try {
            const payload = new FormData();
            payload.append("hero_badge", hero.hero_badge);
            payload.append("hero_title", hero.hero_title);
            payload.append("hero_description", hero.hero_description);
            payload.append("hero_primary_label", hero.hero_primary_label);
            payload.append("hero_primary_url", hero.hero_primary_url);
            payload.append("hero_secondary_label", hero.hero_secondary_label);
            payload.append("hero_secondary_url", hero.hero_secondary_url);
            payload.append("hero_panel_title", hero.hero_panel_title);
            payload.append("hero_panel_description", hero.hero_panel_description ?? "");
            payload.append("official_name", hero.official_name);
            payload.append("official_position", hero.official_position);
            payload.append("official_message", hero.official_message ?? "");
            payload.append("profile_title", hero.profile_title);
            payload.append("profile_description", hero.profile_description ?? "");
            payload.append("profile_history", hero.profile_history ?? "");
            payload.append("profile_vision_mission", hero.profile_vision_mission ?? "");
            payload.append("profile_potential", hero.profile_potential ?? "");
            payload.append(
              "hero_sections",
              JSON.stringify(
                heroSections.map((item) => ({
                  badge: hero.hero_badge,
                  title: hero.hero_title,
                  description: hero.hero_description,
                  primary_label: hero.hero_primary_label,
                  primary_url: hero.hero_primary_url,
                  secondary_label: hero.hero_secondary_label,
                  secondary_url: hero.hero_secondary_url,
                  image_path: item.image_path ?? null,
                })),
              ),
            );
            payload.append(
              "government_structure",
              JSON.stringify(
                (hero.government_structure ?? []).map((item) => ({
                  position: item.position,
                  name: item.name,
                  photo_path: item.photo_path ?? null,
                })),
              ),
            );

            heroImages.forEach((file) => {
              payload.append("hero_images[]", file);
            });

            Object.entries(structurePhotos).forEach(([index, file]) => {
              if (file) {
                payload.append(`government_structure_photos[${index}]`, file);
              }
            });

            Object.entries(heroSectionImages).forEach(([index, file]) => {
              if (file) {
                payload.append(`hero_section_images[${index}]`, file);
              }
            });

            if (heroImage) {
              payload.append("hero_image", heroImage);
            }

            if (officialPhoto) {
              payload.append("official_photo", officialPhoto);
            }

            if (profileImage) {
              payload.append("profile_image", profileImage);
            }

            const updated = await updateAdminHeroSetting(payload);
            setHero(updated);
            setHeroImage(null);
            setHeroImages([]);
            setHeroSectionImages({});
            setOfficialPhoto(null);
            setProfileImage(null);
            setStructurePhotos({});
            setMessage("Pengaturan beranda dan profil kampung berhasil diperbarui.");
          } catch (caughtError) {
            setError(
              caughtError instanceof Error
                ? caughtError.message
                : "Pembaruan pengaturan gagal. Pastikan backend berjalan dan login admin masih aktif.",
            );
          }
        });
      }}
    >
      <div className="card-panel grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-slate-950">Pengaturan Hero Beranda</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Teks hero dipakai sama untuk semua halaman publik. Yang bisa ditambah banyak di sini adalah foto hero yang akan tampil bergantian.
          </p>
        </div>
        <input value={hero.hero_badge} onChange={(e) => setHero((prev) => ({ ...prev, hero_badge: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Badge hero" />
        <input value={hero.official_name} onChange={(e) => setHero((prev) => ({ ...prev, official_name: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nama pejabat" />
        <textarea value={hero.hero_title} onChange={(e) => setHero((prev) => ({ ...prev, hero_title: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Judul hero" rows={3} />
        <textarea value={hero.hero_description} onChange={(e) => setHero((prev) => ({ ...prev, hero_description: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Deskripsi singkat hero" rows={2} />
        <input value={hero.hero_primary_label} onChange={(e) => setHero((prev) => ({ ...prev, hero_primary_label: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Label tombol utama" />
        <input value={hero.hero_primary_url} onChange={(e) => setHero((prev) => ({ ...prev, hero_primary_url: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="URL tombol utama" />
        <input value={hero.hero_secondary_label} onChange={(e) => setHero((prev) => ({ ...prev, hero_secondary_label: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Label tombol kedua" />
        <input value={hero.hero_secondary_url} onChange={(e) => setHero((prev) => ({ ...prev, hero_secondary_url: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="URL tombol kedua" />
        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Galeri Foto Hero</p>
            <p className="text-xs text-slate-500">Tambah lebih dari satu foto hero untuk ditampilkan bergantian dengan teks yang sama.</p>
          </div>
          <button type="button" onClick={addHeroSection} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800">
            Tambah Foto Hero
          </button>
        </div>
        <div className="md:col-span-2 grid gap-4">
          {heroSections.map((section, index) => (
            <div key={`${section.title}-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Foto Hero {index + 1}
                </p>
                {heroSections.length > 1 ? (
                  <button type="button" onClick={() => removeHeroSection(index)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">
                    Hapus
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4">
                <label className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                  Upload gambar hero
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setHeroSectionImages((prev) => ({ ...prev, [index]: e.target.files?.[0] ?? null }))
                    }
                    className="mt-2 block w-full"
                  />
                  {section.image ? <Image src={section.image} alt={`Hero ${index + 1}`} width={220} height={124} unoptimized className="mt-3 h-32 w-56 rounded-xl object-cover" /> : null}
                </label>
              </div>
            </div>
          ))}
        </div>
        <input value={hero.hero_panel_title} onChange={(e) => setHero((prev) => ({ ...prev, hero_panel_title: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Judul panel selayang pandang" />
        <input value={hero.official_position} onChange={(e) => setHero((prev) => ({ ...prev, official_position: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Jabatan pejabat" />
        <textarea value={hero.hero_panel_description ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, hero_panel_description: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Deskripsi panel selayang pandang" rows={3} />
        <textarea value={hero.official_message ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, official_message: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Sambutan pejabat" rows={4} />
        <label className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
          Foto pejabat utama
          <input type="file" accept="image/*" onChange={(e) => setOfficialPhoto(e.target.files?.[0] ?? null)} className="mt-2 block w-full" />
          {hero.official_photo ? <Image src={hero.official_photo} alt="Pejabat" width={96} height={96} unoptimized className="mt-3 h-24 w-24 rounded-xl object-cover" /> : null}
        </label>
      </div>

      <div className="card-panel grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-slate-950">Profil Kampung</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Atur foto bagian profil kampung, sejarah, visi misi, dan potensi agar halaman profil bisa diedit dari admin.
          </p>
        </div>
        <input value={hero.profile_title} onChange={(e) => setHero((prev) => ({ ...prev, profile_title: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Judul profil kampung" />
        <textarea value={hero.profile_description ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, profile_description: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Deskripsi singkat profil kampung" rows={2} />
        <textarea value={hero.profile_history ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, profile_history: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Sejarah kampung" rows={5} />
        <textarea value={hero.profile_vision_mission ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, profile_vision_mission: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Visi dan misi kampung" rows={5} />
        <textarea value={hero.profile_potential ?? ""} onChange={(e) => setHero((prev) => ({ ...prev, profile_potential: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Potensi kampung" rows={5} />
        <label className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 md:col-span-2">
          Foto profil kampung
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)} className="mt-2 block w-full" />
          {hero.profile_image ? <Image src={hero.profile_image} alt="Profil Kampung" width={160} height={110} unoptimized className="mt-3 h-28 w-40 rounded-xl object-cover" /> : null}
        </label>
      </div>

      <div className="card-panel space-y-5 rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-950">Struktur Pemerintahan</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Atur nama, jabatan, dan foto perangkat kampung yang akan tampil pada halaman profil.
            </p>
          </div>
          <button type="button" onClick={addStructureMember} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800">
            Tambah Anggota
          </button>
        </div>

        <div className="grid gap-4">
          {(hero.government_structure ?? []).map((member, index) => (
            <div key={`${member.position}-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Anggota {index + 1}
                </p>
                <button type="button" onClick={() => removeStructureMember(index)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">
                  Hapus
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
                <div className="flex flex-col items-center gap-3">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name || member.position} width={112} height={144} unoptimized className="h-36 w-28 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-36 w-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
                      Belum ada foto
                    </div>
                  )}
                  <label className="w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-sm text-slate-600">
                    Upload Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setStructurePhotos((prev) => ({ ...prev, [index]: e.target.files?.[0] ?? null }))
                      }
                      className="mt-2 block w-full text-xs"
                    />
                  </label>
                </div>

                <div className="grid gap-4">
                  <input value={member.position} onChange={(e) => updateStructureMember(index, { position: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Jabatan. Contoh: Kapitalaung" />
                  <input value={member.name} onChange={(e) => updateStructureMember(index, { name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nama lengkap" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <div>
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">
            {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </form>
  );
}
