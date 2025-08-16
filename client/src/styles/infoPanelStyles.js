export const infoPanelStyles = {
  container: (isVisible) => ({
    position: 'fixed',
    top: 0,
    right: isVisible ? 0 : '-700px',
    width: '700px',
    height: '100vh',
    background: 'white',
    boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    transition: 'right 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    pointerEvents: isVisible ? 'auto' : 'none',
    willChange: 'right'
  }),

  header: {
    background: '#059669',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0
  },

  headerTitle: {
    margin: 0,
    fontSize: '24px',
    marginBottom: '16px',
    textAlign: 'center',
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
  },

  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  compactInfo: {
    marginBottom: '16px'
  },

  metaInfo: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.4',
    wordBreak: 'break-all'
  },

  descriptionContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  descriptionValue: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    flex: 1
  },

  errorMessage: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px'
  },

  fieldContainer: {
    marginBottom: '15px'
  },

  fieldLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '5px'
  },

  fieldValue: {
    background: '#f9fafb',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px'
  },

  coordinatesValue: {
    background: '#f9fafb',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontFamily: 'monospace',
    wordBreak: 'break-all'
  },

  textarea: (isLoading) => ({
    width: '100%',
    minHeight: '100px',
    padding: '10px',
    border: '2px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    opacity: isLoading ? 0.6 : 1,
    boxSizing: 'border-box'
  }),

  charCounter: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '5px',
    textAlign: 'right'
  },

  authorContainer: {
    background: '#f9fafb',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '5px'
  },

  authorEmail: {
    wordBreak: 'break-word',
    flex: 1
  },

  ownerBadge: {
    background: '#059669',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },

  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '15px'
  },

  button: (bgColor, isLoading, isDisabled = false) => ({
    background: isLoading || isDisabled ? '#9ca3af' : bgColor,
    color: 'white',
    border: 'none',
    padding: '12px 15px',
    borderRadius: '6px',
    cursor: isLoading || isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px'
  }),

  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#6b7280',
    fontSize: '16px'
  },

  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '12px'
  },

  tagBadge: {
    background: '#059669',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },

  markdownParagraph: {
    marginBottom: '0px', // Зменшуємо відступ між абзацами
    lineHeight: '1.6',
    fontSize: '14px',
    color: '#374151'
  }
};