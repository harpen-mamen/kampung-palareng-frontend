"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminSuratSettings, updateAdminSuratSettings } from "@/lib/api";
import type { SuratSettings } from "@/types/portal";

const emptySettings: SuratSettings = {
  surat_templates: {},
  surat_numbering: {},
};

export function SuratTemplateSettings() {
  const [settings, setSettings] = useState<SuratSettings>(emptySettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(() => {
      void (async () => {
        try {
          const result = await getAdminSuratSettings();
          setSettings(result);
        } catch {
          setError("Template surat gagal dimuat.");
        }
      })();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const jenisSurat = Object.keys(settings.surat_templates);

  return (
    <div className="card-panel rounded-[1.75rem] p-6">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
          Pengaturan Template
        </p>
        <h3 className="mt-3 text-xl font-bold text-slate-950">
          Kode nomor surat dan redaksi resmi per jenis surat
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Anda bisa mengubah kode penomoran dan isi redaksi surat tanpa mengedit kode.
          Placeholder yang tersedia: <code>{`{purpose}`}</code>, <code>{`{keperluan}`}</code>,
          <code>{` {nama}`}</code>, <code>{` {alamat}`}</code>, <code>{` {lindongan}`}</code>.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {jenisSurat.map((jenis) => (
          <div key={jenis} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <div className="grid gap-4 lg:grid-cols-[0.32fr_0.68fr]">
              <div>
                <p className="text-sm font-bold text-slate-950">{jenis}</p>
                <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Kode Surat
                </label>
                <input
                  value={settings.surat_numbering[jenis] ?? ""}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      surat_numbering: {
                        ...prev.surat_numbering,
                        [jenis]: event.target.value.toUpperCase(),
                      },
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Template Isi Surat
                </label>
                <textarea
                  value={settings.surat_templates[jenis] ?? ""}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      surat_templates: {
                        ...prev.surat_templates,
                        [jenis]: event.target.value,
                      },
                    }))
                  }
                  className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {message ? <p className="mt-5 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-5 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-6">
        <button
          onClick={() =>
            startTransition(async () => {
              try {
                const result = await updateAdminSuratSettings(settings);
                setSettings({
                  surat_templates: result.surat_templates,
                  surat_numbering: result.surat_numbering,
                });
                setMessage(result.message);
                setError("");
              } catch {
                setError("Template surat gagal disimpan.");
              }
            })
          }
          className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengaturan Template"}
        </button>
      </div>
    </div>
  );
}
