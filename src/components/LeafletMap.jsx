"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({
  address = "No. 273, Wuquan 3rd Street, West District, Taichung City 403, Taiwan",
  zoom = 17,
}) {
  const mapRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(
          `/api/osm-geocode?address=${encodeURIComponent(address)}`
        );
        if (!r.ok) {
          console.error("Geocode API failed:", r.status);
          return;
        }
        const data = await r.json();
        if (data?.lat && data?.lon)
          setPos([Number(data.lat), Number(data.lon)]);
      } catch (e) {
        console.error("Geocode fetch error:", e);
      }
    };
    load();
  }, [address]);

  useEffect(() => {
    if (!pos || mapRef.current) return;

    const map = L.map("map-root", { zoomControl: true }).setView(pos, zoom);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(pos).addTo(map);
    marker
      .bindPopup(`<b>8 DISTANCE 捌程室內設計</b><br/>${address}`)
      .openPopup();

    return () => map.remove();
  }, [pos, zoom, address]);

  return (
    <div
      id="map-root"
      style={{
        width: "100%",
        height: 420,
        borderRadius: 12,
        overflow: "hidden",
      }}
    />
  );
}
