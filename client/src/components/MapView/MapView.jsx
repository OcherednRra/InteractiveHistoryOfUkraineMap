import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapInfo } from './MapInfo';
import { MapErrorDisplay } from './MapErrorDisplay';
// import CoordinatesDisplay from '../CoordinatesDisplay';
import { useMapbox } from '../../hooks/useMapbox';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { useMapInteractions } from '../../hooks/useMapInteractions';
import CreateMarkerModal from '../CreateMarkerModal';

const MapView = ({
  markers,
  onMarkerAdd,
  onMarkerDelete,
  onMarkerUpdate,
  onMarkerSelect,
  currentUserEmail,
  currentUserRole,
  isPanelOpen,
  onClosePanel,
  selectedMarker,
  onAddingMarkerToggle,
  isAddingMarkerExternal, // Внешнее состояние режима добавления
}) => {
  const mapContainerRef = useRef(null);

  // Custom hooks
  const {
    mapRef,
    mapLoaded,
    mapError,
    initializeMap,
  } = useMapbox(mapContainerRef, isPanelOpen);

  const {
    updateMarkers,
    closeAllPopups,
  } = useMapMarkers(mapRef, mapLoaded, markers, currentUserEmail, selectedMarker, onMarkerSelect, onMarkerDelete);

  const handleCloseAllPanels = () => {
    if (onClosePanel) {
      onClosePanel();
    }
    closeAllPopups();
  };

  // Функция для изменения состояния добавления маркера
  const setIsAddingMarker = (value) => {
    if (onAddingMarkerToggle) {
      onAddingMarkerToggle(value);
    }
  };

  const {
    handleMapClick,
    showCreateModal,
    pendingMarker,
    handleCreateMarker,
    handleCancelCreate,
    cursorCoordinates,
  } = useMapInteractions(
    mapRef, 
    mapLoaded, 
    onMarkerAdd, 
    handleCloseAllPanels, 
    currentUserRole,
    isAddingMarkerExternal, // Передаем внешнее состояние
    setIsAddingMarker // Передаем функцию для изменения состояния
  );

  // Инициализация карты
  useEffect(() => {
    initializeMap();
  }, []);

  // Обновление маркеров
  useEffect(() => {
    updateMarkers();
  }, [markers, selectedMarker]);

  // Обработчик клика по карте
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const handleClick = (e) => {
      console.log('Map clicked, isAddingMarker:', isAddingMarkerExternal);
      handleMapClick(e);
    };

    mapRef.current.on('click', handleClick);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleClick);
      }
    };
  }, [isAddingMarkerExternal, mapLoaded, handleMapClick]);

  if (mapError) {
    return <MapErrorDisplay error={mapError} />;
  }

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <MapInfo
        markers={markers}
        currentUserEmail={currentUserEmail}
        mapLoaded={mapLoaded}
        isAddingMarker={isAddingMarkerExternal}
        selectedMarker={selectedMarker}
        isPanelOpen={isPanelOpen}
        onMarkerDelete={onMarkerDelete}
        onClosePanel={onClosePanel}
      />

      <CreateMarkerModal
        isVisible={showCreateModal}
        onClose={handleCancelCreate}
        onCreateMarker={handleCreateMarker}
        coordinates={pendingMarker}
      />

      {/* <CoordinatesDisplay
        coordinates={cursorCoordinates}
        isVisible={isAddingMarkerExternal}
      /> */}

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100vh',
          cursor: isAddingMarkerExternal ? 'crosshair' : 'default',
        }}
      />
    </div>
  );
};

export default MapView;