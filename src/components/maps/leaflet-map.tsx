"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SimpleVillageMap } from "@/components/maps/simple-village-map";
import type { RumahMarker } from "@/types/portal";

type LeafletModule = typeof import("leaflet");
type LeafletMapInstance = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup & {
  __markerIcon?: import("leaflet").Icon;
};

const PALARENG_CENTER: [number, number] = [3.5813, 125.4948];
const PALARENG_BOUNDS: [[number, number], [number, number]] = [
  [3.5778, 125.4908],
  [3.5846, 125.4986],
];
const LINDONGAN_POLYGONS = [
  {
    label: "Lindongan 1",
    color: "#0b5ed7",
    center: [3.58355, 125.49245] as [number, number],
    points: [
      [3.5846, 125.4908],
      [3.5846, 125.494],
      [3.5823, 125.494],
      [3.5823, 125.4908],
    ] as [number, number][],
  },
  {
    label: "Lindongan 2",
    color: "#168a65",
    center: [3.58355, 125.4962] as [number, number],
    points: [
      [3.5846, 125.494],
      [3.5846, 125.4986],
      [3.5823, 125.4986],
      [3.5823, 125.494],
    ] as [number, number][],
  },
  {
    label: "Lindongan 3",
    color: "#1d4ed8",
    center: [3.58005, 125.49245] as [number, number],
    points: [
      [3.5823, 125.4908],
      [3.5823, 125.494],
      [3.5778, 125.494],
      [3.5778, 125.4908],
    ] as [number, number][],
  },
  {
    label: "Lindongan 4",
    color: "#0f766e",
    center: [3.58005, 125.4962] as [number, number],
    points: [
      [3.5823, 125.494],
      [3.5823, 125.4986],
      [3.5778, 125.4986],
      [3.5778, 125.494],
    ] as [number, number][],
  },
];
const JALAN_UTAMA = [
  [3.5841, 125.4913],
  [3.5832, 125.4925],
  [3.5824, 125.4938],
  [3.5816, 125.4949],
  [3.5807, 125.496],
  [3.5794, 125.4975],
] as [number, number][];
const JALAN_LINTAS = [
  [3.5832, 125.4977],
  [3.5824, 125.4962],
  [3.5815, 125.4947],
  [3.5806, 125.4934],
  [3.5797, 125.4921],
] as [number, number][];

