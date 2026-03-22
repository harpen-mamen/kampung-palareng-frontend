import type { Bantuan, Berita, DashboardStats, HeroSetting, Keluarga, Pengumuman, PublicStats, RumahMarker, WisataItem } from "@/types/portal";

export const mockStats: PublicStats = {
  jumlah_keluarga: 148,
  jumlah_penduduk: 612,
  jumlah_rumah: 139,
  jumlah_penerima_bantuan: 57,
  jumlah_dtks: 64,
  jumlah_nelayan: 45,
  per_lindongan: [
    { lindongan: "Lindongan 1", total_keluarga: 36, total_penduduk: 151 },
    { lindongan: "Lindongan 2", total_keluarga: 41, total_penduduk: 172 },
    { lindongan: "Lindongan 3", total_keluarga: 34, total_penduduk: 148 },
    { lindongan: "Lindongan 4", total_keluarga: 37, total_penduduk: 141 },
  ],
  komposisi_pekerjaan: [
    { label: "Nelayan", total: 45 },
    { label: "Petani", total: 38 },
    { label: "Pedagang", total: 24 },
    { label: "Pekerja Harian", total: 20 },
  ],
  komposisi_status_ekonomi: [
    { label: "Menengah", total: 52 },
    { label: "Rentan", total: 47 },
    { label: "Pra-Sejahtera", total: 31 },
    { label: "Sejahtera", total: 18 },
  ],
  komposisi_kategori_rumah: [
    { label: "Permanen", total: 62 },
    { label: "Semi Permanen", total: 49 },
    { label: "Sederhana", total: 28 },
  ],
  penerima_bantuan_per_jenis: [
    { label: "BLT", total: 21 },
    { label: "PKH", total: 16 },
    { label: "BPNT", total: 12 },
    { label: "Bantuan Nelayan", total: 8 },
  ],
  komposisi_dtks: [
    { label: "DTKS", total: 64 },
    { label: "Non-DTKS", total: 84 },
  ],
};

export const mockDashboard: DashboardStats = {
  jumlah_keluarga: 148,
  jumlah_rumah: 139,
  jumlah_pengajuan_surat: 12,
  jumlah_pengajuan_bantuan: 9,
  jumlah_penerima_bantuan: 57,
  statistik_per_lindongan: [
    { lindongan: "Lindongan 1", total: 36 },
    { lindongan: "Lindongan 2", total: 41 },
    { lindongan: "Lindongan 3", total: 34 },
    { lindongan: "Lindongan 4", total: 37 },
  ],
};

export const mockBerita: Berita[] = [
  {
    id: 1,
    judul: "Gotong Royong Pembersihan Lingkungan Kampung Palareng",
    slug: "gotong-royong-pembersihan-lingkungan-kampung-palareng",
    kategori: "Kegiatan Kampung",
    ringkasan: "Warga bersama pemerintah kampung melakukan kerja bakti pembersihan lingkungan.",
    isi: "Kegiatan gotong royong dilaksanakan pada akhir pekan untuk menjaga kebersihan jalur utama, saluran air, dan area publik di Kampung Palareng.",
    status_publish: "publish",
    created_at: "2026-03-10T08:00:00.000000Z",
  },
  {
    id: 2,
    judul: "Pendataan Rumah Warga untuk Pembaruan Peta Digital",
    slug: "pendataan-rumah-warga-untuk-pembaruan-peta-digital",
    kategori: "Pengumuman",
    ringkasan: "Operator kampung melakukan pembaruan data rumah dan titik koordinat.",
    isi: "Pemerintah kampung menginformasikan bahwa pembaruan data spasial dan rumah warga akan dilakukan secara bertahap pada seluruh lindongan.",
    status_publish: "publish",
    created_at: "2026-03-12T08:00:00.000000Z",
  },
];

export const mockPengumuman: Pengumuman[] = [
  {
    id: 1,
    judul: "Jadwal Pelayanan Surat Mingguan",
    isi: "Pelayanan surat dibuka setiap Senin sampai Kamis pukul 08.00-14.00 WITA.",
    status_publish: "publish",
    created_at: "2026-03-15T08:00:00.000000Z",
  },
];

export const mockMarkers: RumahMarker[] = [
  { id: 1, nama_kepala_keluarga: "Yohanis Tamon", jumlah_penghuni: 5, lindongan: "Lindongan 1", latitude: 3.58241, longitude: 125.49411 },
  { id: 2, nama_kepala_keluarga: "Marta Pangemanan", jumlah_penghuni: 4, lindongan: "Lindongan 2", latitude: 3.58126, longitude: 125.49522 },
  { id: 3, nama_kepala_keluarga: "Adrianus Bawole", jumlah_penghuni: 6, lindongan: "Lindongan 3", latitude: 3.58018, longitude: 125.4938 },
  { id: 4, nama_kepala_keluarga: "Ria Maramis", jumlah_penghuni: 3, lindongan: "Lindongan 4", latitude: 3.57945, longitude: 125.49605 },
];

