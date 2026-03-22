"use client";

import { LeafletMap } from "@/components/maps/leaflet-map";
import type { RumahMarker } from "@/types/portal";

export function AdminMap({ markers }: { markers: RumahMarker[] }) {
  return <LeafletMap markers={markers} admin />;
}
