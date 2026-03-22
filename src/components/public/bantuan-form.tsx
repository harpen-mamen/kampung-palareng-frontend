"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import {
  BadgeCheck,
  ClipboardList,
  HandHelping,
  LogIn,
  MapPinned,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { createPengajuanBantuan, getAuthMe, setApiToken } from "@/lib/api";
import { clearAuthSession, getStoredToken, getStoredUser, saveAuthSession } from "@/lib/auth";
import type { AuthUser, Bantuan } from "@/types/portal";

function subscribeToClientReady() {
  return () => {};
}

type BantuanFormProps = {
  availableBantuan: Bantuan[];
};

const initialState = {
  bantuan_id: "",
  keterangan: "",
};

export function BantuanForm({ availableBantuan }: BantuanFormProps) {
  const isHydrated = useSyncExternalStore(subscribeToClientReady, () => true, () => false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser("warga"));
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const token = getStoredToken("warga");
    const storedUser = getStoredUser("warga");

    if (!token || !storedUser) {
      setApiToken(null);
      return;
    }

    setApiToken(token);

    void getAuthMe()
      .then((user) => {
        saveAuthSession(token, user, "warga");
        setCurrentUser(user);
      })
      .catch(() => {
        clearAuthSession("warga");
        setCurrentUser(null);
      });
  }, []);

  const selectedBantuan = availableBantuan.find((item) => String(item.id) === form.bantuan_id);
  const isApprovedWarga =
    currentUser?.role === "warga" && currentUser?.approval_status === "disetujui";
  const hasWhatsapp = Boolean(currentUser?.whatsapp);

  if (!isHydrated) {
    return (
      <div className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
        <div className="h-10 rounded-2xl bg-slate-100" />
        <div className="mt-4 h-10 rounded-2xl bg-slate-100" />
        <div className="mt-4 h-32 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (availableBantuan.length === 0) {
    return (
      <section className="rounded-[1.9rem] border border-amber-100 bg-[linear-gradient(180deg,_#fffaf0,_#ffffff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-[1.2rem] bg-amber-100 p-3 text-amber-700">
            <HandHelping className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950">Belum ada bantuan yang dibuka</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Jenis bantuan akan tampil di dashboard masyarakat setelah admin membuka program dan
              mengatur kuotanya dari dashboard admin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!currentUser || !isApprovedWarga) {
    return (
      <section className="rounded-[1.9rem] border border-sky-100 bg-[linear-gradient(180deg,_#f3f9ff,_#ffffff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] bg-sky-100 p-3 text-sky-700">
                <LogIn className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                Akses Masyarakat
              </p>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Login masyarakat diperlukan sebelum mengajukan bantuan
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Warga harus memakai akun masyarakat yang sudah disetujui admin agar pengajuan bantuan
              dapat dikirim dan dikaitkan dengan data keluarga yang valid.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/surat?redirect=%2Fbantuan"
                className="inline-flex rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Login Masyarakat
              </Link>
              <Link
                href="/surat?redirect=%2Fbantuan&mode=register"
                className="inline-flex rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Registrasi Masyarakat
              </Link>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {availableBantuan.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.35rem] border border-white/80 bg-white/90 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {item.kategori}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">{item.nama_bantuan}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[1.95rem] border border-emerald-100 bg-[linear-gradient(145deg,_rgba(236,253,245,0.96),_rgba(255,255,255,0.98))] p-6 shadow-[0_28px_70px_rgba(16,185,129,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Dashboard Masyarakat
            </p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">
              Ajukan bantuan yang sedang dibuka admin
            </h3>
          </div>
          <span className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck className="mr-1 h-4 w-4" />
            Akun disetujui
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] bg-emerald-100 p-2.5 text-emerald-700">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Pemohon
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{currentUser.name}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] bg-sky-100 p-2.5 text-sky-700">
                <MapPinned className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Lindongan
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{currentUser.lindongan ?? "-"}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] bg-amber-100 p-2.5 text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Program Dibuka
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {availableBantuan.length} jenis bantuan aktif
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="rounded-[1rem] bg-rose-100 p-2.5 text-rose-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  WhatsApp
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {currentUser.whatsapp ?? currentUser.phone ?? "Belum diisi"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <form
        className="rounded-[1.95rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(245,250,255,0.96))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            setMessage("");
            setError("");

            try {
              const payload = new FormData();
              payload.append("bantuan_id", form.bantuan_id);
              payload.append("keterangan", form.keterangan);

              const result = await createPengajuanBantuan(payload);
              setMessage(
                `Pengajuan bantuan berhasil dikirim. ID pengajuan: ${result.id}. Silakan tunggu verifikasi dari admin lewat WhatsApp yang terdaftar.`,
              );
              setForm(initialState);
            } catch (submissionError) {
              const messageText =
                submissionError instanceof Error
                  ? submissionError.message
                  : "Pengajuan bantuan gagal dikirim.";
              setError(messageText);
            }
          });
        }}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-[1rem] bg-sky-100 p-3 text-sky-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              Form Pengajuan
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">
              Pilih bantuan yang sedang tersedia
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-900">Jenis bantuan tersedia</label>
            <select
              value={form.bantuan_id}
              onChange={(event) => setForm((prev) => ({ ...prev, bantuan_id: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">Pilih bantuan yang dibuka admin</option>
              {availableBantuan.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama_bantuan} - sisa {item.remaining_quota ?? item.kuota ?? "tanpa batas"}
                </option>
              ))}
            </select>
          </div>

          {selectedBantuan ? (
            <div className="rounded-[1.35rem] border border-emerald-100 bg-[linear-gradient(180deg,_#f0fdf4,_#ffffff)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Ringkasan Bantuan
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">{selectedBantuan.nama_bantuan}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{selectedBantuan.deskripsi}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Kategori</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{selectedBantuan.kategori}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Periode</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{selectedBantuan.periode}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Sisa Kuota</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedBantuan.remaining_quota ?? selectedBantuan.kuota ?? "Tidak dibatasi"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-slate-900">Keterangan pengajuan</label>
            <textarea
              value={form.keterangan}
              onChange={(event) => setForm((prev) => ({ ...prev, keterangan: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Jelaskan alasan atau kondisi pengajuan bantuan"
              rows={5}
            />
          </div>

        </div>

        {!hasWhatsapp ? (
          <p className="mt-4 text-sm text-rose-700">
            Nomor WhatsApp akun masyarakat belum terisi. Hubungi admin agar data penduduk Anda dilengkapi sebelum mengajukan bantuan.
          </p>
        ) : null}
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

        <button
          className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white"
          disabled={isPending || !form.bantuan_id || !hasWhatsapp}
        >
          {isPending ? "Mengirim..." : "Kirim Pengajuan Bantuan"}
        </button>
      </form>
    </div>
  );
}
