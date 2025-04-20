import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

const MapContainer = styled.div`
  height: calc(100vh - 100px); // Adjust height to account for header
  width: 100%;
  border-radius: 20px;
`;

interface MapProps {
  selectedMouse?: string;
  isReportingMode?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

interface Mouse {
  id: number;
  username: string;
  house: string;
  mouse_emoji: string;
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
}

const Map: React.FC<MapProps> = ({ selectedMouse = '🐁', isReportingMode = false, onLocationSelect }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mice, setMice] = useState<Mouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchMice = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mice')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMice(data || []);
    } catch (error) {
      console.error('Error fetching mice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMice();
  }, []);

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

      // Store map instance globally for access in App.tsx
      (window as any).mapInstance = map;

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when mice data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new markers
    mice.forEach((mouse) => {
      const mouseIcon = L.divIcon({
        html: mouse.mouse_emoji,
        className: 'mouse-icon',
        iconSize: [30, 30]
      });

      const marker = L.marker([mouse.latitude, mouse.longitude], { icon: mouseIcon })
        .addTo(mapRef.current!);
      
      marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
          <div style="font-size: 2em; margin-bottom: 5px;">${mouse.mouse_emoji}</div>
          <div style="font-weight: bold; margin-bottom: 5px;">${mouse.house}</div>
          <div style="color: #666; font-size: 0.9em;">${new Date(mouse.created_at).toLocaleString()}</div>
        </div>
      `);
    });
  }, [mice]);

  // Handle click for new mice
  useEffect(() => {
    if (!mapRef.current || !isReportingMode) return;

    const map = mapRef.current;
    const mouseIcon = L.divIcon({
      html: selectedMouse,
      className: 'mouse-icon',
      iconSize: [30, 30]
    });

    const clickHandler = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }

      const marker = L.marker([lat, lng], { icon: mouseIcon })
        .addTo(map);
      
      marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
          <div style="font-size: 2em; margin-bottom: 5px;">${selectedMouse}</div>
          <div style="color: #666;">New mouse spotted!</div>
        </div>
      `).openPopup();
    };

    map.on('click', clickHandler);
    return () => {
      map.off('click', clickHandler);
    };
  }, [isReportingMode, selectedMouse, onLocationSelect]);

  return (
    <MapContainer id="map">
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          Loading mice... 🐭
        </div>
      )}
    </MapContainer>
  );
};

export default Map; 