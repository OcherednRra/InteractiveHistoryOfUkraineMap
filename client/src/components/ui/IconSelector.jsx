import React from 'react';
import { 
  Swords, 
  Anchor, 
  Skull, 
  FileText, 
  Camera, 
  Home, 
  X, 
  HelpCircle, 
  Star, 
  Wrench 
} from 'lucide-react';

// Импортируем цвета из markerElement.js (или определяем их здесь)
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

const AVAILABLE_ICONS = [
  { name: 'battle', icon: Swords, label: 'Сражение' },
  { name: 'fleet', icon: Anchor, label: 'Флот' },
  { name: 'memorial', icon: Skull, label: 'Память, жертвы' },
  { name: 'treaty', icon: FileText, label: 'Договоры' },
  { name: 'photo', icon: Camera, label: 'Фотодокументация' },
  { name: 'birthplace', icon: Home, label: 'Место рождения' },
  { name: 'death', icon: X, label: 'Гибель' },
  { name: 'unknown', icon: HelpCircle, label: 'Неизвестное' },
  { name: 'celebrity', icon: Star, label: 'Выдающиеся личности' },
  { name: 'invention', icon: Wrench, label: 'Изобретения' }
];

const IconSelector = ({ selectedIcon, onIconSelect, disabled = false, isModerated = true }) => {
  const iconSelectorStyles = {
    container: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridTemplateRows: 'repeat(2, auto)',
      gap: '8px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      width: 'fit-content',
      alignItems: 'center'
    },
    iconButton: (isSelected, isDisabled, isModerated, iconName) => {
      // Получаем цвета для конкретной иконки
      const iconColors = ICON_COLORS[iconName] || ICON_COLORS.unknown;
      
      let backgroundColor, borderColor, textColor;
      
      if (isSelected) {
        // Всегда используем цвет иконки для выбранного состояния
        backgroundColor = iconColors.selected;
        borderColor = iconColors.selected;
        textColor = '#ffffff';
      } else {
        backgroundColor = '#ffffff';
        borderColor = '#e5e7eb';
        textColor = '#374151';
      }
      
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        backgroundColor,
        color: textColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.5 : 1,
        fontSize: '11px',
        fontWeight: '500',
        minHeight: '48px',
        width: '48px',
        height: '48px',
        boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
      };
    },
    iconWrapper: {
      marginBottom: '2px',
      lineHeight: '1'
    }
  };

  return (
    <div style={iconSelectorStyles.container}>
      <div style={iconSelectorStyles.grid}>
        {AVAILABLE_ICONS.map((iconData) => {
          const isSelected = selectedIcon === iconData.name;
          const IconComponent = iconData.icon;
          const iconColors = ICON_COLORS[iconData.name] || ICON_COLORS.unknown;
          
          return (
            <button
              key={iconData.name}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onIconSelect(iconData.name)}
              style={iconSelectorStyles.iconButton(isSelected, disabled, isModerated, iconData.name)}
              onMouseEnter={(e) => {
                if (!disabled) {
                  if (isSelected) {
                    // Для выбранной иконки используем более темный оттенок её цвета
                    e.target.style.backgroundColor = iconColors.selected;
                    e.target.style.borderColor = iconColors.selected;
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  } else {
                    // Для невыбранной иконки при наведении показываем её основной цвет
                    e.target.style.backgroundColor = iconColors.normal;
                    e.target.style.borderColor = iconColors.normal;
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  if (isSelected) {
                    e.target.style.backgroundColor = iconColors.selected;
                    e.target.style.borderColor = iconColors.selected;
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  } else {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#374151';
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }
                }
              }}
              title={iconData.label}
            >
              <div style={iconSelectorStyles.iconWrapper}>
                <IconComponent 
                  size={20} 
                  strokeWidth={isSelected ? 2.5 : 2}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { IconSelector, AVAILABLE_ICONS };