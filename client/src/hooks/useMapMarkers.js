import { useRef, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { createMarkerElement } from '../utils/markerElement';

const useMapMarkers = (mapRef, mapLoaded, markers, currentUserEmail, selectedMarker, onMarkerSelect, onMarkerDelete) => {
  const markersRef = useRef([]);

  const closeAllPopups = useCallback(() => {
  }, []);

  const handleShowMarkerDetails = useCallback((markerData) => {
    const isModerated = markerData && markerData.is_moderated !== undefined ? markerData.is_moderated : true;
    
    if (!isModerated) {
      return;
    }
    
    if (onMarkerSelect) {
      onMarkerSelect(markerData);
    }
  }, [onMarkerSelect]);

  useEffect(() => {
    window.deleteMarker = async (markerId) => {
      if (window.confirm('Ви впевнені, що хочете видалити цю мітку?')) {
        try {
          await onMarkerDelete(markerId);
        } catch (error) {
          console.error('Помилка видалення мітки:', error);
          alert('Помилка видалення мітки: ' + (error.response?.data?.error || error.message));
        }
      }
    };

    return () => {
      delete window.deleteMarker;
    };
  }, [onMarkerDelete]);

  const updateMarkers = useCallback(() => {
    console.log('Оновлення маркерів на:', markers?.length || 0);
    
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Помилка при видаленні маркера:', error);
      }
    });
    markersRef.current = [];

    markers.forEach(markerData => {
      try {
        const isSelected = selectedMarker && selectedMarker.id === markerData.id;
        
        const isModerated = markerData && markerData.is_moderated !== undefined ? markerData.is_moderated : true;
        
        const markerElement = createMarkerElement(markerData.icon || 'MapPin', isSelected, markerData);

        const opacity = markerData.opacity !== undefined ? markerData.opacity : 1;
        markerElement.style.opacity = opacity;

        const marker = new mapboxgl.Marker({ 
          element: markerElement
        })
          .setLngLat([markerData.longitude, markerData.latitude])
          .addTo(mapRef.current);

        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          
          if (isModerated) {
            handleShowMarkerDetails(markerData);
          }         });
        
      } catch (error) {
        console.error('Помилка додавання маркера:', markerData.id, error);
      }
    });

  }, [markers, mapLoaded, currentUserEmail, selectedMarker, handleShowMarkerDetails]);

  useEffect(() => {
    updateMarkers();
  }, [markers, selectedMarker, mapLoaded]);

  return { updateMarkers, closeAllPopups };
};

export { useMapMarkers };