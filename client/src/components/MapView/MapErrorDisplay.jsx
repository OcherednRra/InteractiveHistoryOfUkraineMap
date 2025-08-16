import React from 'react';

export const MapErrorDisplay = ({ error }) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Ошибка карты</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Перезагрузить страницу
        </button>
      </div>
    </div>
  );
};
