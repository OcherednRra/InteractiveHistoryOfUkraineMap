export const moderationPageStyles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '40px 20px',
    fontFamily: `'Inter', sans-serif`,
    boxSizing: 'border-box'
  },

  header: {
    background: '#fff',
    padding: '20px 30px',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },

  subTitle: {
    fontSize: '14px',
    color: '#6b7280'
  },

  button: {
    background: '#2563eb',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  },

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    margin: '30px 0'
  },

  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },

  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px'
  },

  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827'
  },

  markerCard: {
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    padding: '20px',
    transition: 'background 0.2s',
    cursor: 'default'
  },

  markerCardHover: {
    background: '#f3f4f6'
  },

  markerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '8px'
  },

  markerMeta: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },

  markerDescription: {
    fontSize: '14px',
    color: '#374151'
  }
};
