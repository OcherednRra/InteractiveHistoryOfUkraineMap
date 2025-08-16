export const panelStyles = {
  container: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '420px',
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
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  tab: {
    flex: 1,
    padding: '8px 12px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent'
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottom: '2px solid #059669',
    color: '#059669'
  },
  content: (isExpanded) => ({
    height: isExpanded ? '500px' : '0',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column'
  }),
  filtersScrollContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  resultsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0 // важно для корректной работы flex
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
    justifyContent: 'space-between',
    margin: '0 16px 12px 16px',
    flexShrink: 0
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
  separator: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '8px 0'
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
  },
  // Стили для выпадающего списка авторов
  authorDropdownContainer: {
    position: 'relative'
  },
  authorInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  authorInput: {
    padding: '8px 32px 8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    width: '100%',
    cursor: 'pointer'
  },
  dropdownArrow: (isOpen) => ({
    position: 'absolute',
    right: '8px',
    fontSize: '12px',
    color: '#6b7280',
    pointerEvents: 'none',
    transition: 'transform 0.2s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  }),
  authorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '150px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderTop: 'none',
    borderRadius: '0 0 6px 6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1001
  },
  authorOption: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #f3f4f6'
  },
  selectedAuthors: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px'
  },
  selectedAuthorTag: {
    backgroundColor: '#059669',
    color: 'white',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  removeAuthorButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultsList: {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#f9fafb',
    margin: '16px'
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
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '13px',
    fontStyle: 'italic',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBadge: {
    background: '#059669',
    color: 'white',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 'normal'
  },
  headerArrow: (isExpanded) => ({
    fontSize: '18px', 
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease'
  }),
  authorInputFocused: (isOpen) => ({
    borderColor: isOpen ? '#059669' : '#d1d5db'
  }),
  authorNotFound: {
    padding: '8px 12px',
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  resultItemMoreIndicator: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6b7280'
  },
  hiddenCount: {
    color: '#dc2626',
    marginLeft: '8px'
  }
};