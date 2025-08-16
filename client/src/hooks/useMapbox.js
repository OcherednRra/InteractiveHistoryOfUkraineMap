import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'API_KEY_HERE';

export const useMapbox = (mapContainerRef, isPanelOpen) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  const initializeMap = () => {
    if (mapRef.current) return;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [31.1656, 48.3794],
        zoom: 5,
        attributionControl: true,
        collectResourceTiming: false,
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        const map = mapRef.current;
        console.log('Map loaded. Adding language control...');

        map.getStyle().layers.forEach((layer) => {
        if (layer.id.endsWith('-label')) {
            map.setLayoutProperty(layer.id, 'text-field', [
                'coalesce',
                ['get', 'name_uk-Hant'],
                ['get', 'name'],
            ]);
        }

 })
      })
        
  

      mapRef.current.on('error', (e) => {
        setMapError('Помилка завантаження карти: ' + e.error?.message || 'Помилка невідома');
      });

    } catch (error) {
      setMapError('Помилка ініціалізації карти: ' + error.message);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  };

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const timeoutId = setTimeout(() => {
      mapRef.current.resize();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [isPanelOpen, mapLoaded]);

  return { mapRef, mapLoaded, mapError, initializeMap };
};
