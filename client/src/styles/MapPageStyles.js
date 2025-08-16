// Стили для страницы карты
export const mapPageStyles = {
  // Основной контейнер
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  },

  // Стили загрузки
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    flexDirection: 'column',
    gap: '20px'
  },

  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  // Стили ошибки
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    textAlign: 'center'
  },

  errorMessage: {
    color: '#dc2626',
    fontSize: '18px',
    marginBottom: '20px',
    maxWidth: '600px',
    lineHeight: '1.5'
  },

  errorButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  buttonRetry: {
    background: '#059669',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  buttonLogoutError: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  // Стили кнопки добавления маркера
  addMarkerContainer: {
    position: 'absolute',
    top: '11px',
    left: '450px',  // Вместо left: '50%'
    // transform: 'translateX(-50%)', // Убрать эту строку
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Вместо 'center'
    gap: '8px'
    },

  addMarkerButton: {
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  addMarkerButtonActive: {
    background: '#dc2626'
  },

  addMarkerButtonInactive: {
    background: '#059669'
  },

  addMarkerButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6
  },

  addMarkerButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
  },

  addMarkerHint: {
    background: 'rgba(220, 38, 38, 0.9)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    whiteSpace: 'nowrap'
  },

  // Стили кнопки выхода
  logoutButton: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 1001,
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  },

  logoutButtonHover: {
    background: '#b91c1c',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
  }
};

// CSS для анимации спиннера (нужно добавить в head документа)
export const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Функция для добавления стилей анимации в документ
export const injectSpinnerStyles = () => {
  if (!document.querySelector('#spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'spinner-styles';
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
  }
};