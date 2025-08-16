import React, { useState } from 'react';
import { getCurrentUserEmail, getCurrentUserRole } from '../../utils/auth';

// Цвета иконок из markerElement.js
const ICON_COLORS = {
  battle: '#dc2626',      // красный - для сражений
  fleet: '#1d4ed8',       // синий - для флота
  memorial: '#374151',    // темно-серый - для памятных мест
  treaty: '#7c3aed',      // фиолетовый - для договоров
  photo: '#ea580c',       // оранжевый - для фото
  birthplace: '#059669',  // зеленый - для мест рождения
  death: '#991b1b',       // темно-красный - для смерти
  unknown: '#6b7280',     // серый - для неизвестного
  celebrity: '#f59e0b',   // золотой - для знаменитостей
  invention: '#0891b2'    // циан - для изобретений
};

// SVG иконки из markerElement.js
const IconSVG = ({ iconName, size = 16 }) => {
  const iconColor = ICON_COLORS[iconName] || ICON_COLORS.unknown;
  
  const icons = {
    battle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
        <line x1="13" x2="19" y1="19" y2="13"/>
        <line x1="16" x2="20" y1="16" y2="20"/>
        <line x1="19" x2="21" y1="21" y2="19"/>
        <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
        <line x1="5" x2="9" y1="14" y2="18"/>
        <line x1="7" x2="4" y1="17" y2="20"/>
        <line x1="3" x2="5" y1="19" y2="21"/>
      </svg>
    ),
    fleet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/>
        <path d="M12 22V8"/>
        <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
      </svg>
    ),
    memorial: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.5 17-.5-1-.5 1h1z"/>
        <path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/>
        <circle cx="15" cy="12" r="1"/>
        <circle cx="9" cy="12" r="1"/>
      </svg>
    ),
    treaty: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    photo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
    birthplace: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    death: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </svg>
    ),
    unknown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <path d="M12 17h.01"/>
      </svg>
    ),
    celebrity: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    invention: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )
  };

  return icons[iconName] || icons.unknown;
};

export const MapInfo = ({
  markers,
  mapLoaded,
  isAddingMarker,
  selectedMarker,
  isPanelOpen
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const userEmail = getCurrentUserEmail();
  const userMarkersCount = markers
    ? markers.filter(marker => marker.user_email === userEmail).length
    : 0;

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const legendItems = [
    { icon: 'battle', text: '- битва/війна' },
    { icon: 'fleet', text: '- битва на воді' },
    { icon: 'memorial', text: '- місце смерті' },
    { icon: 'treaty', text: "- договори/перемир'я" },
    { icon: 'photo', text: '- історичне фото' },
    { icon: 'birthplace', text: '- місце народження' },
    { icon: 'death', text: "- місце пам'ятнику" },
    { icon: 'unknown', text: '- цікавинка' },
    { icon: 'celebrity', text: '- видатна подія' },
    { icon: 'invention', text: '- важливий винахід' }
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '20px',
      zIndex: 1000,
      background: '#059669',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      fontSize: '14px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: '260px',
      maxWidth: '300px',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      border: '1px solid #059669'
    }}>
      {/* Header */}
      <div 
        onClick={togglePanel}
        style={{
          padding: '16px',
          background: 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          userSelect: 'none',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
      >
        <span>Легенда карти</span>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '16px'
        }}>
          ▼
        </span>
      </div>

      {/* Content */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '20px' }}>
          {/* Legend Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gap: '6px' }}>
              {legendItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 0',
                  fontSize: '13px',
                  color: '#2d3748'
                }}>
                  <div style={{ 
                    marginRight: '10px', 
                    display: 'flex', 
                    alignItems: 'center',
                    minWidth: '20px'
                  }}>
                    <IconSVG iconName={item.icon} size={18} />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: '#4a5568',
              fontSize: '16px',
              fontWeight: '600',
              borderBottom: '2px solid #059669',
              paddingBottom: '8px'
            }}>
              Статистика
            </h4>
            <div style={{ display: 'grid', gap: '4px' }}>
              <div style={{
                background: 'linear-gradient(45deg, #48bb78, #38a169)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Всього міток:</span>
                <strong>{markers ? markers.length : 0}</strong>
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #4299e1, #3182ce)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Ваші мітки:</span>
                <strong>{userMarkersCount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};