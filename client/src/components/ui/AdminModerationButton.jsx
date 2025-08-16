// components/ui/AdminModerationButton.jsx
import React from 'react';
import { getCurrentUserRole } from '../../utils/auth';

const AdminModerationButton = () => {
  const userRole = getCurrentUserRole();
  
  // Показываем кнопку только админам
  if (userRole !== 'admin') {
    return null;
  }

  const handleClick = () => {
    window.location.href = '/admin/moderation';
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '115px', // Справа от панели поиска
        zIndex: 1000,
        background: '#7c3aed',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#6d28d9';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#7c3aed';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
    >
      <span>Модерація</span>
    </button>
  );
};

export default AdminModerationButton;