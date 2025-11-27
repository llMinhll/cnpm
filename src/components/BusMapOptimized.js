// src/components/BusMapOptimized.js
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE } from "../api";

const DEFAULT_CENTER = [16.047, 108.206]; // Đà Nẵng

// Icon xe buýt
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61235.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const BusMapOptimized = ({ selectedRouteId }) => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const busMarkersRef = useRef({});
  const busPollTimerRef = useRef(null);

  // Khởi tạo map (chỉ 1 lần)
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapDivRef.current).setView(DEFAULT_CENTER, 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // hàm zoom / recenter cho MapPage gọi
    window.zoomMap = (isZoomIn) => {
      if (!mapRef.current) return;
      const z = mapRef.current.getZoom();
      mapRef.current.setZoom(isZoomIn ? z + 1 : z - 1);
    };

    window.recenterMap = () => {
      if (!mapRef.current) return;
      mapRef.current.setView(DEFAULT_CENTER, 12);
    };

    // Polling vị trí xe giống startPolling() trong JS cũ,
    // nhưng không dùng React state → không re-render component.
    const pollBusPositions = async () => {
      try {
        const res = await fetch(`${API_BASE}/buses/positions`);
        if (!res.ok) {
          console.error("API /buses/positions error:", res.status);
          return;
        }
        const buses = await res.json();
        updateBusMarkers(buses);
      } catch (err) {
        console.error("pollBusPositions error:", err);
      }
    };

    pollBusPositions();
    busPollTimerRef.current = setInterval(pollBusPositions, 5000);

    return () => {
      if (busPollTimerRef.current) clearInterval(busPollTimerRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // cập nhật marker xe: không dùng React, chỉ thao tác Leaflet
  const updateBusMarkers = (buses) => {
    const map = mapRef.current;
    if (!map) return;

    // lọc theo tuyến nếu có selectedRouteId
    const visible = selectedRouteId
      ? buses.filter((b) => b.route_id === selectedRouteId)
      : buses;

    const activeIds = new Set(
      visible
        .filter((b) => b.id != null || b.bus_id != null)
        .map((b) => String(b.id ?? b.bus_id))
    );

    // xoá marker xe không còn trong list
    Object.keys(busMarkersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        map.removeLayer(busMarkersRef.current[id]);
        delete busMarkersRef.current[id];
      }
    });

    // tạo / cập nhật marker đang chạy
    visible.forEach((bus) => {
      const id = String(bus.id ?? bus.bus_id);
      if (!bus.lat || !bus.lng) return;

      if (!busMarkersRef.current[id]) {
        const m = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(map);
        m.bindPopup(`
          <b>${bus.plate || "Xe"}</b><br/>
          Tuyến: ${bus.route_id || "-"}<br/>
          Tốc độ: ${bus.speed || 0} km/h
        `);
        busMarkersRef.current[id] = m;
      } else {
        busMarkersRef.current[id].setLatLng([bus.lat, bus.lng]);
        busMarkersRef.current[id].setPopupContent(`
          <b>${bus.plate || "Xe"}</b><br/>
          Tuyến: ${bus.route_id || "-"}<br/>
          Tốc độ: ${bus.speed || 0} km/h
        `);
      }
    });
  };

  // Khi đổi tuyến → load stops + OSRM, vẽ polyline + marker trạm
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedRouteId) return;

    const loadRoute = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/routes/${selectedRouteId}/stops`
        );
        if (!res.ok) {
          console.error("/routes/:id/stops error:", res.status);
          return;
        }
        const stops = await res.json();

        // clear polyline cũ
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
          routeLayerRef.current = null;
        }
        // clear marker trạm cũ
        stopMarkersRef.current.forEach((m) => map.removeLayer(m));
        stopMarkersRef.current = [];

        if (!Array.isArray(stops) || stops.length === 0) return;

        // vẽ marker trạm
        const stopLatLngs = [];
        stops.forEach((s) => {
          const lat = s.lat;
          const lng = s.lng;
          stopLatLngs.push([lat, lng]);

          const m = L.circleMarker([lat, lng], {
            radius: 5,
            color: "red",
            fillColor: "yellow",
            fillOpacity: 0.8,
          }).addTo(map);
          m.bindPopup(`Trạm: ${s.name}<br/>Thứ tự: ${s.stop_order}`);
          stopMarkersRef.current.push(m);
        });

        // Gọi OSRM để bám đường phố
        const coordsStr = stops
          .map((s) => `${s.lng},${s.lat}`)
          .join(";");

        const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

        let routeLatLngs = stopLatLngs; // fallback

        try {
          const r = await fetch(url);
          const data = await r.json();

          if (
            data.code === "Ok" &&
            data.routes &&
            data.routes.length > 0 &&
            data.routes[0].geometry
          ) {
            const coords = data.routes[0].geometry.coordinates; // [lng,lat]
            routeLatLngs = coords.map(([lng, lat]) => [lat, lng]);
          } else {
            console.warn(
              "OSRM không trả route, dùng đường thẳng nối trạm."
            );
          }
        } catch (err2) {
          console.error("Lỗi gọi OSRM:", err2);
        }

        routeLayerRef.current = L.polyline(routeLatLngs, {
          color: "blue",
          weight: 4,
        }).addTo(map);

        map.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [20, 20],
        });
      } catch (err) {
        console.error("loadRoute error:", err);
      }
    };

    loadRoute();
  }, [selectedRouteId]);

  return (
    <div
      ref={mapDivRef}
      id="map"
      style={{ width: "100%", height: "100%", borderRadius: 16 }}
    />
  );
};

export default BusMapOptimized;
