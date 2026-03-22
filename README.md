# Frontend Next.js - Portal Kampung Palareng

Frontend publik dan dashboard admin dibangun dengan Next.js App Router, TypeScript, dan Tailwind CSS.

## Menjalankan frontend

1. Salin `.env.example` menjadi `.env.local`.
2. Pastikan `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api`.
3. Jalankan:

```bash
npm install
npm run dev
```

4. Akses `http://127.0.0.1:3000`.

## Halaman

- Publik: `/`, `/profil`, `/berita`, `/berita/[slug]`, `/statistik`, `/surat`, `/surat/status`, `/bantuan`, `/bantuan/status`, `/peta`, `/kontak`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/keluarga`, `/admin/rumah`, `/admin/bantuan`, `/admin/peta`, `/admin/surat`, `/admin/pengajuan-bantuan`, `/admin/berita`, `/admin/pengumuman`, `/admin/statistik`, `/admin/laporan`, `/admin/pengguna`
