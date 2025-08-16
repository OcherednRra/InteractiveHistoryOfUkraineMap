import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useInfoPanel } from '../../hooks/useInfoPanel.js';
import { infoPanelStyles } from '../../styles/infoPanelStyles.js';
import EditMarkerModal from '../EditMarkerModal.jsx';

const InfoPanel = ({
  selectedMarker,
  isVisible,
  onClose,
  currentUserEmail,
  currentUserRole,
  onMarkerDelete,
  onMarkerUpdate,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { error, isDeleting, handleDelete } = useInfoPanel(selectedMarker, null, onMarkerDelete, onClose);

     const style = document.createElement('style');
    style.textContent = markdownResetCSS;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch {
      return 'Невідома дата';
    }
  };

  const formatCoordinates = (lat, lng) => {
    return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`;
  };

  const formatTags = (tags) => {
    if (!tags || tags.trim() === '') return [];
    return tags.split(/\s+/).filter(tag => tag.length > 0);
  };

  const canEditMarker = selectedMarker && (
    selectedMarker.user_email === currentUserEmail || currentUserRole === 'admin'
  );

  const canDeleteMarker = canEditMarker;

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
  };

  const handleMarkerUpdate = async (markerId, updatedData) => {
    if (onMarkerUpdate) {
      await onMarkerUpdate(markerId, updatedData);
    }
  };

  console.log('InfoPanel Debug:', {
    selectedMarker: selectedMarker?.id,
    currentUserEmail,
    markerUserEmail: selectedMarker?.user_email,
    canEditMarker,
    canDeleteMarker
  });

  const markdownComponents = {
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || 'Зображення'}
        style={{
          maxWidth: '50%',
          height: 'auto',
          borderRadius: '8px',
          margin: '8px auto',
          display: 'block',
        }}
      />
    ),
    p: ({ children }) => (
      <p style={{ 
        margin: '0 0 6px 0',
        padding: '0',
        lineHeight: '1.5',
        fontSize: '14px',
        color: '#374151'
      }}>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#374151'
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '16px', 
        fontWeight: 'bold',
        color: '#374151'
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ 
        margin: '0 0 6px 0', 
        fontSize: '15px', 
        fontWeight: 'bold',
        color: '#374151'
      }}>
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul style={{ 
        margin: '0 0 6px 0', 
        paddingLeft: '20px' 
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{ 
        margin: '0 0 6px 0', 
        paddingLeft: '20px' 
      }}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{ 
        margin: '0 0 2px 0' 
      }}>
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ 
        margin: '0 0 6px 0', 
        paddingLeft: '12px', 
        borderLeft: '3px solid #d1d5db',
        fontStyle: 'italic',
        color: '#6b7280'
      }}>
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code style={{
        backgroundColor: '#f3f4f6',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '13px',
        fontFamily: 'monospace'
      }}>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre style={{
        backgroundColor: '#f3f4f6',
        padding: '12px',
        borderRadius: '6px',
        margin: '0 0 6px 0',
        overflow: 'auto',
        fontSize: '13px',
        fontFamily: 'monospace'
      }}>
        {children}
      </pre>
    )
  };

  return (
    <>
      <div style={infoPanelStyles.container(isVisible)}>
        <div style={{ ...infoPanelStyles.header, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {canEditMarker && (
              <button
                onClick={handleEditClick}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                title="Редагувати мітку"
              >
                ✏️
              </button>
            )}
            {canDeleteMarker && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.6 : 1,
                  transition: 'background-color 0.2s',
                }}
                title="Видалити мітку"
                onMouseEnter={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) e.target.style.backgroundColor = '#ef4444';
                }}
              >
                🗑
              </button>
            )}
          </div>
          <div>
            <button
              onClick={onClose}
              style={infoPanelStyles.closeButton}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={infoPanelStyles.content}>
          {selectedMarker ? (
            <>
              {error && (
                <div style={infoPanelStyles.errorMessage}>
                  {error}
                </div>
              )}
              
              <h2 style={infoPanelStyles.headerTitle}>
                {selectedMarker?.title || 'Без назви'}
              </h2>

              <div style={{
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '12px'
              }}>
                {selectedMarker.event_date || 'Немає дати'}
              </div>

              <div style={{
                ...infoPanelStyles.compactInfo,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                marginBottom: '12px',
                fontSize: '13px',
                color: '#374151',
                flexWrap: 'wrap'
              }}>
                <span>📍 {formatCoordinates(selectedMarker.latitude, selectedMarker.longitude)}</span>
                <span>•</span>
                <span>👤 {selectedMarker.user_email || 'Анонім'}</span>
                <span>•</span>
                <span>📅 {formatDate(selectedMarker.created_at)}</span>
              </div>

              <div style={infoPanelStyles.tagsContainer}>
                {formatTags(selectedMarker.tags).length > 0 ? (
                  formatTags(selectedMarker.tags).map((tag, index) => (
                    <span key={index} style={infoPanelStyles.tagBadge}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Немає тегів
                  </span>
                )}
              </div>

              <div style={infoPanelStyles.descriptionContainer}>
                <div style={{ 
                  ...infoPanelStyles.descriptionValue, 
                  flex: 1 
                }}>
                  {selectedMarker.description ? (
                    <div className="markdown-content">
                      <ReactMarkdown components={markdownComponents}>
                        {selectedMarker.description}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    'Немає опису'
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={infoPanelStyles.emptyState}>
              Виберіть мітку на карті
            </div>
          )}
        </div>
      </div>

      <EditMarkerModal
        isVisible={isEditModalVisible}
        onClose={handleEditModalClose}
        onUpdateMarker={handleMarkerUpdate}
        selectedMarker={selectedMarker}
      />
    </>
  );
};

export default InfoPanel;