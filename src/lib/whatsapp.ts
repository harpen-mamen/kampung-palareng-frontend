import type { PengajuanBantuan, PengajuanSurat } from "@/types/portal";

function normalizeWhatsappNumber(value?: string | null) {
  if (!value) return null;

  const digits = value.replace(/\D/g, "");

  if (!digits) return null;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;

  return digits;
}

export function buildSuratWhatsappUrl(surat: PengajuanSurat) {
  const number = normalizeWhatsappNumber(surat.whatsapp_pemohon);

  if (!number) return null;

  const message = resolveSuratWhatsappMessage(surat);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildBantuanWhatsappUrl(pengajuan: PengajuanBantuan) {
  const number = normalizeWhatsappNumber(pengajuan.whatsapp_pemohon);

  if (!number) return null;

  const message = resolveBantuanWhatsappMessage(pengajuan);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function resolveSuratWhatsappMessage(surat: PengajuanSurat) {
  const baseLines = [`Halo ${surat.nama_pemohon},`, ""];
  const pdfLine = surat.file_surat_url ? `Unduh surat PDF: ${surat.file_surat_url}` : "";

  if (surat.status === "diajukan") {
    return [
      ...baseLines,
      `Pengajuan ${surat.jenis_surat} Anda sudah berhasil diajukan ke Pemerintah Kampung Palareng.`,
      surat.keperluan ? `Keperluan surat: ${surat.keperluan}.` : "",
      "Mohon tunggu admin melakukan verifikasi data Anda.",
      "Kami akan memberi informasi lanjutan setelah pengajuan diperiksa.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (surat.status === "diperiksa") {
    return [
      ...baseLines,
      `Pengajuan ${surat.jenis_surat} Anda sedang dalam proses pemeriksaan oleh admin kampung.`,
      surat.keperluan ? `Keperluan surat: ${surat.keperluan}.` : "",
      "Mohon menunggu hasil verifikasi berikutnya.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (surat.status === "perlu_perbaikan") {
    return [
      ...baseLines,
      `Pengajuan ${surat.jenis_surat} Anda memerlukan perbaikan atau kelengkapan tambahan.`,
      surat.keperluan ? `Keperluan surat: ${surat.keperluan}.` : "",
      surat.catatan_admin
        ? `Catatan admin: ${surat.catatan_admin}`
        : "Silakan hubungi admin kampung untuk informasi perbaikan yang diperlukan.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (surat.status === "disetujui") {
    return [
      ...baseLines,
      `Pengajuan ${surat.jenis_surat} Anda sudah disetujui.`,
      surat.keperluan ? `Keperluan surat: ${surat.keperluan}.` : "",
      surat.nomor_surat
        ? `Nomor surat Anda: ${surat.nomor_surat}.`
        : "Nomor surat sedang disiapkan admin.",
      pdfLine,
      "Silakan menunggu proses akhir atau konfirmasi penyerahan surat dari admin kampung.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (surat.status === "selesai") {
    return [
      ...baseLines,
      `Pengajuan ${surat.jenis_surat} Anda sudah selesai diproses.`,
      surat.keperluan ? `Keperluan surat: ${surat.keperluan}.` : "",
      surat.nomor_surat ? `Nomor surat: ${surat.nomor_surat}.` : "",
      pdfLine,
      "Surat dapat diambil atau dikonfirmasi langsung dengan admin kampung.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    ...baseLines,
    `Kami informasikan bahwa status pengajuan ${surat.jenis_surat} Anda saat ini: ${surat.status}.`,
    surat.nomor_surat ? `Nomor surat: ${surat.nomor_surat}.` : "",
    "Silakan hubungi kantor kampung bila ada pertanyaan lebih lanjut.",
    "",
    "Pemerintah Kampung Palareng",
  ]
    .filter(Boolean)
    .join("\n");
}

function resolveBantuanWhatsappMessage(pengajuan: PengajuanBantuan) {
  const baseLines = [`Halo ${pengajuan.nama_pemohon},`, ""];

  if (pengajuan.status_pengajuan === "diajukan") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda sudah berhasil dikirim ke Pemerintah Kampung Palareng.`,
      "Silakan tunggu verifikasi dari admin melalui WhatsApp yang terdaftar.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (pengajuan.status_pengajuan === "diverifikasi") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda sudah diverifikasi admin kampung.`,
      "Pengajuan akan diproses lebih lanjut sesuai kuota dan hasil pemeriksaan data.",
      pengajuan.catatan_admin ? `Catatan admin: ${pengajuan.catatan_admin}` : "",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (pengajuan.status_pengajuan === "diproses") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda sedang diproses.`,
      pengajuan.catatan_admin ? `Catatan admin: ${pengajuan.catatan_admin}` : "",
      "Mohon menunggu informasi lanjutan dari admin kampung.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (pengajuan.status_pengajuan === "disetujui") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda sudah disetujui.`,
      pengajuan.catatan_admin ? `Catatan admin: ${pengajuan.catatan_admin}` : "",
      "Silakan menunggu informasi penyaluran atau penyerahan bantuan dari admin kampung.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (pengajuan.status_pengajuan === "ditolak") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda belum dapat disetujui.`,
      pengajuan.catatan_admin
        ? `Catatan admin: ${pengajuan.catatan_admin}`
        : "Silakan hubungi admin kampung untuk informasi lebih lanjut.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (pengajuan.status_pengajuan === "selesai") {
    return [
      ...baseLines,
      `Pengajuan bantuan ${pengajuan.jenis_bantuan} Anda sudah selesai diproses.`,
      pengajuan.catatan_admin ? `Catatan admin: ${pengajuan.catatan_admin}` : "",
      "Silakan konfirmasi ke admin kampung bila masih memerlukan penjelasan tambahan.",
      "",
      "Pemerintah Kampung Palareng",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    ...baseLines,
    `Status pengajuan bantuan ${pengajuan.jenis_bantuan} Anda saat ini: ${pengajuan.status_pengajuan}.`,
    pengajuan.catatan_admin ? `Catatan admin: ${pengajuan.catatan_admin}` : "",
    "",
    "Pemerintah Kampung Palareng",
  ]
    .filter(Boolean)
    .join("\n");
}
