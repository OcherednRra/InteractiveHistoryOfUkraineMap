// Определяем SVG пути для каждой иконки (точные пути из lucide-react)
const ICON_PATHS = {
  battle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords-icon lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>', // Swords
  fleet: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>', // Anchor
  memorial: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skull-icon lucide-skull"><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/></svg>', // Skull
  treaty: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>', // FileText
  photo: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>', // Camera
  birthplace: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>', // Home
  death: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', // X
  unknown: '<circle cx="12" cy="12" r="10"/><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>', // HelpCircle
  celebrity: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>', // Star
  invention: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' // Wrench
};

// Определяем цвета для каждого типа иконки
const ICON_COLORS = {
  battle: {
    normal: '#dc2626',      // красный - для сражений
    selected: '#b91c1c',   // темно-красный
    shadow: 'rgba(220, 38, 38, 0.4)'
  },
  fleet: {
    normal: '#1d4ed8',      // синий - для флота
    selected: '#1e40af',    // темно-синий
    shadow: 'rgba(29, 78, 216, 0.4)'
  },
  memorial: {
    normal: '#374151',      // темно-серый - для памятных мест
    selected: '#1f2937',    // очень темно-серый
    shadow: 'rgba(55, 65, 81, 0.4)'
  },
  treaty: {
    normal: '#7c3aed',      // фиолетовый - для договоров
    selected: '#6d28d9',    // темно-фиолетовый
    shadow: 'rgba(124, 58, 237, 0.4)'
  },
  photo: {
    normal: '#ea580c',      // оранжевый - для фото
    selected: '#c2410c',    // темно-оранжевый
    shadow: 'rgba(234, 88, 12, 0.4)'
  },
  birthplace: {
    normal: '#059669',      // зеленый - для мест рождения
    selected: '#047857',    // темно-зеленый
    shadow: 'rgba(5, 150, 105, 0.4)'
  },
  death: {
    normal: '#991b1b',      // темно-красный - для смерти
    selected: '#7f1d1d',    // очень темно-красный
    shadow: 'rgba(153, 27, 27, 0.4)'
  },
  unknown: {
    normal: '#6b7280',      // серый - для неизвестного
    selected: '#4b5563',    // темно-серый
    shadow: 'rgba(107, 114, 128, 0.4)'
  },
  celebrity: {
    normal: '#f59e0b',      // золотой - для знаменитостей
    selected: '#d97706',    // темно-золотой
    shadow: 'rgba(245, 158, 11, 0.4)'
  },
  invention: {
    normal: '#0891b2',      // циан - для изобретений
    selected: '#0e7490',    // темно-циан
    shadow: 'rgba(8, 145, 178, 0.4)'
  }
};

/**
 * Создает элемент tooltip с заданным текстом.
 * @param {string} text - Текст для отображения в tooltip.
 * @param {string} [date] - Дата для отображения в tooltip.
 * @param {boolean} [isPendingModeration=false] - Указывает, ожидает ли мітка модерации.
 * @returns {HTMLElement} DOM-элемент tooltip.
 */
const createTooltip = (text, date, isPendingModeration = false) => {
  const tooltip = document.createElement('div');
  tooltip.className = 'marker-tooltip';
  
  const displayText = isPendingModeration ? 'Ця мітка очікує на модерацію' : (text || 'Мітка');
  
  tooltip.innerHTML = `
  <div style="text-align: center;">
    <div>${displayText}</div>
    ${date && !isPendingModeration ? `<div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">${date}</div>` : ''}
  </div>
`;

  tooltip.style.cssText = `
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  `;

  const arrow = document.createElement('div');
  arrow.style.cssText = `
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  `;
  tooltip.appendChild(arrow);

  return tooltip;
};

/**
 * Создает элемент маркера для карты с заданной иконкой и состоянием.
 * @param {string} [iconName='battle'] - Название иконки из ICON_COMPONENTS.
 * @param {boolean} [isSelected=false] - Указывает, выбран ли маркер.
 * @param {Object} [markerData=null] - Данные маркера, включая title для tooltip.
 * @returns {HTMLElement} DOM-элемент маркера.
 */
export const createMarkerElement = (iconName = 'battle', isSelected = false, markerData = null) => {
  const element = document.createElement('div');
  
  // Проверяем статус модерации
  const isModerated = markerData && markerData.is_moderated !== undefined ? markerData.is_moderated : true;
  const isPendingModeration = !isModerated;
  
  // Получаем цвета для данной иконки
  const iconColors = ICON_COLORS[iconName] || ICON_COLORS.unknown;
  
  // Определяем цвета в зависимости от статуса модерации и выбора
  let backgroundColor, shadowColor;
  
  if (isPendingModeration) {
    // Немодерированные метки всегда серые
    backgroundColor = '#c3c4c7'; // серый цвет
    shadowColor = 'rgba(107, 114, 128, 0.4)';
  } else {
    // Модерированные метки получают цвет в зависимости от иконки и состояния выбора
    backgroundColor = isSelected ? iconColors.selected : iconColors.normal;
    shadowColor = iconColors.shadow;
  }

  element.className = 'custom-marker';
  element.style.cssText = `
    width: 40px;
    height: 40px;
    pointer-events: auto;
    overflow: visible;
    background: transparent;
  `;

  const pin = document.createElement('div');
  pin.className = 'marker-pin';
  pin.style.cssText = `
    width: 40px;
    height: 40px;
    background-color: ${backgroundColor};
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${isPendingModeration ? 'default' : 'pointer'};
    box-shadow: 0 4px 8px ${shadowColor};
    transition: all 0.2s ease;
    position: relative;
  `;

  const iconWrapper = document.createElement('div');
  iconWrapper.style.cssText = `
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  `;
  
  // Получаем путь иконки
  const iconPath = ICON_PATHS[iconName] || ICON_PATHS.battle;
  if (!ICON_PATHS[iconName]) {
    console.warn(`Icon "${iconName}" not found, falling back to battle`);
  }
  
  // Создаем SVG элемент напрямую
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'white');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.style.filter = 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))';
  
  // Добавляем содержимое SVG
  svg.innerHTML = iconPath;
  iconWrapper.appendChild(svg);
  
  pin.appendChild(iconWrapper);
  element.appendChild(pin);

  // Добавляем tooltip
  if (markerData && typeof markerData === 'object') {
    const tooltip = createTooltip(markerData.title, markerData.event_date, isPendingModeration);
    pin.appendChild(tooltip);

    // Hover эффекты только для модерированных маркеров
    if (!isPendingModeration) {
      pin.addEventListener('mouseenter', () => {
        pin.style.transform = 'scale(1.1)';
        // При наведении используем более яркий вариант цвета
        pin.style.backgroundColor = isSelected ? iconColors.selected : iconColors.normal;
        pin.style.boxShadow = `0 6px 12px ${shadowColor}`;
        tooltip.style.opacity = '1';
      });

      pin.addEventListener('mouseleave', () => {
        pin.style.transform = 'scale(1)';
        pin.style.backgroundColor = backgroundColor;
        pin.style.boxShadow = `0 4px 8px ${shadowColor}`;
        tooltip.style.opacity = '0';
      });
    } else {
      // Для немодерированных маркеров только показываем tooltip
      pin.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });

      pin.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    }
  }

  // Добавляем data-атрибут для идентификации немодерированных маркеров
  if (isPendingModeration) {
    element.setAttribute('data-pending-moderation', 'true');
  }

  return element;
};