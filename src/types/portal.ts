export type Role = "super_admin" | "operator" | "verifikator" | "pimpinan" | "warga";
export type WargaApprovalStatus = "menunggu_persetujuan" | "disetujui" | "ditolak";

export type Keluarga = {
  id: number;
  kode_keluarga: string;
  nama_kepala_keluarga: string;
  alamat: string;
  lindongan: string;
  jumlah_anggota: number;
  status_ekonomi: string;
  pekerjaan_utama: string;
  kategori_rumah: string;
  status_dtks: boolean;
  catatan_petugas?: string | null;
};

export type Rumah = {
  id: number;
  keluarga_id: number;
  alamat_singkat: string;
  lindongan: string;
  latitude: number;
  longitude: number;
  foto_rumah?: string | null;
  kategori_rumah: string;
  jumlah_penghuni: number;
  catatan_petugas?: string | null;
  keluarga?: Keluarga;
};

export type RumahMarker = {
  id: number;
  latitude: number;
  longitude: number;
  lindongan: string;
  jumlah_penghuni: number;
  nama_kepala_keluarga?: string;
  alamat_singkat?: string;
  kategori_rumah?: string;
  foto_rumah?: string | null;
  catatan_petugas?: string | null;
  keluarga?: Keluarga & {
    bantuan?: { status_penerima: string; nama_bantuan: string | null }[];
  };
};

export type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  gambar?: string | null;
  status_publish: "draft" | "publish";
  created_at: string;
};

export type Pengumuman = {
  id: number;
  judul: string;
  isi: string;
  status_publish: "draft" | "publish";
  created_at: string;
};

export type PublicStats = {
  jumlah_keluarga: number;
  jumlah_penduduk: number;
  jumlah_rumah: number;
  jumlah_penerima_bantuan: number;
  jumlah_dtks: number;
  jumlah_nelayan: number;
  per_lindongan: { lindongan: string; total_keluarga: number; total_penduduk: number }[];
  komposisi_pekerjaan: { label: string; total: number }[];
  komposisi_status_ekonomi: { label: string; total: number }[];
  komposisi_kategori_rumah: { label: string; total: number }[];
  penerima_bantuan_per_jenis: { label: string; total: number }[];
  komposisi_dtks: { label: string; total: number }[];
};

export type MapFilters = {
  lindongan: string[];
  pekerjaan_utama: string[];
  status_ekonomi: string[];
  bantuan: { id: number; nama_bantuan: string }[];
};

export type PublicMapResponse = {
  markers: RumahMarker[];
  filters: MapFilters;
};

export type DashboardStats = {
  jumlah_keluarga: number;
  jumlah_rumah: number;
  jumlah_pengajuan_surat: number;
  jumlah_pengajuan_bantuan: number;
  jumlah_penerima_bantuan: number;
  statistik_per_lindongan: { lindongan: string; total: number }[];
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  nik?: string | null;
  whatsapp?: string | null;
  alamat?: string | null;
  lindongan?: string | null;
  role: Role;
  keluarga_id?: number | null;
  approval_status?: WargaApprovalStatus;
  approval_notes?: string | null;
  approved_at?: string | null;
  keluarga?: Keluarga | null;
  created_at?: string;
};

export type WargaRegistrationPayload = {
  nik: string;
  nama_keluarga: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  lindongan: string;
  password: string;
  password_confirmation: string;
};

export type WargaApprovalRow = AuthUser & {
  created_at?: string;
};

export type HeroSetting = {
  id: number;
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  hero_primary_label: string;
  hero_primary_url: string;
  hero_secondary_label: string;
  hero_secondary_url: string;
  hero_panel_title: string;
  hero_panel_description?: string | null;
  official_name: string;
  official_position: string;
  official_message?: string | null;
  hero_image?: string | null;
  hero_images?: string[];
  hero_sections?: {
    badge: string;
    title: string;
    description: string;
    primary_label: string;
    primary_url: string;
    secondary_label: string;
    secondary_url: string;
    image?: string | null;
    image_path?: string | null;
  }[];
  official_photo?: string | null;
  profile_title: string;
  profile_description?: string | null;
  profile_history?: string | null;
  profile_vision_mission?: string | null;
  profile_potential?: string | null;
  profile_image?: string | null;
  government_structure?: {
    position: string;
    name: string;
    photo?: string | null;
    photo_path?: string | null;
  }[];
};

export type SuratSettings = {
  surat_templates: Record<string, string>;
  surat_numbering: Record<string, string>;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PengajuanSurat = {
  id: number;
  nama_pemohon: string;
  jenis_surat: string;
  keperluan?: string | null;
  alamat: string;
  lindongan: string;
  whatsapp_pemohon?: string | null;
  lampiran?: string | null;
  status: string;
  catatan_admin?: string | null;
  nomor_urut_surat?: number | null;
  nomor_surat?: string | null;
  tanggal_surat?: string | null;
  disetujui_at?: string | null;
  nama_penandatangan?: string | null;
  jabatan_penandatangan?: string | null;
  isi_surat?: string | null;
  file_surat?: string | null;
  file_surat_url?: string | null;
  arsip_surat_at?: string | null;
  created_at?: string;
};

export type PengajuanBantuan = {
  id: number;
  user_id?: number | null;
  nama_pemohon: string;
  alamat: string;
  lindongan: string;
  whatsapp_pemohon?: string | null;
  bantuan_id?: number | null;
  jenis_bantuan: string;
  keterangan?: string | null;
  lampiran?: string | null;
  status_pengajuan: string;
  catatan_admin?: string | null;
  keluarga_id?: number | null;
  user?: AuthUser | null;
  bantuan?: Bantuan | null;
  created_at?: string;
};

export type Bantuan = {
  id: number;
  nama_bantuan: string;
  kategori: string;
  sumber: string;
  periode: string;
  status: string;
  is_open_for_submission: boolean;
  kuota?: number | null;
  total_pengajuan?: number;
  remaining_quota?: number | null;
  deskripsi?: string | null;
  created_at?: string;
};

export type WisataItem = {
  id: number;
  nama: string;
  lokasi: string;
  deskripsi: string;
  image?: string | null;
  status_publish?: "draft" | "publish";
  created_at?: string;
};
