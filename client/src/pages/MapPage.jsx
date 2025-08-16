import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import InfoPanel from '../components/InfoPanel';
import { MapInfo } from '../components/MapView/MapInfo';
import AdminModerationButton from '../components/ui/AdminModerationButton';
import MarkerFilterSearchPanel from '../components/MarkerFilterSearchPanel';
import { useMarkerFilterSearch } from '../hooks/useMarkerFilterSearch';
import { markersAPI, isAuthenticated, logout, getCurrentUser } from '../utils/api';
import { getCurrentUserEmail, getCurrentUserRole } from '../utils/auth';
import { mapPageStyles, injectSpinnerStyles } from '../styles/MapPageStyles';

export default function MapPage() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const navigate = useNavigate();

  const {
    searchQuery,
    setSearchQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    eventDateFrom,
    setEventDateFrom,
    eventDateTo,
    setEventDateTo,
    selectedTags,
    selectedAuthors,
    showOnlyMyMarkers,
    setShowOnlyMyMarkers,
    availableTags,
    availableAuthors,
    markerVisibilityMap,
    filteredMarkers,
    hasActiveFilters,
    filterStats,
    clearAllFilters,
    toggleTag,
    clearTags,
    toggleAuthor,
    clearAuthors
  } = useMarkerFilterSearch(markers, getCurrentUserEmail());

  useEffect(() => {
    injectSpinnerStyles();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = getCurrentUser();
    setCurrentUser(user);
    
    const emailFromToken = getCurrentUserEmail();
    
    loadMarkers();
  }, [navigate]);

  const loadMarkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await markersAPI.getAll();
      setMarkers(response.markers || []);
      
    } catch (error) {
      console.error('Помилка завантаження міток:', error);
      setError('Помилка завантаження міток: ' + (error.response?.data?.error || error.message));
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerAdd = async (markerData) => {
    try {
      
      const response = await markersAPI.create(markerData);
      
      
      setMarkers(prevMarkers => [response.marker, ...prevMarkers]);
      
      return { success: true, message: 'Мітка успішно додана!' };
    } catch (error) {
      console.error('Помилка додавання мітки:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      
      throw error;
    }
  };

  const handleMarkerUpdate = async (markerId, updateData) => {
    try {
      
      const response = await markersAPI.update(markerId, updateData);
      
      setMarkers(prevMarkers => 
        prevMarkers.map(marker => 
          marker.id === markerId ? response.marker : marker
        )
      );
      
      if (selectedMarker && selectedMarker.id === markerId) {
        setSelectedMarker(response.marker);
      }
      
      return { success: true, message: 'Мітка успішно оновлена!' };
    } catch (error) {
      console.error('Помилка оновлення мітки:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      
      throw error;
    }
  };

  const handleMarkerDelete = async (markerId) => {
    try {
      
      await markersAPI.delete(markerId);
      
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
      
      if (selectedMarker && selectedMarker.id === markerId) {
        setSelectedMarker(null);
        setShowInfoPanel(false);
      }
      
      return { success: true, message: 'Мітка успішно видалена!' };
    } catch (error) {
      console.error('Помилка видалення мітки:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      
      throw error;
    }
  };

  const handleMarkerSelect = (marker) => {
    setSelectedMarker(marker);
    setShowInfoPanel(true);
  };

  const handleFilterPanelMarkerSelect = (marker) => {
    handleMarkerSelect(marker);
  };

  const handleCloseInfoPanel = () => {
    setShowInfoPanel(false);
    setSelectedMarker(null);
  };

  const handleLogout = () => {
    if (window.confirm('Ви впевнені, що хочете вийти?')) {
      logout();
      navigate('/login');
    }
  };

  const handleToggleAddMarker = () => {
    const newState = !isAddingMarker;
    setIsAddingMarker(newState);
    
    if (newState && showInfoPanel) {
      setShowInfoPanel(false);
      setSelectedMarker(null);
    }
  };

  const canAddMarkers = () => {
    const userRole = getCurrentUserRole();
    return userRole === 'admin' || userRole === 'editor';
  };

  const finalMarkers = markers.map(marker => ({
    ...marker,
    opacity: markerVisibilityMap.get(marker.id) || 1
  }));

  const getAddMarkerButtonStyle = () => {
    const baseStyle = { ...mapPageStyles.addMarkerButton };
    
    if (loading) {
      return { ...baseStyle, ...mapPageStyles.addMarkerButtonDisabled };
    }
    
    if (isAddingMarker) {
      return { ...baseStyle, ...mapPageStyles.addMarkerButtonActive };
    }
    
    return { ...baseStyle, ...mapPageStyles.addMarkerButtonInactive };
  };

  if (loading) {
    return (
      <div style={mapPageStyles.loadingContainer}>
        <div style={mapPageStyles.loadingSpinner}></div>
        <div>Завантаження карти...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={mapPageStyles.errorContainer}>
        <div style={mapPageStyles.errorMessage}>
          {error}
        </div>
        <div style={mapPageStyles.errorButtons}>
          <button 
            onClick={loadMarkers}
            style={mapPageStyles.buttonRetry}
          >
            🔄 Спробувати знову
          </button>
          <button 
            onClick={handleLogout}
            style={mapPageStyles.buttonLogoutError}
          >
            🚪 Вийти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={mapPageStyles.container}>
      <MapView
        markers={finalMarkers}
        onMarkerAdd={handleMarkerAdd}
        onMarkerDelete={handleMarkerDelete}
        onMarkerUpdate={handleMarkerUpdate}
        onMarkerSelect={handleMarkerSelect}
        currentUserEmail={getCurrentUserEmail()}
        currentUserRole={getCurrentUserRole()}
        isPanelOpen={showInfoPanel}
        onClosePanel={handleCloseInfoPanel}
        selectedMarker={selectedMarker}
        onAddingMarkerToggle={setIsAddingMarker}
        isAddingMarkerExternal={isAddingMarker}
      />
      
      <MarkerFilterSearchPanel
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        eventDateFrom={eventDateFrom}
        onEventDateFromChange={setEventDateFrom}
        eventDateTo={eventDateTo}
        onEventDateToChange={setEventDateTo}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        selectedAuthors={selectedAuthors}
        availableAuthors={availableAuthors}
        onToggleAuthor={toggleAuthor}
        onClearAuthors={clearAuthors}
        showOnlyMyMarkers={showOnlyMyMarkers}
        onShowOnlyMyMarkersChange={setShowOnlyMyMarkers}
        onClearFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        filterStats={filterStats}
        filteredMarkers={filteredMarkers}
        onMarkerSelect={handleFilterPanelMarkerSelect}
      />

      <InfoPanel
        selectedMarker={selectedMarker}
        isVisible={showInfoPanel}
        onClose={handleCloseInfoPanel}
        onMarkerUpdate={handleMarkerUpdate}
        onMarkerDelete={handleMarkerDelete}
        currentUserEmail={getCurrentUserEmail()}
        currentUserRole={getCurrentUserRole()}
      />

      <AdminModerationButton />

        <div style={mapPageStyles.addMarkerContainer}>
          <button
            onClick={handleToggleAddMarker}
            disabled={loading}
            style={getAddMarkerButtonStyle()}
            onMouseEnter={(e) => {
              if (!loading) {
                Object.assign(e.target.style, mapPageStyles.addMarkerButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                const baseStyle = getAddMarkerButtonStyle();
                Object.assign(e.target.style, baseStyle);
              }
            }}
          >
            <span>{isAddingMarker ? 'Скасувати' : 'Додати мітку'}</span>
          </button>
          
        </div>
      

      <button
        onClick={handleLogout}
        style={mapPageStyles.logoutButton}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, mapPageStyles.logoutButtonHover);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, mapPageStyles.logoutButton);
        }}
      >
        <span>Вийти</span>
      </button>
    </div>
  );
}