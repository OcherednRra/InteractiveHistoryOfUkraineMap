import React from 'react';
import { infoPanelStyles } from '../../styles/infoPanelStyles.js';

const MarkerInfoDisplay = ({ selectedMarker, currentUserEmail, formatDate }) => {
  const isOwner = selectedMarker?.user_email === currentUserEmail;

  return (
    <>
      {/* Координати */}
      <div style={infoPanelStyles.fieldContainer}>
        <label style={infoPanelStyles.fieldLabel}>
          Координати:
        </label>
        <div style={infoPanelStyles.coordinatesValue}>
          {selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)}
        </div>
      </div>

      {/* Автор */}
      <div style={infoPanelStyles.fieldContainer}>
        <label style={infoPanelStyles.fieldLabel}>
          Автор:
        </label>
        <div style={infoPanelStyles.authorContainer}>
          <span style={infoPanelStyles.authorEmail}>{selectedMarker.user_email}</span>
          {isOwner && (
            <span style={infoPanelStyles.ownerBadge}>
              Ваша мітка
            </span>
          )}
        </div>
      </div>

      {/* Дата створення */}
      <div style={{ ...infoPanelStyles.fieldContainer, marginBottom: '20px' }}>
        <label style={infoPanelStyles.fieldLabel}>
          Створено:
        </label>
        <div style={infoPanelStyles.fieldValue}>
          {formatDate(selectedMarker.created_at)}
        </div>
      </div>
    </>
  );
};

export default MarkerInfoDisplay;