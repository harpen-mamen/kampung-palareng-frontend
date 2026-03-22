"use client";

import { LeafletMap } from "@/components/maps/leaflet-map";
import type { RumahMarker } from "@/types/portal";

export function PublicMap({
  markers,
  onMarkerSelect,
}: {
  markers: RumahMarker[];
  onMarkerSelect?: (marker: RumahMarker) => void;
}) {
  return <LeafletMap markers={markers} onMarkerSelect={onMarkerSelect} />;
}
