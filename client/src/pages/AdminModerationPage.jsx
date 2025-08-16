import React, { useState, useEffect } from 'react';
import { getCurrentUserEmail } from '../utils/auth';
import { moderationAPI } from '../utils/api';
import { moderationPageStyles as styles } from '../styles/moderationPageStyles';
import EditMarkerModal from '../components/EditMarkerModal';

const compactMarkerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  background: '#fff',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px',
  color: '#374151'
};

const AdminModerationPage = () => {
  const [unmoderatedMarkers, setUnmoderatedMarkers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingMarkers, setProcessingMarkers] = useState(new Set());
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [markersResponse, statsResponse] = await Promise.all([
        moderationAPI.getUnmoderated(),
        moderationAPI.getModerationStats()
      ]);

      setUnmoderatedMarkers(markersResponse.markers || []);
      setStats(statsResponse);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError(err.response?.data?.error || err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveMarker = async (markerId) => {
    if (processingMarkers.has(markerId)) return;

    try {
      setProcessingMarkers(prev => new Set([...prev, markerId]));
      await moderationAPI.approveMarker(markerId);

      setUnmoderatedMarkers(prev => prev.filter(marker => marker.id !== markerId));
      setStats(prev => prev ? {
        ...prev,
        moderated: prev.moderated + 1,
        unmoderated: prev.unmoderated - 1,
        moderationPercentage: Math.round(((prev.moderated + 1) / prev.total) * 100)
      } : null);

      if (selectedMarker?.id === markerId) {
        setSelectedMarker(null);
        setIsModalVisible(false);
      }
    } catch (err) {
      console.error('Ошибка подтверждения метки:', err);
      alert('Ошибка подтверждения метки: ' + (err.response?.data?.error || err.message));
    } finally {
      setProcessingMarkers(prev => {
        const newSet = new Set(prev);
        newSet.delete(markerId);
        return newSet;
      });
    }
  };

  const handleRejectMarker = async (markerId) => {
    if (processingMarkers.has(markerId)) return;

    if (!window.confirm('Вы уверены, что хотите удалить эту метку?')) return;

    try {
      setProcessingMarkers(prev => new Set([...prev, markerId]));
      await moderationAPI.rejectMarker(markerId);

      setUnmoderatedMarkers(prev => prev.filter(marker => marker.id !== markerId));
      setStats(prev => prev ? {
        ...prev,
        total: prev.total - 1,
        unmoderated: prev.unmoderated - 1,
        moderationPercentage: prev.total > 1 ? Math.round((prev.moderated / (prev.total - 1)) * 100) : 100
      } : null);

      if (selectedMarker?.id === markerId) {
        setSelectedMarker(null);
        setIsModalVisible(false);
      }
    } catch (err) {
      console.error('Ошибка отклонения метки:', err);
      alert('Ошибка отклонения метки: ' + (err.response?.data?.error || err.message));
    } finally {
      setProcessingMarkers(prev => {
        const newSet = new Set(prev);
        newSet.delete(markerId);
        return newSet;
      });
    }
  };

  const handleViewMarker = (marker) => {
    setSelectedMarker(marker);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMarker(null);
  };

  const handleUpdateMarker = async (markerId, updatedData) => {
    try {
      // Вызываем API для обновления метки
      await moderationAPI.updateMarker(markerId, updatedData);
      
      // Обновляем локальное состояние
      setUnmoderatedMarkers(prev => 
        prev.map(marker => 
          marker.id === markerId 
            ? { ...marker, ...updatedData }
            : marker
        )
      );
      
      console.log('Метка обновлена:', markerId, updatedData);
    } catch (error) {
      console.error('Ошибка обновления метки:', error);
      throw error;
    }
  };

  if (loading) {
    return <div style={styles.wrapper}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={styles.wrapper}>
        <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>
        <button style={styles.button} onClick={loadData}>Повторить</button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Панель модерації</h1>
          <p style={styles.subTitle}>Адміністратор: {getCurrentUserEmail()}</p>
        </div>
        <button style={styles.button} onClick={loadData}>Оновити</button>
      </header>



      <div>
        {unmoderatedMarkers.map(marker => (
          <div key={marker.id} style={compactMarkerStyle}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong>{marker.title}</strong>
                <button
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={() => handleViewMarker(marker)}
                  title="Просмотреть детали метки"
                >
                  👁️ Перегляд
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {marker.user_email || 'Автор неизвестен'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{ ...styles.button, background: '#16a34a', padding: '6px 10px' }}
                disabled={processingMarkers.has(marker.id)}
                onClick={() => handleApproveMarker(marker.id)}
                title="Одобрить метку"
              >
                ✅
              </button>
              <button
                style={{ ...styles.button, background: '#dc2626', padding: '6px 10px' }}
                disabled={processingMarkers.has(marker.id)}
                onClick={() => handleRejectMarker(marker.id)}
                title="Отклонить метку"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditMarkerModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onUpdateMarker={handleUpdateMarker}
        selectedMarker={selectedMarker}
      />
    </div>
  );
};

export default AdminModerationPage;