function isValidCoordinate(value: number) {
  return Number.isFinite(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getMarkerLabel(code?: string, name?: string) {
  const compactCode = code?.replace(/\s+/g, " ").trim();
  if (compactCode) {
    return compactCode.length > 14 ? `${compactCode.slice(0, 14)}...` : compactCode;
  }

  if (!name) return "Rumah";

  const compactName = name.replace(/\s+/g, " ").trim();
  if (!compactName) return "Rumah";

  const firstWord = compactName.split(" ")[0] ?? compactName;
  return firstWord.length > 14 ? `${firstWord.slice(0, 14)}...` : firstWord;
}

function formatBooleanLabel(value?: boolean, truthyLabel = "Ya", falsyLabel = "Tidak") {
  return value ? truthyLabel : falsyLabel;
}

function getLindonganTone(lindongan?: string) {
  switch (lindongan) {
    case "Lindongan 1":
      return "l1";
    case "Lindongan 2":
      return "l2";
    case "Lindongan 3":
      return "l3";
    case "Lindongan 4":
      return "l4";
    default:
      return "default";
  }
}

export function LeafletMap({
  markers,
  admin = false,
  onMarkerSelect,
}: {
  markers: RumahMarker[];
  admin?: boolean;
  onMarkerSelect?: (marker: RumahMarker) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const markersLayerRef = useRef<LeafletLayerGroup | null>(null);
  const filteredMarkersRef = useRef<RumahMarker[]>([]);
  const onMarkerSelectRef = useRef<typeof onMarkerSelect>(onMarkerSelect);
  const leafletRef = useRef<LeafletModule | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [useFallbackMap, setUseFallbackMap] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [layerVisibility, setLayerVisibility] = useState({
    bantuan: true,
    dtks: true,
    nelayan: true,
  });
  const [visibleInView, setVisibleInView] = useState({
    total: 0,
    bantuan: 0,
    dtks: 0,
    nelayan: 0,
  });
  const [activePopupMarker, setActivePopupMarker] = useState<RumahMarker | null>(null);
  const [activePopupPosition, setActivePopupPosition] = useState<{ x: number; y: number } | null>(null);
  const validMarkers = useMemo(
    () =>
      markers.filter(
        (marker) => isValidCoordinate(marker.latitude) && isValidCoordinate(marker.longitude),
      ),
    [markers],
  );
  const filteredMarkers = useMemo(
    () =>
      validMarkers.filter((marker) => {
        const isBantuan = (marker.keluarga?.bantuan?.length ?? 0) > 0;
        const isDtks = Boolean(marker.keluarga?.status_dtks);
        const isNelayan = marker.keluarga?.pekerjaan_utama === "Nelayan";

        if (!layerVisibility.bantuan && isBantuan) return false;
        if (!layerVisibility.dtks && isDtks) return false;
        if (!layerVisibility.nelayan && isNelayan) return false;
        return true;
      }),
    [layerVisibility.bantuan, layerVisibility.dtks, layerVisibility.nelayan, validMarkers],
  );
  const bantuanMarkers = filteredMarkers.filter((marker) => (marker.keluarga?.bantuan?.length ?? 0) > 0).length;
  const nonBantuanMarkers = Math.max(filteredMarkers.length - bantuanMarkers, 0);
  const lindonganLegend = useMemo(
    () =>
      ["Lindongan 1", "Lindongan 2", "Lindongan 3", "Lindongan 4"]
        .map((label) => ({
          label,
          total: filteredMarkers.filter(
            (marker) => (marker.keluarga?.lindongan ?? marker.lindongan) === label,
          ).length,
          tone: getLindonganTone(label),
        }))
        .filter((item) => item.total > 0),
    [filteredMarkers],
  );
  filteredMarkersRef.current = filteredMarkers;
  onMarkerSelectRef.current = onMarkerSelect;

  function updatePopupPosition(marker: RumahMarker | null) {
    const map = mapRef.current;
    if (!map || !marker) {
      setActivePopupPosition(null);
      return;
    }

    const point = map.latLngToContainerPoint([marker.latitude, marker.longitude]);
    setActivePopupPosition({
      x: Math.max(28, Math.min(point.x, map.getSize().x - 28)),
      y: Math.max(28, Math.min(point.y - 18, map.getSize().y - 28)),
    });
  }

  function updateVisibleStats(targetMarkers: RumahMarker[]) {
    const map = mapRef.current;
    if (!map) return;

    const visibleMarkers = targetMarkers.filter((marker) =>
      map.getBounds().contains([marker.latitude, marker.longitude]),
    );

    const nextStats = {
      total: visibleMarkers.length,
      bantuan: visibleMarkers.filter((marker) => (marker.keluarga?.bantuan?.length ?? 0) > 0).length,
      dtks: visibleMarkers.filter((marker) => Boolean(marker.keluarga?.status_dtks)).length,
      nelayan: visibleMarkers.filter((marker) => marker.keluarga?.pekerjaan_utama === "Nelayan").length,
    };

    setVisibleInView((current) =>
      current.total === nextStats.total &&
      current.bantuan === nextStats.bantuan &&
      current.dtks === nextStats.dtks &&
      current.nelayan === nextStats.nelayan
        ? current
        : nextStats,
    );
  }

  useEffect(() => {
    let active = true;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    async function initializeMap() {
      if (!containerRef.current || mapRef.current) return;

      try {
        const L = await import("leaflet");
        if (!active || !containerRef.current) return;

        leafletRef.current = L;

        const map = L.map(containerRef.current, {
          center: PALARENG_CENTER,
          zoom: 15,
          scrollWheelZoom: true,
          minZoom: 14,
          maxZoom: 21,
          zoomControl: true,
        });

        map.getContainer().style.background =
          "linear-gradient(180deg, rgba(227,239,255,1) 0%, rgba(241,248,255,1) 48%, rgba(236,253,245,1) 100%)";

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        if (admin) {
          L.rectangle(PALARENG_BOUNDS, {
            color: "#1d4ed8",
            weight: 2,
            opacity: 0.45,
            dashArray: "8 6",
            fillColor: "#bfdbfe",
            fillOpacity: 0.08,
          }).addTo(map);

          LINDONGAN_POLYGONS.forEach((area) => {
            L.polygon(area.points, {
              color: area.color,
              weight: 1.8,
              fillColor: area.color,
              fillOpacity: 0.16,
            }).addTo(map);

            L.marker(area.center, {
              icon: L.divIcon({
                className: "leaflet-lindongan-label",
                html: `<span>${area.label}</span>`,
                iconSize: [120, 28],
                iconAnchor: [60, 14],
              }),
            }).addTo(map);
          });

          L.polyline(JALAN_UTAMA, {
            color: "#475569",
            weight: 5,
            opacity: 0.82,
          }).addTo(map);

          L.polyline(JALAN_LINTAS, {
            color: "#64748b",
            weight: 3.5,
            opacity: 0.7,
            dashArray: "8 6",
          }).addTo(map);

          L.marker(PALARENG_CENTER, {
            icon: L.divIcon({
              className: "leaflet-kampung-label",
              html: "<span>Kampung Palareng</span>",
              iconSize: [170, 32],
              iconAnchor: [85, 16],
            }),
          }).addTo(map);
        }

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setCurrentZoom(map.getZoom());
        map.on("zoomend", () => {
          setCurrentZoom(map.getZoom());
          updateVisibleStats(filteredMarkersRef.current);
          setActivePopupMarker((current) => {
            if (current) {
              window.setTimeout(() => updatePopupPosition(current), 0);
            }
            return current;
          });
        });
        map.on("moveend", () => {
          updateVisibleStats(filteredMarkersRef.current);
          setActivePopupMarker((current) => {
            if (current) {
              window.setTimeout(() => updatePopupPosition(current), 0);
            }
            return current;
          });
        });
        map.on("click", () => {
          setActivePopupMarker(null);
          setActivePopupPosition(null);
        });
        setUseFallbackMap(false);
        setMapReady(true);

        window.setTimeout(() => {
          map.invalidateSize();
        }, 150);
      } catch {
        if (active) {
          setUseFallbackMap(true);
        }
      }
    }

    fallbackTimer = setTimeout(() => {
      if (!mapRef.current && active) {
        setUseFallbackMap(true);
      }
    }, 2500);

    void initializeMap();

    return () => {
      active = false;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
      setMapReady(false);
      markersLayerRef.current?.clearLayers();
      markersLayerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // `admin` is stable for the lifetime of each mounted map instance.
  // Keeping this effect one-time avoids dependency-size mismatch during refresh/hydration.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (useFallbackMap) return;
    if (!mapReady || !mapRef.current || !markersLayerRef.current || !leafletRef.current) return;

    const layerGroup = markersLayerRef.current;
    const L = leafletRef.current;
    layerGroup.clearLayers();

    filteredMarkers.forEach((marker) => {
      const title =
        marker.keluarga?.nama_kepala_keluarga ?? marker.nama_kepala_keluarga ?? "Data keluarga";
      const uniqueCode = marker.keluarga?.kode_keluarga ?? "";
      const markerLabel = escapeHtml(getMarkerLabel(uniqueCode, title));
      const safeTitle = escapeHtml(title);
      const safeLindongan = escapeHtml(marker.keluarga?.lindongan ?? marker.lindongan ?? "-");
      const safeAddress = escapeHtml(
        marker.keluarga?.alamat ?? marker.alamat_singkat ?? "Alamat belum diisi",
      );
      const safeCategory = escapeHtml(
        marker.keluarga?.kategori_rumah ?? marker.kategori_rumah ?? "Kategori belum diisi",
      );
      const safeJob = escapeHtml(marker.keluarga?.pekerjaan_utama ?? "Belum diisi");
      const safeEconomicStatus = escapeHtml(marker.keluarga?.status_ekonomi ?? "Belum diisi");
      const safeDtks = escapeHtml(
        formatBooleanLabel(marker.keluarga?.status_dtks, "Masuk DTKS", "Non-DTKS"),
      );
      const safeOccupants = marker.keluarga?.jumlah_anggota ?? marker.jumlah_penghuni;
      const safePhoto = marker.foto_rumah ? escapeHtml(marker.foto_rumah) : "";
      const keluargaBantuan = marker.keluarga?.bantuan ?? [];
      const bantuanCount = keluargaBantuan.length;
      const bantuanItems =
        bantuanCount > 0
          ? keluargaBantuan
              .map((item) => {
                const bantuanName = escapeHtml(item.nama_bantuan ?? "Bantuan");
                const bantuanStatus = escapeHtml(item.status_penerima ?? "-");
                return `<span class="leaflet-popup-chip"><strong>${bantuanName}</strong><em>${bantuanStatus}</em></span>`;
              })
              .join("")
          : "";
      const detailId = `leaflet-detail-${admin ? "admin" : "public"}-${marker.id}`;
      const buttonId = `leaflet-toggle-${admin ? "admin" : "public"}-${marker.id}`;
      const tone = getLindonganTone(marker.keluarga?.lindongan ?? marker.lindongan);
      const bantuanClass = bantuanCount > 0 ? "is-assisted" : "is-regular";

      const showLabel = currentZoom >= 17;
      const markerIcon = L.divIcon({
        className: "leaflet-rumah-marker",
        html: `
          <div class="leaflet-rumah-chip leaflet-rumah-chip--${admin ? "admin" : "public"} leaflet-rumah-chip--${tone} ${bantuanClass}">
            ${showLabel ? `<span>${markerLabel}</span>` : ""}
            <b class="leaflet-rumah-chip__pin"></b>
          </div>
        `,
        iconSize: showLabel ? [116, 28] : [20, 20],
        iconAnchor: showLabel ? [14, 22] : [7, 14],
        popupAnchor: showLabel ? [8, -18] : [0, -14],
      });

      const leafletMarker = L.marker([marker.latitude, marker.longitude], {
        icon: markerIcon,
      });
      leafletMarker.on("click", () => {
        leafletMarker.openPopup();
        setActivePopupMarker(marker);
        updatePopupPosition(marker);
        onMarkerSelectRef.current?.(marker);
      });

      const familyDetails = marker.keluarga
        ? `
          <div id="${detailId}" class="leaflet-popup-section leaflet-popup-section--detail" hidden>
            ${safePhoto ? `<img class="leaflet-popup-photo" src="${safePhoto}" alt="Foto rumah ${safeTitle}" />` : ""}
            <p class="leaflet-popup-label">Detail rumah</p>
            <div class="leaflet-popup-grid">
              <div class="leaflet-popup-stat">
                <span class="leaflet-popup-stat__label">Penghuni</span>
                <strong class="leaflet-popup-stat__value">${safeOccupants}</strong>
              </div>
              <div class="leaflet-popup-stat">
                <span class="leaflet-popup-stat__label">Bantuan</span>
                <strong class="leaflet-popup-stat__value">${bantuanCount}</strong>
              </div>
            </div>
            <p class="leaflet-popup-meta">Alamat rumah: ${safeAddress}</p>
            <div class="leaflet-popup-tags">
              <span class="leaflet-popup-tag">${safeLindongan}</span>
              <span class="leaflet-popup-tag">${safeCategory}</span>
              <span class="leaflet-popup-tag">${safeJob}</span>
              <span class="leaflet-popup-tag">${safeEconomicStatus}</span>
              <span class="leaflet-popup-tag">${safeDtks}</span>
            </div>
            ${admin ? `<p class="leaflet-popup-meta">Kode keluarga: ${escapeHtml(marker.keluarga.kode_keluarga ?? "-")}</p>` : ""}
          </div>
        `
        : "";

      const bantuanSection =
        bantuanItems.length > 0
          ? `
            <div class="leaflet-popup-section">
              <p class="leaflet-popup-label">Jenis bantuan diterima</p>
              <div class="leaflet-popup-chips">${bantuanItems}</div>
            </div>
          `
          : "";

      leafletMarker.bindPopup(`
          <div class="leaflet-popup-card">
          <div class="leaflet-popup-badge">${admin ? "Peta Admin" : "Peta Publik"}</div>
          <p class="leaflet-popup-title">${safeTitle}</p>
          <div class="leaflet-popup-hero">
            <div class="leaflet-popup-hero__main">
              <p class="leaflet-popup-meta">Keluarga di ${safeLindongan}</p>
              <p class="leaflet-popup-hero__address">${safeAddress}</p>
            </div>
            <div class="leaflet-popup-hero__count">${safeOccupants}<span>orang</span></div>
          </div>
          <div class="leaflet-popup-grid leaflet-popup-grid--summary">
            <div class="leaflet-popup-stat">
              <span class="leaflet-popup-stat__label">Pekerjaan</span>
              <strong class="leaflet-popup-stat__value">${safeJob}</strong>
            </div>
            <div class="leaflet-popup-stat">
              <span class="leaflet-popup-stat__label">Status</span>
              <strong class="leaflet-popup-stat__value">${safeDtks}</strong>
            </div>
          </div>
          <button id="${buttonId}" type="button" class="leaflet-popup-action">Lihat detail lengkap</button>
          ${familyDetails}
          ${
            bantuanSection ||
            `<div class="leaflet-popup-section">
              <p class="leaflet-popup-label">Bantuan</p>
              <p class="leaflet-popup-meta">Belum ada bantuan tercatat untuk keluarga ini.</p>
            </div>`
          }
        </div>
      `);

      leafletMarker.on("popupopen", () => {
        onMarkerSelectRef.current?.(marker);
        setActivePopupMarker(marker);
        updatePopupPosition(marker);
        const popupElement = leafletMarker.getPopup()?.getElement();
        const detailElement = popupElement?.querySelector<HTMLElement>(`#${detailId}`);
        const toggleButton = popupElement?.querySelector<HTMLButtonElement>(`#${buttonId}`);

        if (!detailElement || !toggleButton) return;

        toggleButton.onclick = () => {
          const isHidden = detailElement.hasAttribute("hidden");

          if (isHidden) {
            detailElement.removeAttribute("hidden");
            toggleButton.textContent = "Tutup detail";
          } else {
            detailElement.setAttribute("hidden", "hidden");
            toggleButton.textContent = "Lihat detail lengkap";
          }
        };
      });

      leafletMarker.addTo(layerGroup);
    });

    if (filteredMarkers.length > 0) {
      const bounds = L.latLngBounds([
        ...filteredMarkers.map((marker) => [marker.latitude, marker.longitude] as [number, number]),
      ]);

      if (!mapRef.current.getBounds().intersects(bounds.pad(0.08))) {
        const paddedBounds = bounds.pad(admin ? 0.22 : 0.12);
        mapRef.current.fitBounds(paddedBounds, { padding: [28, 28], maxZoom: admin ? 15 : 16 });
      }
    } else if (mapRef.current.getZoom() < 14) {
      mapRef.current.fitBounds(PALARENG_BOUNDS, { padding: [28, 28], maxZoom: 15 });
    }

    updateVisibleStats(filteredMarkers);
    if (activePopupMarker) {
      const stillExists = filteredMarkers.find((marker) => marker.id === activePopupMarker.id) ?? null;
      setActivePopupMarker(stillExists);
      updatePopupPosition(stillExists);
    }

    window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  }, [activePopupMarker, admin, currentZoom, filteredMarkers, mapReady, useFallbackMap]);

  if (useFallbackMap) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Peta interaktif browser tidak berhasil dimuat, jadi sistem memakai tampilan cadangan
          berbasis koordinat data rumah.
        </div>
        <SimpleVillageMap markers={filteredMarkers} admin={admin} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(239,246,255,0.96))] p-3 shadow-[0_30px_80px_rgba(11,94,215,0.12)]">
        <div className="pointer-events-none absolute inset-x-6 top-5 z-[500] flex flex-wrap items-start justify-between gap-3">
        <div className="rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-[0_16px_35px_rgba(15,23,42,0.10)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            {admin ? "Pusat Kontrol Peta" : "Peta Digital Kampung"}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {filteredMarkers.length} titik rumah aktif
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Kamera otomatis menyesuaikan persebaran data rumah.
          </p>
        </div>
        <div className="pointer-events-auto rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-[0_16px_35px_rgba(15,23,42,0.10)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            Layer Marker
          </p>
          <div className="mt-3 flex max-w-[320px] flex-wrap gap-2">
            {[
              ["bantuan", "Penerima Bantuan", "leaflet-legend-dot--assisted"],
              ["dtks", "DTKS", "leaflet-legend-dot--dtks"],
              ["nelayan", "Nelayan", "leaflet-legend-dot--nelayan"],
            ].map(([key, label, dotClass]) => {
              const typedKey = key as keyof typeof layerVisibility;
              const active = layerVisibility[typedKey];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setLayerVisibility((prev) => ({
                      ...prev,
                      [typedKey]: !prev[typedKey],
                    }))
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-slate-200 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <b className={`leaflet-legend-dot ${dotClass}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-white/70 bg-slate-950/82 px-4 py-3 text-white shadow-[0_16px_35px_rgba(15,23,42,0.18)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Legenda Aktif
          </p>
          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Status Marker
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/82">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <b className="leaflet-legend-dot leaflet-legend-dot--assisted" />
                  Bantuan {bantuanMarkers}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <b className="leaflet-legend-dot leaflet-legend-dot--regular" />
                  Reguler {nonBantuanMarkers}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Lindongan Terlihat
              </p>
              <div className="flex max-w-[320px] flex-wrap gap-2 text-xs text-white/82">
                {lindonganLegend.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <b className={`leaflet-legend-dot leaflet-legend-dot--${item.tone}`} />
                    {item.label} {item.total}
                  </span>
                ))}
                {lindonganLegend.length === 0 ? (
                  <span className="rounded-full bg-white/10 px-3 py-1">Belum ada marker</span>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Dalam View Sekarang
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/82">
                <span className="rounded-xl bg-white/10 px-3 py-2">Rumah {visibleInView.total}</span>
                <span className="rounded-xl bg-white/10 px-3 py-2">Bantuan {visibleInView.bantuan}</span>
                <span className="rounded-xl bg-white/10 px-3 py-2">DTKS {visibleInView.dtks}</span>
                <span className="rounded-xl bg-white/10 px-3 py-2">Nelayan {visibleInView.nelayan}</span>
              </div>
            </div>
            {admin ? (
              <div className="flex flex-wrap gap-2 text-xs text-white/82">
                <span className="rounded-full bg-white/10 px-3 py-1">Batas lindongan</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Jalan utama</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="leaflet-map-host h-[520px] w-full rounded-[1.3rem] border border-white/70"
        style={{ height: "520px", minHeight: "520px", width: "100%" }}
      />

      {activePopupMarker && activePopupPosition ? (
        <div
          className="pointer-events-auto absolute z-[650] w-[min(320px,calc(100%-2rem))] -translate-x-1/2 -translate-y-full"
          style={{ left: activePopupPosition.x, top: activePopupPosition.y }}
        >
          <div className="rounded-[1.35rem] border border-white/85 bg-white/96 p-4 shadow-[0_22px_50px_rgba(15,23,42,0.18)] backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                  Detail Keluarga
                </p>
                <p className="mt-2 text-base font-black text-slate-950">
                  {activePopupMarker.keluarga?.nama_kepala_keluarga ?? activePopupMarker.nama_kepala_keluarga ?? "Keluarga"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePopupMarker(null);
                  setActivePopupPosition(null);
                }}
                className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {activePopupMarker.keluarga?.alamat ?? activePopupMarker.alamat_singkat ?? "Alamat belum diisi"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lindongan</p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {activePopupMarker.keluarga?.lindongan ?? activePopupMarker.lindongan ?? "-"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Penghuni</p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {activePopupMarker.keluarga?.jumlah_anggota ?? activePopupMarker.jumlah_penghuni}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pekerjaan</p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {activePopupMarker.keluarga?.pekerjaan_utama ?? "-"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">DTKS</p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {activePopupMarker.keluarga?.status_dtks ? "Masuk DTKS" : "Non-DTKS"}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-sky-50 px-3 py-3 text-sm text-slate-700">
              Bantuan tercatat: <strong className="text-slate-950">{activePopupMarker.keluarga?.bantuan?.length ?? 0}</strong>
            </div>
          </div>
        </div>
      ) : null}

      {filteredMarkers.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-8 bottom-8 z-[500] rounded-2xl border border-amber-200 bg-white/92 px-4 py-3 text-sm text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.10)] backdrop-blur">
          Tidak ada marker yang tersisa untuk kombinasi filter dan layer aktif saat ini.
        </div>
      ) : null}
    </div>
  );
}
