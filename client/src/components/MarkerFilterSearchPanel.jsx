import React, { useState, useRef, useEffect } from 'react';
import { panelStyles } from '../styles/MarkerFilterSearchPanelStyles.js';

const MarkerFilterSearchPanel = ({ 
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
  filterStats,
  filteredMarkers,
  onMarkerSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('filters');
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  
  const authorDropdownRef = useRef(null);
  const authorInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authorDropdownRef.current && !authorDropdownRef.current.contains(event.target)) {
        setIsAuthorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredAuthors = availableAuthors.filter(author => 
    author.toLowerCase().includes(authorSearchQuery.toLowerCase())
  );

  const handleAuthorInputClick = () => {
    setIsAuthorDropdownOpen(!isAuthorDropdownOpen);
  };

  const handleAuthorSearch = (e) => {
    setAuthorSearchQuery(e.target.value);
    if (!isAuthorDropdownOpen) {
      setIsAuthorDropdownOpen(true);
    }
  };

  const handleAuthorSelect = (author) => {
    onToggleAuthor(author);
    setAuthorSearchQuery('');
  };

  const removeAuthor = (author) => {
    onToggleAuthor(author);
  };

  const renderFiltersTab = () => (
    <div style={panelStyles.filtersScrollContainer}>
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

      <div style={panelStyles.separator}></div>

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
        <div style={panelStyles.sectionHeader}>
          <label style={panelStyles.label}>Автор:</label>
          {selectedAuthors.length > 0 && (
            <span 
              style={panelStyles.clearSectionButton}
              onClick={onClearAuthors}
            >
              Очистити
            </span>
          )}
        </div>
        
        <div style={panelStyles.authorDropdownContainer} ref={authorDropdownRef}>
          <div style={panelStyles.authorInputWrapper}>
            <input
              ref={authorInputRef}
              style={{
                ...panelStyles.authorInput,
                ...panelStyles.authorInputFocused(isAuthorDropdownOpen)
              }}
              type="text"
              placeholder="Виберіть автора..."
              value={authorSearchQuery}
              onChange={handleAuthorSearch}
              onClick={handleAuthorInputClick}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => {
                if (!isAuthorDropdownOpen) {
                  e.target.style.borderColor = '#d1d5db';
                }
              }}
            />
            <span style={panelStyles.dropdownArrow(isAuthorDropdownOpen)}>
              ▼
            </span>
          </div>
          
          {isAuthorDropdownOpen && (
            <div style={panelStyles.authorDropdown}>
              {filteredAuthors.length > 0 ? (
                filteredAuthors.map((author) => (
                  <div
                    key={author}
                    style={panelStyles.authorOption}
                    onClick={() => handleAuthorSelect(author)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAuthors.includes(author)}
                      onChange={() => {}}
                      style={{ pointerEvents: 'none' }}
                    />
                    <span>{author}</span>
                  </div>
                ))
              ) : (
                <div style={panelStyles.authorNotFound}>
                  {authorSearchQuery ? 'Авторів не знайдено' : 'Немає доступних авторів'}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedAuthors.length > 0 && (
          <div style={panelStyles.selectedAuthors}>
            {selectedAuthors.map((author) => (
              <div key={author} style={panelStyles.selectedAuthorTag}>
                <span>{author}</span>
                <button
                  style={panelStyles.removeAuthorButton}
                  onClick={() => removeAuthor(author)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <label style={panelStyles.checkbox}>
        <input
          type="checkbox"
          checked={showOnlyMyMarkers}
          onChange={(e) => onShowOnlyMyMarkersChange(e.target.checked)}
        />
        Тільки мої мітки
      </label>
    </div>
  );

  const renderResultsTab = () => (
    <div style={panelStyles.resultsContainer}>
      {filteredMarkers.length > 0 ? (
        <div style={panelStyles.resultsList}>
          {filteredMarkers.slice(0, 50).map((marker) => (
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
                {marker.tags && ` • ${marker.tags}`}
              </div>
            </div>
          ))}
          {filteredMarkers.length > 50 && (
            <div style={{
              ...panelStyles.resultItem,
              ...panelStyles.resultItemMoreIndicator
            }}>
              ... і ще {filteredMarkers.length - 50} меток
            </div>
          )}
        </div>
      ) : (
        <div style={panelStyles.emptyState}>
          {hasActiveFilters ? (
            <>
              <div>🔍 Нічого не знайдено</div>
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                Спробуйте змінити критерії пошуку
              </div>
            </>
          ) : (
            <>
              <div>📍 Всі мітки</div>
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                Використайте фільтри для пошуку
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={panelStyles.headerTitle}>
          🔍 Пошук і фільтри
          {hasActiveFilters && (
            <span style={panelStyles.headerBadge}>
              {filterStats.visible}
            </span>
          )}
        </h3>
        <span style={panelStyles.headerArrow(isExpanded)}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={panelStyles.tabs}>
          <div
            style={{
              ...panelStyles.tab,
              ...(activeTab === 'filters' ? panelStyles.activeTab : {})
            }}
            onClick={() => setActiveTab('filters')}
          >
            ⚙️ Фільтри
          </div>
          <div
            style={{
              ...panelStyles.tab,
              ...(activeTab === 'results' ? panelStyles.activeTab : {})
            }}
            onClick={() => setActiveTab('results')}
          >
            📋 Результати ({filterStats.visible})
          </div>
        </div>
      )}

      <div style={panelStyles.content(isExpanded)}>
        {activeTab === 'filters' ? renderFiltersTab() : renderResultsTab()}

        <div style={panelStyles.statsInfo}>
          <span>
            Видимих: {filterStats.visible} / {filterStats.total}
            {filterStats.hidden > 0 && (
              <span style={panelStyles.hiddenCount}>
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

export default MarkerFilterSearchPanel;