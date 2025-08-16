import React, { useState } from 'react';

const MarkerFilterPanel = ({ 
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
  selectedTags,
  availableTags,
  onToggleTag,
  onClearTags,
  selectedAuthors,
  availableAuthors,
  onToggleAuthor,
  onClearAuthors,
  showOnlyMyMarkers,
  onShowOnlyMyMarkersChange,
  onClearFilters,
  hasActiveFilters,
  filterStats
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const panelStyles = {
    container: {
      position: 'absolute',
      top: '10px',
      right: '10px', // Размещаем справа, чтобы не пересекаться с панелью поиска
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
      maxHeight: isExpanded ? '500px' : '0',
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
    statsInfo: {
      padding: '8px 12px',
      backgroundColor: '#f3f4f6',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between'
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
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      maxHeight: '120px',
      overflowY: 'auto',
      padding: '4px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      backgroundColor: '#f9fafb'
    },
    tag: {
      padding: '4px 8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '12px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid transparent',
      userSelect: 'none'
    },
    selectedTag: {
      backgroundColor: '#059669',
      color: 'white',
      borderColor: '#047857'
    },
    authorContainer: {
      maxHeight: '100px',
      overflowY: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      backgroundColor: '#f9fafb'
    },
    authorItem: {
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4px'
    },
    clearSectionButton: {
      fontSize: '11px',
      color: '#6b7280',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  };

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={panelStyles.headerTitle}>
          ⚙️ Фільтри міток
          {hasActiveFilters && (
            <span style={{
              background: '#059669',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 'normal'
            }}>
              {filterStats.visible}
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
          <label style={panelStyles.label}>Рік події:</label>
          <div style={panelStyles.dateRow}>
            <input
              style={panelStyles.input}
              type="number"
              placeholder="З року (1900)"
              min="1900"
              max="2100"
              value={eventDateFrom}
              onChange={(e) => onEventDateFromChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <input
              style={panelStyles.input}
              type="number"
              placeholder="До року (2025)"
              min="1900"
              max="2100"
              value={eventDateTo}
              onChange={(e) => onEventDateToChange(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>

        <div style={panelStyles.inputGroup}>
          <div style={panelStyles.sectionHeader}>
            <label style={panelStyles.label}>Теги:</label>
            {selectedTags.length > 0 && (
              <span 
                style={panelStyles.clearSectionButton}
                onClick={onClearTags}
              >
                Очистити
              </span>
            )}
          </div>
          <div style={panelStyles.tagContainer}>
            {availableTags.map((tag) => (
              <span
                key={tag}
                style={{
                  ...panelStyles.tag,
                  ...(selectedTags.includes(tag) ? panelStyles.selectedTag : {})
                }}
                onClick={() => onToggleTag(tag)}
                onMouseEnter={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.target.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                {tag}
              </span>
            ))}
            {availableTags.length === 0 && (
              <span style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                Тегів не знайдено
              </span>
            )}
          </div>
        </div>

        <div style={panelStyles.inputGroup}>
          <div style={panelStyles.sectionHeader}>
            <label style={panelStyles.label}>Автори:</label>
            {selectedAuthors.length > 0 && (
              <span 
                style={panelStyles.clearSectionButton}
                onClick={onClearAuthors}
              >
                Очистити
              </span>
            )}
          </div>
          <div style={panelStyles.authorContainer}>
            {availableAuthors.map((author) => (
              <div
                key={author}
                style={panelStyles.authorItem}
                onClick={() => onToggleAuthor(author)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <input
                  type="checkbox"
                  checked={selectedAuthors.includes(author)}
                  onChange={() => {}} // Контролируется через onClick
                  style={{ pointerEvents: 'none' }}
                />
                <span>{author}</span>
              </div>
            ))}
            {availableAuthors.length === 0 && (
              <div style={{ 
                padding: '8px 12px', 
                fontSize: '12px', 
                color: '#6b7280', 
                fontStyle: 'italic' 
              }}>
                Авторів не знайдено
              </div>
            )}
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

        <div style={panelStyles.statsInfo}>
          <span>
            Видимих: {filterStats.visible} / {filterStats.total}
            {filterStats.hidden > 0 && (
              <span style={{ color: '#dc2626', marginLeft: '8px' }}>
                (приховано: {filterStats.hidden})
              </span>
            )}
          </span>
          {hasActiveFilters && (
            <button
              style={panelStyles.clearButton}
              onClick={onClearFilters}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Скинути все
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkerFilterPanel;