"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  ClipboardList,
  FileBadge2,
  FileText,
  LogIn,
  Mail,
  MapPinned,
  Paperclip,
  Phone,
  ShieldCheck,
  UserCircle2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  createPengajuanSurat,
  getAuthMe,
  loginWarga,
  logoutAuth,
  registerWarga,
  setApiToken,
} from "@/lib/api";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
} from "@/lib/auth";
import type { AuthUser } from "@/types/portal";

const suratOptions = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu",
  "Surat Pengantar SKCK",
  "Surat Keterangan Penghasilan Orang Tua",
  "Surat Keterangan Belum Menikah",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Keterangan Ahli Waris",
  "Surat Keterangan Janda/Duda",
  "Surat Keterangan Beda Nama",
  "Surat Pengantar KTP",
  "Surat Pengantar Kartu Keluarga",
  "Surat Pengantar Nikah",
  "Surat Pengantar Pindah",
  "Surat Pengantar",
];

const keperluanSuggestions = [
  "Masuk TNI",
  "Masuk Polri",
  "Lamaran kerja",
  "Beasiswa pendidikan",
  "Pembukaan rekening bank",
  "Pengurusan BPJS",
  "Pengurusan administrasi sekolah",
  "Pengurusan administrasi pernikahan",
  "Pengurusan data kependudukan",
];

const OTHER_KEPERLUAN = "__lainnya__";

const initialSuratState = {
  jenis_surat: "",
  keperluan: "",
};

const initialRegisterState = {
  nik: "",
  nama_keluarga: "",
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  lindongan: "Lindongan 1",
  password: "",
  password_confirmation: "",
};

const initialLoginState = {
  email: "",
  password: "",
};

