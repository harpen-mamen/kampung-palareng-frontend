"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RumahMarker } from "@/types/portal";

type GoogleMapsLibrary = {
  maps: {
    Map: new (element: HTMLElement, options?: Record<string, unknown>) => {
      setCenter: (position: { lat: number; lng: number }) => void;
      setZoom: (zoom: number) => void;
      fitBounds: (bounds: unknown, padding?: number) => void;
    };
    Marker: new (options?: Record<string, unknown>) => {
      addListener: (eventName: string, handler: () => void) => void;
      setMap: (map: unknown) => void;
    };
    InfoWindow: new () => {
      setContent: (content: string) => void;
      open: (options: Record<string, unknown>) => void;
    };
    LatLngBounds: new () => {
      extend: (position: { lat: number; lng: number }) => void;
      getCenter: () => { lat: () => number; lng: () => number };
    };
    SymbolPath: {
      CIRCLE: unknown;
    };
  };
};

type GoogleWindow = Window & {
  google?: GoogleMapsLibrary;
  __googleMapsPromise?: Promise<GoogleMapsLibrary>;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const PALARENG_CENTER = { lat: 3.5813, lng: 125.4948 };
const MAP_ID = "portal-kampung-palareng";

function loadGoogleMaps(): Promise<GoogleMapsLibrary> {
  const googleWindow = window as GoogleWindow;

  if (googleWindow.google?.maps) {
    return Promise.resolve(googleWindow.google);
  }

  if (googleWindow.__googleMapsPromise) {
    return googleWindow.__googleMapsPromise;
  }

  googleWindow.__googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (googleWindow.google?.maps) {
        resolve(googleWindow.google);
      } else {
        reject(new Error("Google Maps gagal dimuat."));
      }
    };
    script.onerror = () => reject(new Error("Script Google Maps gagal dimuat."));
    document.head.appendChild(script);
  });

  return googleWindow.__googleMapsPromise;
}

function buildInfoContent(marker: RumahMarker, admin: boolean) {
  const title =
    marker.keluarga?.nama_kepala_keluarga ?? marker.nama_kepala_keluarga ?? "-";

  const adminDetails =
    admin && marker.keluarga
      ? `
        <p style="margin:6px 0 0;color:#475569;font-size:13px;">Kode: ${marker.keluarga.kode_keluarga ?? "-"}</p>
        <p style="margin:4px 0 0;color:#475569;font-size:13px;">Status ekonomi: ${marker.keluarga.status_ekonomi ?? "-"}</p>
      `
      : "";

  return `
    <div style="min-width:220px;padding:4px 2px 2px;font-family:Poppins,Segoe UI,sans-serif;">
      <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:700;">${title}</p>
      <p style="margin:4px 0;color:#475569;font-size:13px;">Penghuni: ${marker.jumlah_penghuni}</p>
      <p style="margin:4px 0;color:#475569;font-size:13px;">Lindongan: ${marker.lindongan}</p>
      ${adminDetails}
    </div>
  `;
}

export function GoogleMap({
  markers,
  admin = false,
}: {
  markers: RumahMarker[];
  admin?: boolean;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<InstanceType<GoogleMapsLibrary["maps"]["Map"]> | null>(null);
  const googleMarkersRef = useRef<InstanceType<GoogleMapsLibrary["maps"]["Marker"]>[]>([]);
  const infoWindowRef = useRef<InstanceType<GoogleMapsLibrary["maps"]["InfoWindow"]> | null>(null);
  const [loadError, setLoadError] = useState("");

  const googleLink = useMemo(() => {
    const focus = markers[0];
    if (!focus) {
      return `https://www.google.com/maps/@${PALARENG_CENTER.lat},${PALARENG_CENTER.lng},18z/data=!3m1!1e3`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${focus.latitude},${focus.longitude}`;
  }, [markers]);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!mapRef.current) return;

      if (!GOOGLE_MAPS_API_KEY) {
        setLoadError("Google Maps API key belum diatur.");
        return;
      }

      try {
        const googleObject = await loadGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const map = new googleObject.maps.Map(mapRef.current, {
          center: PALARENG_CENTER,
          zoom: 18,
          mapTypeId: "hybrid",
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          gestureHandling: "greedy",
          mapId: MAP_ID,
        });

        googleMapRef.current = map;
        infoWindowRef.current = new googleObject.maps.InfoWindow();
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Google Maps gagal dimuat.",
          );
        }
      }
    }

    void setupMap();

    return () => {
      cancelled = true;
      googleMarkersRef.current.forEach((marker) => marker.setMap(null));
      googleMarkersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = googleMapRef.current;
    const infoWindow = infoWindowRef.current;
    const googleObject = (window as GoogleWindow).google;

    if (!map || !infoWindow || !googleObject) return;

    googleMarkersRef.current.forEach((marker) => marker.setMap(null));
    googleMarkersRef.current = [];

    if (markers.length === 0) {
      map.setCenter(PALARENG_CENTER);
      map.setZoom(18);
      return;
    }

    const bounds = new googleObject.maps.LatLngBounds();

    markers.forEach((marker) => {
      const mapMarker = new googleObject.maps.Marker({
        map,
        position: { lat: marker.latitude, lng: marker.longitude },
        title:
          marker.keluarga?.nama_kepala_keluarga ?? marker.nama_kepala_keluarga ?? "Rumah warga",
        label: {
          text: String(marker.jumlah_penghuni),
          color: "#ffffff",
          fontWeight: "700",
        },
        icon: {
          path: googleObject.maps.SymbolPath.CIRCLE,
          fillColor: "#0b5ed7",
          fillOpacity: 0.95,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: admin ? 11 : 10,
        },
      });

      mapMarker.addListener("click", () => {
        infoWindow.setContent(buildInfoContent(marker, admin));
        infoWindow.open({
          anchor: mapMarker,
          map,
        });
      });

      googleMarkersRef.current.push(mapMarker);
      bounds.extend({ lat: marker.latitude, lng: marker.longitude });
    });

    if (markers.length === 1) {
      const center = bounds.getCenter();
      map.setCenter({ lat: center.lat(), lng: center.lng() });
      map.setZoom(19);
    } else {
      map.fitBounds(bounds, 80);
    }
  }, [admin, markers]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        {loadError ? (
          <div className="flex h-[520px] flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,_#e0f2fe,_#f8fafc)] px-6 text-center">
            <p className="text-lg font-semibold text-slate-900">Google Maps belum aktif</p>
            <p className="max-w-xl text-sm leading-7 text-slate-600">{loadError}</p>
            <p className="text-sm text-slate-500">
              Isi `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` di `.env.local` frontend agar peta Google tampil.
            </p>
          </div>
        ) : (
          <div ref={mapRef} className="h-[520px] w-full" />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Google Maps
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Marker rumah mengikuti data dashboard admin dan akan bergerak sesuai filter.
          </p>
        </div>
        <Link
          href={googleLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Buka di Google Maps
        </Link>
      </div>
    </div>
  );
}
