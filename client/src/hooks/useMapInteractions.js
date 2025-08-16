import { useState, useCallback, useEffect } from 'react';

const useMapInteractions = (mapRef, mapLoaded, onMarkerAdd, onCloseAllPanels, currentUserRole, isAddingMarker, setIsAddingMarker) => {
  const [pendingMarker, setPendingMarker] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cursorCoordinates, setCursorCoordinates] = useState(null);

  const handleMapClick = useCallback(async (e) => {
    if (isAddingMarker) {
      e.preventDefault();
      const { lng, lat } = e.lngLat;
     
      setPendingMarker({
        latitude: lat,
        longitude: lng
      });
      setShowCreateModal(true);
      return;
    }
    const target = e.originalEvent.target;
    const isMapClick = target.classList.contains('mapboxgl-canvas') ||
                      target.closest('.mapboxgl-canvas');
   
    const isMarkerClick = target.closest('.custom-marker') ||
                          target.classList.contains('custom-marker');
   
    if (isMapClick && !isMarkerClick && onCloseAllPanels) {
      onCloseAllPanels();
    }
  }, [isAddingMarker, onCloseAllPanels]);

  const handleCreateMarker = useCallback(async (markerData) => {
    if (!pendingMarker) return;
    try {
      const isModerated = currentUserRole === 'admin';
    

      await onMarkerAdd({
        ...pendingMarker,
        ...markerData,
        is_moderated: isModerated
      });
     
      setShowCreateModal(false);
      setPendingMarker(null);
      setIsAddingMarker(false);
    } catch (error) {
      console.error('Помилка додавання мітки:', error);
      throw error;
    }
  }, [pendingMarker, onMarkerAdd, currentUserRole, setIsAddingMarker]);

  const handleCancelCreate = useCallback(() => {
    setShowCreateModal(false);
    setPendingMarker(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isAddingMarker) {
      const { lng, lat } = e.lngLat;
      setCursorCoordinates({
        latitude: lat,
        longitude: lng
      });
    }
  }, [isAddingMarker]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;
    const canvas = map.getCanvas();
    
    if (canvas) {
      canvas.style.cursor = isAddingMarker ? 'crosshair' : '';
    }

    const methods = ['dragPan', 'scrollZoom', 'boxZoom', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'];
   
    methods.forEach(method => {
      if (isAddingMarker) {
        map[method].disable();
      } else {
        map[method].enable();
      }
    });

    if (isAddingMarker) {
      map.on('mousemove', handleMouseMove);
    } else {
      map.off('mousemove', handleMouseMove);
      setCursorCoordinates(null);
    }

    return () => {
      if (map.isStyleLoaded()) {
        map.off('mousemove', handleMouseMove);
      }
    };
  }, [isAddingMarker, mapLoaded, handleMouseMove]);

  return {
    handleMapClick,
    showCreateModal,
    pendingMarker,
    handleCreateMarker,
    handleCancelCreate,
    cursorCoordinates
  };
};

export { useMapInteractions };