function ApprovalBadge({ status }: { status?: AuthUser["approval_status"] }) {
  const tone =
    status === "disetujui"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "ditolak"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  const label =
    status === "disetujui"
      ? "Disetujui"
      : status === "ditolak"
        ? "Ditolak"
        : "Menunggu Persetujuan";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function subscribeToClientReady() {
  return () => {};
}

function sanitizeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

function InfoItem({
  icon,
  label,
  value,
  tone = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "slate" | "sky" | "emerald" | "amber" | "rose" | "violet";
}) {
  const toneClasses = {
    slate: {
      wrapper: "border-white/80 bg-white/88",
      icon: "bg-slate-100 text-slate-700",
    },
    sky: {
      wrapper: "border-sky-100 bg-[linear-gradient(180deg,_rgba(240,249,255,0.92),_rgba(255,255,255,0.96))]",
      icon: "bg-sky-100 text-sky-700",
    },
    emerald: {
      wrapper: "border-emerald-100 bg-[linear-gradient(180deg,_rgba(236,253,245,0.92),_rgba(255,255,255,0.96))]",
      icon: "bg-emerald-100 text-emerald-700",
    },
    amber: {
      wrapper: "border-amber-100 bg-[linear-gradient(180deg,_rgba(255,251,235,0.94),_rgba(255,255,255,0.97))]",
      icon: "bg-amber-100 text-amber-700",
    },
    rose: {
      wrapper: "border-rose-100 bg-[linear-gradient(180deg,_rgba(255,241,242,0.94),_rgba(255,255,255,0.97))]",
      icon: "bg-rose-100 text-rose-700",
    },
    violet: {
      wrapper: "border-violet-100 bg-[linear-gradient(180deg,_rgba(245,243,255,0.94),_rgba(255,255,255,0.97))]",
      icon: "bg-violet-100 text-violet-700",
    },
  }[tone];

  return (
    <div className={`rounded-[1.35rem] border px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.04)] ${toneClasses.wrapper}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-[1rem] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${toneClasses.icon}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function SuratForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");
  const [mode, setMode] = useState<"login" | "register">(
    initialMode === "register" ? "register" : "login",
  );
  const isHydrated = useSyncExternalStore(subscribeToClientReady, () => true, () => false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [suratForm, setSuratForm] = useState(initialSuratState);
  const [keperluanChoice, setKeperluanChoice] = useState("");
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const redirectTarget = sanitizeRedirectPath(searchParams.get("redirect"));

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

        if (user.role === "warga" && user.approval_status === "disetujui" && redirectTarget) {
          router.replace(redirectTarget);
        }
      })
      .catch(() => {
        clearAuthSession("warga");
        setCurrentUser(null);
      });
  }, [redirectTarget, router]);

  const isApprovedWarga =
    currentUser?.role === "warga" && currentUser?.approval_status === "disetujui";

  if (!isHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="card-panel rounded-[2rem] border border-sky-100 bg-[linear-gradient(145deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.98))] p-6 md:p-7 shadow-[0_28px_70px_rgba(59,130,246,0.08)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              Akses Warga
            </p>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
            Menyiapkan layanan surat masyarakat
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Sistem sedang memuat sesi warga dan formulir layanan surat.
          </p>
        </div>
        <div className="card-panel rounded-[2rem] border border-slate-100 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.96))] p-6 md:p-7">
          <div className="h-10 rounded-2xl bg-slate-100" />
          <div className="mt-4 h-10 rounded-2xl bg-slate-100" />
          <div className="mt-4 h-32 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  function resetMessages() {
    setMessage("");
    setError("");
  }

  async function handleLogout() {
    try {
      await logoutAuth();
    } catch {
      // local session still needs to be removed if API logout fails
    }

    clearAuthSession("warga");
    setCurrentUser(null);
    setApiToken(null);
    setLoginForm(initialLoginState);
    setSuratForm(initialSuratState);
    setKeperluanChoice("");
    setFile(null);
    setMessage("Sesi masyarakat berhasil diakhiri.");
    setError("");
  }

  if (isApprovedWarga && currentUser) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="card-panel rounded-[2rem] border border-emerald-100 bg-[linear-gradient(145deg,_rgba(236,253,245,0.96),_rgba(255,255,255,0.98))] p-6 md:p-7 shadow-[0_28px_70px_rgba(16,185,129,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,_#d1fae5,_#ecfdf5)] p-3 text-emerald-700 shadow-[0_14px_26px_rgba(16,185,129,0.14)]">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Akses Masyarakat
                </p>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
                Akun warga sudah aktif
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Data identitas ini dipakai otomatis saat Anda membuat pengajuan surat resmi kampung.
              </p>
            </div>
            <ApprovalBadge status={currentUser.approval_status} />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoItem icon={<UserCircle2 className="h-4 w-4" />} label="Nama Lengkap" value={currentUser.name} tone="emerald" />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Keluarga"
              value={currentUser.keluarga?.nama_kepala_keluarga ?? "-"}
              tone="sky"
            />
            <InfoItem icon={<ClipboardList className="h-4 w-4" />} label="NIK" value={currentUser.nik ?? "-"} tone="amber" />
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="WhatsApp"
              value={currentUser.whatsapp ?? currentUser.phone ?? "-"}
              tone="emerald"
            />
            <InfoItem icon={<MapPinned className="h-4 w-4" />} label="Lindongan" value={currentUser.lindongan ?? "-"} tone="violet" />
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={currentUser.email} tone="sky" />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(236,253,245,0.72))] px-5 py-4 text-sm leading-7 text-slate-600">
            Data pemohon diambil dari akun warga yang sudah disetujui admin. Setelah pengajuan dikirim,
            permohonan akan muncul di dashboard admin layanan surat untuk ditinjau.
          </div>

          <button
            onClick={() => void handleLogout()}
            className="mt-6 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Keluar dari akun warga
          </button>
        </div>

        <form
          className="card-panel grid gap-5 rounded-[2rem] border border-sky-100 bg-[linear-gradient(145deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.92))] p-6 shadow-[0_28px_72px_rgba(14,116,144,0.08)] md:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              resetMessages();

              try {
                const payload = new FormData();
                payload.append("jenis_surat", suratForm.jenis_surat);
                payload.append("keperluan", suratForm.keperluan);

                if (file) {
                  payload.append("lampiran", file);
                }

                const result = await createPengajuanSurat(payload);
                setMessage(
                  `Pengajuan surat berhasil dikirim. Nomor antrean pengajuan: ${result.id}.`,
                );
                setSuratForm(initialSuratState);
                setKeperluanChoice("");
                setFile(null);
              } catch (submissionError) {
                setError(
                  submissionError instanceof Error
                    ? submissionError.message
                    : "Pengajuan surat gagal dikirim.",
                );
              }
            });
          }}
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-3 text-sky-700 shadow-[0_14px_26px_rgba(59,130,246,0.14)]">
                <FileBadge2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Pengajuan Surat
              </p>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
              Pilih jenis surat yang akan dibuat
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sistem akan otomatis memakai identitas masyarakat yang sudah diverifikasi admin.
            </p>
          </div>

          <select
            value={suratForm.jenis_surat ?? ""}
            onChange={(event) =>
              setSuratForm((prev) => ({ ...prev, jenis_surat: event.target.value }))
            }
            className="rounded-[1.3rem] border border-sky-100 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            required
          >
            <option value="">Pilih jenis surat</option>
            {suratOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select
            value={keperluanChoice}
            onChange={(event) => {
              const nextValue = event.target.value;
              setKeperluanChoice(nextValue);

              if (nextValue === OTHER_KEPERLUAN) {
                setSuratForm((prev) => ({ ...prev, keperluan: "" }));
                return;
              }

              setSuratForm((prev) => ({ ...prev, keperluan: nextValue }));
            }}
            className="rounded-[1.3rem] border border-sky-100 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            required
          >
            <option value="">Pilih keperluan surat</option>
            {keperluanSuggestions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value={OTHER_KEPERLUAN}>Lainnya</option>
          </select>

          {keperluanChoice === OTHER_KEPERLUAN ? (
            <input
              value={suratForm.keperluan ?? ""}
              onChange={(event) =>
                setSuratForm((prev) => ({ ...prev, keperluan: event.target.value }))
              }
              className="rounded-[1.3rem] border border-sky-100 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
              placeholder="Tulis keperluan surat secara manual"
              required
            />
          ) : null}

          <div className="rounded-[1.5rem] border border-dashed border-sky-200 bg-[linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(239,246,255,0.86))] px-5 py-5 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] bg-white p-2.5 text-sky-700 shadow-[0_10px_22px_rgba(59,130,246,0.12)]">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Ringkasan data surat</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  Sistem akan memakai identitas warga yang tersimpan
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <InfoItem icon={<UserCircle2 className="h-4 w-4" />} label="Pemohon" value={currentUser.name} tone="sky" />
              <InfoItem
                icon={<Users className="h-4 w-4" />}
                label="Keluarga"
                value={currentUser.keluarga?.nama_kepala_keluarga ?? "-"}
                tone="emerald"
              />
              <InfoItem
                icon={<MapPinned className="h-4 w-4" />}
                label="Alamat"
                value={currentUser.alamat ?? currentUser.keluarga?.alamat ?? "-"}
                tone="violet"
              />
              <InfoItem
                icon={<FileText className="h-4 w-4" />}
                label="Keperluan"
                value={suratForm.keperluan || "-"}
                tone="amber"
              />
            </div>
          </div>

          <label className="rounded-[1.5rem] border border-amber-100 bg-[linear-gradient(180deg,_rgba(255,251,235,0.76),_rgba(255,255,255,0.98))] px-4 py-4 text-sm text-slate-600 shadow-[0_18px_40px_rgba(217,119,6,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] bg-[linear-gradient(135deg,_#fef3c7,_#fffbeb)] p-2.5 text-amber-700 shadow-[0_10px_22px_rgba(217,119,6,0.14)]">
                <Paperclip className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Lampiran pendukung</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Opsional jika dibutuhkan
                </p>
              </div>
            </div>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-4 block w-full rounded-[1.1rem] border border-amber-100 bg-white px-4 py-3"
            />
          </label>

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}

          <button className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800">
            {isPending ? "Mengirim..." : "Kirim Pengajuan Surat"}
          </button>
        </form>
      </div>
    );
  }

  return (
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
      <div className="card-panel rounded-[2rem] border border-sky-100 bg-[linear-gradient(145deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.98))] p-6 shadow-[0_28px_70px_rgba(59,130,246,0.08)] md:p-7">
        <div className="flex items-center gap-3">
          <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-3 text-sky-700 shadow-[0_14px_26px_rgba(59,130,246,0.14)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Akses Warga
          </p>
        </div>
        <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
          Login masyarakat atau daftar terlebih dahulu
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Fitur layanan surat hanya bisa dipakai masyarakat yang terdata pada keluarga kampung dan
          sudah disetujui admin.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              resetMessages();
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-sky-700 text-white" : "text-slate-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              resetMessages();
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-emerald-700 text-white" : "text-slate-600"
            }`}
          >
            Registrasi
          </button>
        </div>

        <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
          <InfoItem
            icon={<ClipboardList className="h-4 w-4" />}
            label="Persyaratan"
            value="Registrasi memakai NIK, nama keluarga, lindongan, email, dan nomor WhatsApp yang valid."
            tone="sky"
          />
          <InfoItem
            icon={<Users className="h-4 w-4" />}
            label="Pencocokan Data"
            value="Nama keluarga dan lindongan dicocokkan dengan database keluarga kampung."
            tone="emerald"
          />
          <InfoItem
            icon={<BadgeCheck className="h-4 w-4" />}
            label="Aktivasi Akun"
            value="Setelah disetujui admin, warga baru bisa login dan mengajukan surat."
            tone="amber"
          />
        </div>
      </div>

      {mode === "login" ? (
        <form
          className="card-panel grid gap-5 rounded-[2rem] border border-sky-100 bg-[linear-gradient(145deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.92))] p-6 shadow-[0_28px_72px_rgba(14,116,144,0.08)] md:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              resetMessages();

              try {
                const result = await loginWarga(loginForm.email, loginForm.password);
                saveAuthSession(result.token, result.user, "warga");
                setApiToken(result.token);
                setCurrentUser(result.user);
                setMessage("Login warga berhasil. Anda sekarang bisa mengajukan surat.");
                setLoginForm(initialLoginState);

                if (
                  result.user.role === "warga" &&
                  result.user.approval_status === "disetujui" &&
                  redirectTarget
                ) {
                  router.push(redirectTarget);
                }
              } catch (loginError) {
                setError(
                  loginError instanceof Error
                    ? loginError.message
                    : "Login warga gagal. Periksa kembali email dan password Anda.",
                );
              }
            });
          }}
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff)] p-3 text-sky-700 shadow-[0_14px_26px_rgba(59,130,246,0.14)]">
                <LogIn className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Login Masyarakat
              </p>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
              Masuk dengan akun yang sudah disetujui admin
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Gunakan email dan password yang didaftarkan sebelumnya untuk mengakses layanan surat.
            </p>
          </div>

          <input
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="rounded-[1.3rem] border border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] px-4 py-3"
            placeholder="Email warga"
            type="email"
            required
          />
          <input
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, password: event.target.value }))
            }
            type="password"
            className="rounded-[1.3rem] border border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] px-4 py-3"
            placeholder="Password"
            required
          />

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}

          <button className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800">
            {isPending ? "Memproses..." : "Login Masyarakat"}
          </button>
        </form>
      ) : (
        <form
          className="card-panel grid gap-4 rounded-[2rem] border border-emerald-100 bg-[linear-gradient(145deg,_rgba(255,255,255,0.98),_rgba(236,253,245,0.92))] p-6 shadow-[0_28px_72px_rgba(16,185,129,0.08)] md:grid-cols-2 md:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              resetMessages();

              try {
                const result = await registerWarga(registerForm);
                setMessage(result.message);
                setRegisterForm(initialRegisterState);
                setMode("login");
              } catch (registerError) {
                setError(
                  registerError instanceof Error
                    ? registerError.message
                    : "Registrasi warga gagal dikirim.",
                );
              }
            });
          }}
        >
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,_#d1fae5,_#ecfdf5)] p-3 text-emerald-700 shadow-[0_14px_26px_rgba(16,185,129,0.14)]">
                <UserPlus className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Registrasi Masyarakat
              </p>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-slate-950">
              Daftarkan akun warga untuk layanan surat
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Isi data sesuai identitas warga dan keluarga yang sudah tercatat di database kampung.
            </p>
          </div>

          <input
            value={registerForm.nik}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, nik: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="NIK"
            required
          />
          <input
            value={registerForm.nama_keluarga}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, nama_keluarga: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Nama kepala keluarga"
            required
          />
          <input
            value={registerForm.name}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Nama lengkap"
            required
          />
          <select
            value={registerForm.lindongan}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, lindongan: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
          >
            <option>Lindongan 1</option>
            <option>Lindongan 2</option>
            <option>Lindongan 3</option>
          </select>
          <input
            value={registerForm.whatsapp}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, whatsapp: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Nomor WhatsApp"
            required
          />
          <input
            value={registerForm.phone}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Nomor telepon cadangan"
            required
          />
          <input
            value={registerForm.email}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3 md:col-span-2"
            placeholder="Email"
            type="email"
            required
          />
          <input
            value={registerForm.password}
            onChange={(event) =>
              setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
            }
            type="password"
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Password"
            required
          />
          <input
            value={registerForm.password_confirmation}
            onChange={(event) =>
              setRegisterForm((prev) => ({
                ...prev,
                password_confirmation: event.target.value,
              }))
            }
            type="password"
            className="rounded-[1.3rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f3fbf7)] px-4 py-3"
            placeholder="Ulangi password"
            required
          />

          {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}

          <button className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 md:col-span-2">
            {isPending ? "Mengirim..." : "Kirim Registrasi Warga"}
          </button>
        </form>
      )}
    </div>
  );
}
