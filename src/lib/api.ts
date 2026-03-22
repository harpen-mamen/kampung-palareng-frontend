import { mockBantuan, mockBerita, mockDashboard, mockHeroSetting, mockKeluarga, mockMarkers, mockPengumuman, mockStats, mockWisata } from "@/lib/mock-data";
import type {
  AuthUser,
  Bantuan,
  Berita,
  DashboardStats,
  HeroSetting,
  Keluarga,
  PaginatedResponse,
  PengajuanBantuan,
  PengajuanSurat,
  Pengumuman,
  PublicStats,
  PublicMapResponse,
  Rumah,
  RumahMarker,
  SuratSettings,
  WargaApprovalRow,
  WargaRegistrationPayload,
  WisataItem,
} from "@/types/portal";

const INTERNAL_API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000/api";

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "/api/proxy";
  }

  return INTERNAL_API_BASE_URL;
}

let authToken: string | null = null;
const TOKEN_KEY = "portal-kampung-token";

async function buildRequestError(response: Response, path: string) {
  const fallback = `Request gagal (${response.status}) untuk ${path}`;
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return new Error(text || fallback);
  }

  const payload = (await response.json()) as {
    message?: string;
    errors?: Record<string, string[]>;
  };

  const validationMessages = payload.errors
    ? Object.values(payload.errors).flat().join(" ")
    : "";

  return new Error(validationMessages || payload.message || fallback);
}

export function setApiToken(token?: string | null) {
  authToken = token ?? null;
}

function withQuery(path: string, params?: Record<string, string | number | undefined | null>) {
  if (!params) return path;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await requestJson<T>(path);
  } catch {
    return fallback;
  }
}

