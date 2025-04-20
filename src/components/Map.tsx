import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

const MapContainer = styled.div`
  height: calc(100vh - 100px); // Adjust height to account for header
  width: 100%;
  border-radius: 20px;
`;

interface MapProps {
  selectedMouse?: string;
  isReportingMode: boolean;
}

const Map: React.FC<MapProps> = ({ selectedMouse = '🐁', isReportingMode = false }) => {
  const mapRef = useRef<L.Map | null>(null);

  const cuteMessages = [
    "Eek! A mouse was here! 🐁",
    "Squeaky friend spotted! 🧀",
    "Mouse sighting! So cute! ✨",
    "A tiny visitor appeared! 🐁",
    "Mouse on the loose! 🎀"
  ];

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map('map').setView([42.3736, -71.1097], 16);
      
      // Add CartoDB's Positron tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Custom mouse icon
      const mouseIcon = L.divIcon({
        html: selectedMouse,
        className: 'mouse-icon',
        iconSize: [25, 25]
      });

      // Click handler
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (!isReportingMode) return;
        
        const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: mouseIcon }).addTo(map);
        const randomMessage = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
        marker.bindPopup(randomMessage).openPopup();
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedMouse, isReportingMode]);

  return <MapContainer id="map" />;
};

export default Map; 