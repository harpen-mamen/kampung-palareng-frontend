/* eslint-disable @next/next/no-img-element */
import {
  BookOpenText,
  Building2,
  Flag,
  Gem,
  Landmark,
  Sparkles,
} from "lucide-react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { getPublicHero } from "@/lib/api";

export default async function ProfilPage() {
  const profile = await getPublicHero();

  const profileSections = [
    {
      title: "Sejarah Kampung",
      eyebrow: "Jejak Awal",
      icon: <BookOpenText className="h-5 w-5" />,
      tone: "sky",
      content:
        profile.profile_history ||
        "Sejarah kampung belum ditambahkan. Admin dapat melengkapi narasi sejarah dari dashboard.",
    },
    {
      title: "Visi dan Misi",
      eyebrow: "Arah Pembangunan",
      icon: <Flag className="h-5 w-5" />,
      tone: "emerald",
      content:
        profile.profile_vision_mission ||
        "Visi dan misi kampung belum ditambahkan. Admin dapat memperbaruinya melalui dashboard.",
    },
    {
      title: "Potensi Kampung",
      eyebrow: "Kekuatan Lokal",
      icon: <Gem className="h-5 w-5" />,
      tone: "amber",
      content:
        profile.profile_potential ||
        "Potensi kampung belum ditambahkan. Admin dapat mengisi potensi unggulan dari dashboard.",
    },
  ] as const;

  return (
    <div className="bg-[linear-gradient(180deg,_#eef7f4_0%,_#f7fbff_18%,_#ffffff_46%)]">
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/profil" />
        <PublicPageHero
          hero={profile}
          eyebrow="Profil Kampung"
          title={profile.profile_title || "Profil Kampung Palareng"}
          description={
            profile.profile_description ||
            "Ringkasan sejarah, visi misi, potensi, dan susunan pemerintahan Kampung Palareng ditampilkan secara ringkas, elegan, dan lebih mudah dibaca warga."
          }
          stats={[
            {
              label: "Profil",
              value: "Terbarui",
              caption: "Konten profil dapat diatur dari dashboard admin.",
              tone: "sky",
            },
            {
              label: "Narasi",
              value: "Tertata",
              caption: "Sejarah, visi, dan potensi ditampilkan lebih nyaman dibaca.",
              tone: "emerald",
            },
            {
              label: "Pemerintahan",
              value: profile.government_structure?.length ?? 0,
              caption: "Perangkat kampung yang tampil pada struktur organisasi.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#profil-kampung",
              label: "Sejarah",
              icon: <BookOpenText className="h-7 w-7" />,
            },
            {
              href: "#profil-kampung",
              label: "Potensi",
              icon: <Sparkles className="h-7 w-7" />,
            },
            {
              href: "#pemerintahan-kampung",
              label: "Struktur",
              icon: <Landmark className="h-7 w-7" />,
            },
          ]}
        />
      </div>
      <main id="profil-kampung" className="container-shell relative z-10 -mt-10 pb-16 md:-mt-12">

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {profileSections.map((section) => (
              <article
                key={section.title}
                className={`rounded-[1.85rem] border p-6 shadow-[0_22px_60px_rgba(15,23,42,0.07)] ${
                  section.tone === "sky"
                    ? "border-sky-100 bg-[linear-gradient(180deg,_#f8fbff,_#eef6ff)]"
                    : section.tone === "emerald"
                      ? "border-emerald-100 bg-[linear-gradient(180deg,_#f5fcf8,_#effcf5)]"
                      : "border-amber-100 bg-[linear-gradient(180deg,_#fffaf2,_#fff3df)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-[1.2rem] p-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ${
                      section.tone === "sky"
                        ? "bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] text-sky-700"
                        : section.tone === "emerald"
                          ? "bg-[linear-gradient(135deg,_#d1fae5,_#ecfdf5)] text-emerald-700"
                          : "bg-[linear-gradient(135deg,_#fef3c7,_#fffbeb)] text-amber-700"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {section.eyebrow}
                    </p>
                    <h2 className="mt-2 font-serif text-[2rem] font-bold leading-tight text-slate-950">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="mt-5 rounded-[1.4rem] border border-white/70 bg-white/70 px-5 py-5">
                  <p className="text-base leading-9 text-slate-700">{section.content}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-[1.9rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,248,255,0.96))] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="rounded-[1.4rem] border border-slate-100 bg-white/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Visual Kampung
              </p>
              <h2 className="mt-2 font-serif text-[1.8rem] font-bold text-slate-950">
                Gambaran Kampung Palareng
              </h2>
            </div>
            <div className="mt-4 overflow-hidden rounded-[1.6rem]">
              {profile.profile_image ? (
                <div className="relative">
                  <img
                    src={profile.profile_image}
                    alt={profile.profile_title}
                    className="h-full min-h-[520px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.08)_10%,_rgba(15,23,42,0.56)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="rounded-[1.4rem] border border-white/20 bg-[linear-gradient(180deg,_rgba(15,23,42,0.18),_rgba(15,23,42,0.68))] px-5 py-4 text-white backdrop-blur-md">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/90">
                        Profil Kampung
                      </p>
                      <p className="mt-2 font-serif text-[1.5rem] font-bold leading-snug text-white">
                        {profile.profile_title || "Kampung Palareng"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/80">
                        Data foto, sejarah, dan pemerintahan kampung dapat diperbarui dari dashboard admin.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[520px] items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,_#dbeafe,_#f8fafc,_#dcfce7)] px-6 text-center text-slate-500">
                  Foto profil kampung dapat diatur dari dashboard admin.
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="pemerintahan-kampung" className="mt-14">
          <div className="rounded-[2.1rem] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                <Building2 className="h-4 w-4" />
                Pemerintahan
              </div>
              <h2 className="mt-5 font-serif text-[2.35rem] font-bold leading-tight text-slate-950">
                Struktur Pemerintahan Kampung
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-slate-600">
                Foto, jabatan, dan nama perangkat kampung ditampilkan dari data yang diatur pada dashboard admin.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center">
              {(profile.government_structure ?? []).map((member, index, members) => (
                <div key={`${member.position}-${index}`} className="flex w-full flex-col items-center">
                  <div className="rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
                    {member.position}
                  </div>
                  <article className="mt-5 w-full max-w-[320px] overflow-hidden rounded-[1.85rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-[360px] w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[360px] items-center justify-center bg-[linear-gradient(180deg,_#dbeafe,_#ffffff)] text-slate-500">
                        Belum ada foto
                      </div>
                    )}
                    <div className="border-t border-slate-100 bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-5 text-center">
                      <h3 className="font-serif text-[1.4rem] font-bold leading-snug text-slate-950">
                        {member.name}
                      </h3>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        {member.position}
                      </p>
                    </div>
                  </article>
                  {index < members.length - 1 ? (
                    <div className="flex h-16 w-full items-center justify-center">
                      <div className="h-full w-px bg-[linear-gradient(180deg,_#facc15,_#bfdbfe)]" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