async function requestJson<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: BodyInit | null;
    auth?: boolean;
    contentType?: string;
  },
) {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (options?.contentType) {
    headers.set("Content-Type", options.contentType);
  }

  if (options?.auth) {
    const token =
      authToken ??
      (typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options?.method ?? "GET",
    body: options?.body ?? null,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw await buildRequestError(response, path);
  }

  return (await response.json()) as T;
}

async function requestFile(
  path: string,
  options?: {
    method?: "GET" | "POST";
    auth?: boolean;
  },
) {
  const headers = new Headers();

  if (options?.auth) {
    const token =
      authToken ??
      (typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options?.method ?? "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw await buildRequestError(response, path);
  }

  return {
    blob: await response.blob(),
    filename: response.headers.get("content-disposition"),
  };
}

export async function getPublicStats() {
  return safeGet<PublicStats>("/public/statistik", mockStats);
}

export async function getPublicHero() {
  return safeGet<HeroSetting>("/public/hero", mockHeroSetting);
}

export async function getPublicNews(params?: { kategori?: string; per_page?: number }) {
  const fallback: PaginatedResponse<Berita> = {
    data: mockBerita,
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: mockBerita.length,
  };
  return safeGet(withQuery("/public/berita", params), fallback);
}

export async function getNewsDetail(slug: string) {
  const fallback = mockBerita.find((item) => item.slug === slug) ?? mockBerita[0];
  return safeGet<Berita>(`/public/berita/${slug}`, fallback);
}

export async function getAnnouncements() {
  return safeGet<Pengumuman[]>("/public/pengumuman", mockPengumuman);
}

export async function getPublicWisata() {
  return safeGet<WisataItem[]>("/public/wisata", mockWisata);
}

export async function getPublicAvailableBantuan() {
  return safeGet<Bantuan[]>("/public/bantuan", mockBantuan);
}

export async function getPublicMap(params?: {
  search?: string;
  lindongan?: string;
  status_ekonomi?: string;
  pekerjaan_utama?: string;
  penerima_bantuan?: string;
  bantuan_id?: number;
  status_dtks?: string;
}) {
  return safeGet<PublicMapResponse>(
    withQuery("/public/peta", params),
    {
      markers: mockMarkers,
      filters: {
        lindongan: ["Lindongan 1", "Lindongan 2", "Lindongan 3", "Lindongan 4"],
        pekerjaan_utama: ["Nelayan", "Petani", "Pedagang", "Pekerja Harian"],
        status_ekonomi: ["Pra-Sejahtera", "Rentan", "Menengah", "Sejahtera"],
        bantuan: [
          { id: 1, nama_bantuan: "BLT" },
          { id: 2, nama_bantuan: "PKH" },
          { id: 3, nama_bantuan: "BPNT" },
        ],
      },
    },
  );
}

export async function loginAdmin(email: string, password: string) {
  return requestJson<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWarga(email: string, password: string) {
  return requestJson<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerWarga(payload: WargaRegistrationPayload) {
  return requestJson<{ message: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function getAuthMe() {
  return requestJson<AuthUser>("/auth/me", {
    auth: true,
  });
}

export async function logoutAuth() {
  return requestJson<{ message: string }>("/auth/logout", {
    method: "POST",
    auth: true,
  });
}

export async function getAdminDashboard() {
  return safeGet<DashboardStats>("/admin/dashboard", mockDashboard);
}

export async function getAdminHeroSetting() {
  try {
    return await requestJson<HeroSetting>("/admin/site-settings/hero", {
      auth: true,
    });
  } catch {
    return mockHeroSetting;
  }
}

export async function updateAdminHeroSetting(payload: FormData) {
  return requestJson<HeroSetting>("/admin/site-settings/hero", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function getAdminSuratSettings() {
  return requestJson<SuratSettings>("/admin/site-settings/surat", {
    auth: true,
  });
}

export async function updateAdminSuratSettings(payload: SuratSettings) {
  return requestJson<{ message: string } & SuratSettings>("/admin/site-settings/surat", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function getAdminBantuan(params?: {
  status?: string;
  kategori?: string;
  per_page?: number;
}) {
  const fallback: PaginatedResponse<Bantuan> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  try {
    return await requestJson<PaginatedResponse<Bantuan>>(withQuery("/admin/bantuan", params), {
      auth: true,
    });
  } catch {
    return fallback;
  }
}

export async function createAdminBantuan(payload: Omit<Bantuan, "id">) {
  return requestJson<Bantuan>("/admin/bantuan", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminBantuan(id: number, payload: Omit<Bantuan, "id">) {
  return requestJson<Bantuan>(`/admin/bantuan/${id}`, {
    method: "PUT",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminBantuan(id: number) {
  await requestJson(`/admin/bantuan/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getAdminBerita(params?: { kategori?: string; per_page?: number }) {
  return requestJson<PaginatedResponse<Berita>>(withQuery("/admin/berita", params), {
    auth: true,
  });
}

export async function createAdminBerita(payload: FormData) {
  return requestJson<Berita>("/admin/berita", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateAdminBerita(id: number, payload: FormData) {
  return requestJson<Berita>(`/admin/berita/${id}/update`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function deleteAdminBerita(id: number) {
  await requestJson(`/admin/berita/${id}/delete`, {
    method: "POST",
    auth: true,
  });
}

export async function getAdminWisata(params?: { per_page?: number }) {
  const fallback: PaginatedResponse<WisataItem> = {
    data: mockWisata,
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: mockWisata.length,
  };

  try {
    return await requestJson<PaginatedResponse<WisataItem>>(withQuery("/admin/wisata", params), {
      auth: true,
    });
  } catch {
    return fallback;
  }
}

export async function createAdminWisata(payload: FormData) {
  return requestJson<WisataItem>("/admin/wisata", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateAdminWisata(id: number, payload: FormData) {
  return requestJson<WisataItem>(`/admin/wisata/${id}/update`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function deleteAdminWisata(id: number) {
  await requestJson(`/admin/wisata/${id}/delete`, {
    method: "POST",
    auth: true,
  });
}

export async function getAdminPengumuman(params?: { per_page?: number }) {
  const fallback: PaginatedResponse<Pengumuman> = {
    data: mockPengumuman,
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: mockPengumuman.length,
  };
  try {
    return await requestJson<PaginatedResponse<Pengumuman>>(
      withQuery("/admin/pengumuman", params),
      { auth: true },
    );
  } catch {
    return fallback;
  }
}

export async function createAdminPengumuman(payload: Omit<Pengumuman, "id" | "created_at">) {
  return requestJson<Pengumuman>("/admin/pengumuman", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminPengumuman(
  id: number,
  payload: Omit<Pengumuman, "id" | "created_at">,
) {
  return requestJson<Pengumuman>(`/admin/pengumuman/${id}`, {
    method: "PUT",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminPengumuman(id: number) {
  await requestJson(`/admin/pengumuman/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getAdminPengajuanSurat(params?: {
  status?: string;
  per_page?: number;
  search?: string;
  lindongan?: string;
  archived_only?: boolean;
}) {
  const fallback: PaginatedResponse<PengajuanSurat> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  try {
    return await requestJson<PaginatedResponse<PengajuanSurat>>(
      withQuery("/admin/pengajuan-surat", params),
      { auth: true },
    );
  } catch {
    return fallback;
  }
}

export async function getAdminPendingWarga(params?: { per_page?: number }) {
  const fallback: PaginatedResponse<WargaApprovalRow> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  try {
    return await requestJson<PaginatedResponse<WargaApprovalRow>>(
      withQuery("/admin/warga-pending", params),
      { auth: true },
    );
  } catch {
    return fallback;
  }
}

export async function getAdminPengguna(params?: {
  role?: string;
  lindongan?: string;
  search?: string;
  per_page?: number;
}) {
  const fallback: PaginatedResponse<AuthUser> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  };

  try {
    return await requestJson<PaginatedResponse<AuthUser>>(withQuery("/admin/pengguna", params), {
      auth: true,
    });
  } catch {
    return fallback;
  }
}

export async function createAdminPengguna(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
  nik?: string;
  phone?: string;
  whatsapp?: string;
  alamat?: string;
  lindongan?: string;
  keluarga_id?: number | null;
  approval_status?: string;
}) {
  return requestJson<AuthUser>("/admin/pengguna", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminPengguna(
  id: number,
  payload: {
    name: string;
    email: string;
    password?: string;
    role: string;
    nik?: string;
    phone?: string;
    whatsapp?: string;
    alamat?: string;
    lindongan?: string;
    keluarga_id?: number | null;
    approval_status?: string;
  },
) {
  return requestJson<AuthUser>(`/admin/pengguna/${id}`, {
    method: "PUT",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminPengguna(id: number) {
  await requestJson(`/admin/pengguna/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function updateAdminWargaApproval(
  id: number,
  payload: {
    approval_status: "menunggu_persetujuan" | "disetujui" | "ditolak";
    approval_notes?: string;
  },
) {
  return requestJson<{ message: string; user: WargaApprovalRow }>(
    `/admin/warga-pending/${id}/approval`,
    {
      method: "PATCH",
      auth: true,
      contentType: "application/json",
      body: JSON.stringify(payload),
    },
  );
}

export async function updateAdminPengajuanSuratStatus(
  id: number,
  payload: Pick<PengajuanSurat, "status" | "catatan_admin">,
) {
  return requestJson<PengajuanSurat>(`/admin/pengajuan-surat/${id}/status`, {
    method: "PATCH",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function createAdminManualPengajuanSurat(payload: {
  nama_pemohon: string;
  jenis_surat: string;
  keperluan: string;
  alamat: string;
  lindongan: string;
  whatsapp_pemohon?: string;
  catatan_admin?: string;
}) {
  return requestJson<PengajuanSurat>("/admin/pengajuan-surat/manual", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function downloadAdminPengajuanSuratDocument(id: number) {
  const response = await requestFile(`/admin/pengajuan-surat/${id}/document`, {
    auth: true,
  });

  const blobUrl = window.URL.createObjectURL(response.blob);
  const link = document.createElement("a");
  const matchedFilename = response.filename?.match(/filename="?([^"]+)"?$/i)?.[1];

  link.href = blobUrl;
  link.download = matchedFilename ?? `surat-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

export async function getAdminPengajuanBantuan(params?: {
  status_pengajuan?: string;
  per_page?: number;
  search?: string;
  lindongan?: string;
  archived_only?: boolean;
}) {
  const fallback: PaginatedResponse<PengajuanBantuan> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  try {
    return await requestJson<PaginatedResponse<PengajuanBantuan>>(
      withQuery("/admin/pengajuan-bantuan", params),
      { auth: true },
    );
  } catch {
    return fallback;
  }
}

export async function updateAdminPengajuanBantuanStatus(
  id: number,
  payload: Pick<PengajuanBantuan, "status_pengajuan" | "catatan_admin" | "keluarga_id">,
) {
  return requestJson<PengajuanBantuan>(`/admin/pengajuan-bantuan/${id}/status`, {
    method: "PATCH",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function getAdminKeluarga(params?: { search?: string; lindongan?: string; per_page?: number }) {
  const fallback: PaginatedResponse<Keluarga> = {
    data: mockKeluarga,
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: mockKeluarga.length,
  };
  try {
    return await requestJson<PaginatedResponse<Keluarga>>(withQuery("/admin/keluarga", params), {
      auth: true,
    });
  } catch {
    return fallback;
  }
}

export async function createPengajuanSurat(payload: FormData) {
  return requestJson<PengajuanSurat>("/public/pengajuan-surat", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function createPengajuanBantuan(payload: FormData) {
  return requestJson<PengajuanBantuan>("/public/pengajuan-bantuan", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function getPengajuanSuratStatus(id: string | number) {
  return requestJson<PengajuanSurat>(`/public/pengajuan-surat/${id}`);
}

export async function getPengajuanBantuanStatus(id: string | number) {
  return requestJson<PengajuanBantuan>(`/public/pengajuan-bantuan/${id}`);
}

export async function createAdminKeluarga(payload: Omit<Keluarga, "id">) {
  return requestJson<Keluarga>("/admin/keluarga", {
    method: "POST",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminKeluarga(id: number, payload: Omit<Keluarga, "id">) {
  return requestJson<Keluarga>(`/admin/keluarga/${id}`, {
    method: "PUT",
    auth: true,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminKeluarga(id: number) {
  await requestJson(`/admin/keluarga/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getAdminRumah(params?: { search?: string; lindongan?: string; per_page?: number }) {
  const fallback: PaginatedResponse<Rumah> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  try {
    return await requestJson<PaginatedResponse<Rumah>>(withQuery("/admin/rumah", params), {
      auth: true,
    });
  } catch {
    return fallback;
  }
}

export async function createAdminRumah(payload: FormData) {
  return requestJson<Rumah>("/admin/rumah", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateAdminRumah(id: number, payload: FormData) {
  payload.append("_method", "PUT");
  return requestJson<Rumah>(`/admin/rumah/${id}`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function deleteAdminRumah(id: number) {
  await requestJson(`/admin/rumah/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getAdminMap(params?: {
  search?: string;
  lindongan?: string;
  status_ekonomi?: string;
}) {
  try {
    return await requestJson<{ markers: RumahMarker[] }>(withQuery("/admin/peta", params), {
      auth: true,
    });
  } catch {
    return { markers: mockMarkers };
  }
}

export async function downloadAdminReport(params: {
  dataset: "keluarga" | "rumah" | "bantuan" | "surat" | "pengajuan_bantuan";
  format: "excel" | "pdf";
  lindongan?: string;
}) {
  const response = await requestFile(withQuery("/admin/laporan/export", params), {
    auth: true,
  });

  const blobUrl = window.URL.createObjectURL(response.blob);
  const link = document.createElement("a");
  const matchedFilename = response.filename?.match(/filename="?([^"]+)"?$/i)?.[1];
  const extension = params.format === "pdf" ? "pdf" : "xls";

  link.href = blobUrl;
  link.download = matchedFilename ?? `laporan-${params.dataset}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
