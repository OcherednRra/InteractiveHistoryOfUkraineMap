import React, { useState, useEffect, useMemo } from 'react';

const MarkerSearchPanel = ({ 
  markers = [], 
  onMarkerSelect, 
  currentUserEmail,
  searchQuery,
  onSearchQueryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  eventDateFrom,
  onEventDateFromChange,
  eventDateTo,
  onEventDateToChange,
  showOnlyMyMarkers,
  onShowOnlyMyMarkersChange,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Панель згорнута за замовчуванням

  // Функция поиска и фильтрации меток
  const filteredMarkers = useMemo(() => {
    if (!markers || markers.length === 0) return [];

    return markers.filter((marker) => {
      // Поиск по тексту (название, теги, описание)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (marker.title || '').toLowerCase();
        const tags = (marker.tags || '').toLowerCase();
        const description = (marker.description || '').toLowerCase();
        
        const matchesText = title.includes(query) || 
                           tags.includes(query) || 
                           description.includes(query);
        
        if (!matchesText) return false;
      }

      // Фильтр по дате создания
      if (dateFrom || dateTo) {
        const createdDate = new Date(marker.created_at);
        if (dateFrom && createdDate < new Date(dateFrom)) return false;
        if (dateTo && createdDate > new Date(dateTo + 'T23:59:59')) return false;
      }

      // Фильтр по дате события (текстовый поиск)
      if (eventDateFrom || eventDateTo) {
        const eventDate = marker.event_date || '';
        // Простая проверка на вхождение года/даты в текст
        if (eventDateFrom && !eventDate.includes(eventDateFrom)) return false;
        if (eventDateTo && !eventDate.includes(eventDateTo)) return false;
      }

      // Фильтр "только мои метки"
      if (showOnlyMyMarkers && marker.user_email !== currentUserEmail) {
        return false;
      }

      return true;
    });
  }, [markers, searchQuery, dateFrom, dateTo, eventDateFrom, eventDateTo, showOnlyMyMarkers, currentUserEmail]);

  // Уведомляем родительский компонент об изменении фильтрованных меток
  useEffect(() => {
    // Больше не нужно, так как фильтрация происходит в useMarkerSearch
  }, [filteredMarkers]);

  const panelStyles = {
    container: {
      position: 'absolute',
      top: '10px', // Змінили відступ зверху, оскільки кнопки "Пошук" більше немає
      left: '10px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '320px',
      maxWidth: '400px',
    },
    header: {
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      userSelect: 'none'
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    content: {
      padding: isExpanded ? '16px' : '0',
      maxHeight: isExpanded ? '400px' : '0',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    dateRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#374151'
    },
    resultsInfo: {
      padding: '8px 12px',
      backgroundColor: '#f3f4f6',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    clearButton: {
      padding: '6px 12px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    resultsList: {
      maxHeight: '150px',
      overflowY: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      backgroundColor: '#f9fafb'
    },
    resultItem: {
      padding: '8px 12px',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      fontSize: '13px'
    },
    resultTitle: {
      fontWeight: '500',
      color: '#374151',
      marginBottom: '2px'
    },
    resultMeta: {
      fontSize: '11px',
      color: '#6b7280'
    }
  };

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={panelStyles.headerTitle}>
          🔍 Пошук міток
          {hasActiveFilters && (
            <span style={{
              background: '#dc2626',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 'normal'
            }}>
              {filteredCount}
            </span>
          )}
        </h3>
        <span style={{ 
          fontSize: '18px', 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </div>

      <div style={panelStyles.content}>
        <div style={panelStyles.inputGroup}>
          <label style={panelStyles.label}>Пошук по тексту:</label>
          <input
            style={panelStyles.input}
            type="text"
            placeholder="Назва, теги або опис..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#059669'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={panelStyles.inputGroup}>
          <label style={panelStyles.label}>Дата створення:</label>
          <div style={panelStyles.dateRow}>
            <input
              style={panelStyles.input}
              type="date"
              placeholder="З дати"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <input
              style={panelStyles.input}
              type="date"
              placeholder="До дати"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>

        <div style={panelStyles.inputGroup}>
          <label style={panelStyles.label}>Рік або період події:</label>
          <div style={panelStyles.dateRow}>
            <input
              style={{...panelStyles.input, width: '155px'}}
              type="text"
              placeholder="Наприклад: 1945"
              value={eventDateFrom}
              onChange={(e) => onEventDateFromChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <input
              style={{...panelStyles.input, width: '155px'}}
              type="text"
              placeholder="До року"
              value={eventDateTo}
              onChange={(e) => onEventDateToChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>

        <label style={panelStyles.checkbox}>
          <input
            type="checkbox"
            checked={showOnlyMyMarkers}
            onChange={(e) => onShowOnlyMyMarkersChange(e.target.checked)}
          />
          Тільки мої мітки
        </label>

        <div style={panelStyles.resultsInfo}>
          <span>
            Знайдено: {filteredCount} з {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              style={panelStyles.clearButton}
              onClick={onClearFilters}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Очистити
            </button>
          )}
        </div>

        {filteredCount > 0 && filteredCount < totalCount && (
          <div style={panelStyles.resultsList}>
            {filteredMarkers.slice(0, 5).map((marker) => (
              <div
                key={marker.id}
                style={panelStyles.resultItem}
                onClick={() => onMarkerSelect && onMarkerSelect(marker)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={panelStyles.resultTitle}>
                  {marker.title || 'Без назви'}
                </div>
                <div style={panelStyles.resultMeta}>
                  {marker.user_email} • {marker.event_date || 'Без дати'}
                </div>
              </div>
            ))}
            {filteredCount > 5 && (
              <div style={{
                ...panelStyles.resultItem,
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#6b7280'
              }}>
                ... і ще {filteredCount - 5} меток
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkerSearchPanel;