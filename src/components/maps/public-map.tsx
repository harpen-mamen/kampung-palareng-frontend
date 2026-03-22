"use client";

import { LeafletMap } from "@/components/maps/leaflet-map";
import type { RumahMarker } from "@/types/portal";

export function PublicMap({
  markers,
  onMarkerSelect,
  focusMode = false,
}: {
  markers: RumahMarker[];
  onMarkerSelect?: (marker: RumahMarker) => void;
  focusMode?: boolean;
}) {
  return <LeafletMap markers={markers} onMarkerSelect={onMarkerSelect} focusMode={focusMode} />;
}