export const mockKeluarga: Keluarga[] = [
  {
    id: 1,
    kode_keluarga: "KPLR-001",
    nama_kepala_keluarga: "Yohanis Tamon",
    alamat: "Dusun pusat kampung dekat balai pertemuan",
    lindongan: "Lindongan 1",
    jumlah_anggota: 5,
    status_ekonomi: "Menengah",
    pekerjaan_utama: "Nelayan",
    kategori_rumah: "Permanen",
    status_dtks: true,
    catatan_petugas: "Keluarga aktif dalam kegiatan kampung.",
  },
];

export const mockHeroSetting: HeroSetting = {
  id: 1,
  hero_badge: "Kabupaten Kepulauan Sangihe",
  hero_title: "Website Resmi Kampung Palareng",
  hero_description:
    "Portal resmi Kampung Palareng menghadirkan layanan surat, pengajuan bantuan, informasi kampung, dan peta digital yang tertata rapi untuk masyarakat maupun admin kampung.",
  hero_primary_label: "Ajukan Surat",
  hero_primary_url: "/surat",
  hero_secondary_label: "Lihat Peta Digital",
  hero_secondary_url: "/peta",
  hero_panel_title: "Selayang Pandang",
  hero_panel_description:
    "Website kampung ini disiapkan sebagai sarana informasi dan layanan publik berbasis digital, agar data kampung lebih mudah diakses, dipahami, dan dimanfaatkan dalam pembangunan.",
  official_name: "Kapitalaung Kampung Palareng",
  official_position: "Pemerintah Kampung Palareng",
  official_message:
    "Dengan semangat pelayanan dan keterbukaan informasi, portal ini diharapkan menjadi wajah digital kampung yang rapi, informatif, dan bermanfaat bagi seluruh warga.",
  hero_image: null,
  hero_images: [],
  hero_sections: [
    {
      badge: "Kabupaten Kepulauan Sangihe",
      title: "Website Resmi Kampung Palareng",
      description:
        "Portal kampung untuk layanan surat, informasi warga, peta digital, dan data publik yang tertata rapi.",
      primary_label: "Ajukan Surat",
      primary_url: "/surat",
      secondary_label: "Lihat Peta Digital",
      secondary_url: "/peta",
      image: null,
      image_path: null,
    },
  ],
  official_photo: null,
  profile_title: "Profil Kampung Palareng",
  profile_description:
    "Ringkasan sejarah, visi misi, pemerintahan, dan potensi Kampung Palareng.",
  profile_history:
    "Kampung Palareng berkembang sebagai kawasan masyarakat pesisir dan kebun yang kuat dalam budaya gotong royong.",
  profile_vision_mission:
    "Mewujudkan kampung yang tertib data, responsif layanan, dan kuat dalam pembangunan sosial.",
  profile_potential:
    "Perikanan, pertanian, kebun kelapa, dan partisipasi sosial warga menjadi kekuatan utama kampung.",
  profile_image: null,
  government_structure: [
    {
      position: "Kapitalaung",
      name: "Kapitalaung Kampung Palareng",
      photo: null,
      photo_path: null,
    },
    {
      position: "Sekretaris Kampung",
      name: "Sekretaris Kampung Palareng",
      photo: null,
      photo_path: null,
    },
  ],
};

export const mockWisata: WisataItem[] = [
  {
    id: 1,
    nama: "Pantai Lindongan 1",
    lokasi: "Lindongan 1",
    deskripsi: "Area pantai dengan hamparan pasir, cocok untuk singgah sore dan menikmati suasana kampung pesisir.",
    image: null,
  },
  {
    id: 2,
    nama: "Pantai Batu Karang",
    lokasi: "Lindongan 2",
    deskripsi: "Spot tepi laut dengan batu karang alami dan pemandangan terbuka ke arah perairan sekitar kampung.",
    image: null,
  },
  {
    id: 3,
    nama: "Pantai Ujung Kampung",
    lokasi: "Lindongan 3",
    deskripsi: "Titik wisata sederhana untuk melihat aktivitas warga, perahu nelayan, dan panorama senja.",
    image: null,
  },
];

export const mockBantuan: Bantuan[] = [
  {
    id: 1,
    nama_bantuan: "BLT Dana Desa",
    kategori: "Bantuan Tunai",
    sumber: "Dana Desa",
    periode: "Tahap I 2026",
    status: "aktif",
    is_open_for_submission: true,
    kuota: 25,
    total_pengajuan: 11,
    remaining_quota: 14,
    deskripsi: "Bantuan tunai untuk keluarga rentan dan keluarga prioritas yang memenuhi verifikasi kampung.",
  },
  {
    id: 2,
    nama_bantuan: "Bantuan Pangan",
    kategori: "Pangan",
    sumber: "Kabupaten",
    periode: "Semester I 2026",
    status: "aktif",
    is_open_for_submission: true,
    kuota: 40,
    total_pengajuan: 18,
    remaining_quota: 22,
    deskripsi: "Paket bahan pangan bagi keluarga sasaran sesuai hasil verifikasi data kampung.",
  },
];
