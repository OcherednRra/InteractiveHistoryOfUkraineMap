import mapboxgl from 'mapbox-gl';

export const createMarkerPopup = (markerData, currentUserEmail, onShowDetails) => {
  const popup = new mapboxgl.Popup({ 
    offset: 25,
    closeButton: true,
    closeOnClick: false
  }).setHTML(`
    <div style="padding: 12px; max-width: 200px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937; text-align: center;">${markerData.description}</h3>
      <div style="text-align: center;">
        <button 
          id="details-btn-${markerData.id}" 
          style="
            background: #059669; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#047857'"
          onmouseout="this.style.backgroundColor='#059669'"
        >
          Детальніше
        </button>
      </div>
    </div>
  `);

  // Добавляем обработчик после создания попапа
  popup.on('open', () => {
    const button = document.getElementById(`details-btn-${markerData.id}`);
    if (button) {
      button.addEventListener('click', () => {
        // Вызываем callback для показа деталей
        if (onShowDetails) {
          onShowDetails(markerData);
        }
        // Закрываем попап
        popup.remove();
      });
    }
  });

  return popup;
};