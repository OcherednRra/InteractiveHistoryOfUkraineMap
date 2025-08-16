import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { IconSelector } from './ui/IconSelector';
import { modalStyles } from '../styles/createMarkerModalStyles';
import { infoPanelStyles } from '../styles/infoPanelStyles';
import { useMarkerForm } from '../hooks/useMarkerForm';

// Компонент для вибору типу дати
const DateTypeSelector = ({ dateType, setDateType, isLoading }) => (
  <select
    value={dateType}
    onChange={(e) => setDateType(e.target.value)}
    disabled={isLoading}
    style={modalStyles.dateTypeSelect}
  >
    <option value="none">Без дати</option>
    <option value="year">Рік</option>
    <option value="date">Дата</option>
    <option value="yearRange">Роки</option>
    <option value="dateRange">Дати</option>
  </select>
);

// Компонент для відображення полів введення дати
const DateInputs = ({ dateType, formState, updateFormState, isLoading }) => {
  const inputStyles = {
    ...modalStyles.inputField,
    ...modalStyles[dateType.includes('year') ? 'yearInput' : 'dateInput'],
    backgroundColor: isLoading ? '#f9fafb' : 'white',
  };

  const commonProps = {
    disabled: isLoading,
    style: inputStyles,
    onFocus: (e) => (e.target.style.borderColor = '#059669'),
    onBlur: (e) => (e.target.style.borderColor = '#d1d5db'),
  };

  switch (dateType) {
    case 'year':
      return (
        <input
          type="number"
          min="1"
          max={new Date().getFullYear() + 100}
          value={formState.eventYear}
          onChange={(e) => updateFormState({ eventYear: e.target.value })}
          placeholder="1990"
          {...commonProps}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          value={formState.eventDate}
          onChange={(e) => updateFormState({ eventDate: e.target.value })}
          {...commonProps}
        />
      );
    case 'yearRange':
      return (
        <div style={modalStyles.dateRangeContainer}>
          <input
            type="number"
            min="1"
            max={new Date().getFullYear() + 100}
            value={formState.eventYearFrom}
            onChange={(e) => updateFormState({ eventYearFrom: e.target.value })}
            placeholder="от"
            {...commonProps}
          />
          <input
            type="number"
            min="1"
            max={new Date().getFullYear() + 100}
            value={formState.eventYearTo}
            onChange={(e) => updateFormState({ eventYearTo: e.target.value })}
            placeholder="до"
            {...commonProps}
          />
        </div>
      );
    case 'dateRange':
      return (
        <div style={modalStyles.dateRangeContainer}>
          <input
            type="date"
            value={formState.eventDateFrom}
            onChange={(e) => updateFormState({ eventDateFrom: e.target.value })}
            {...commonProps}
          />
          <input
            type="date"
            value={formState.eventDateTo}
            onChange={(e) => updateFormState({ eventDateTo: e.target.value })}
            {...commonProps}
          />
        </div>
      );
    default:
      return null;
  }
};

const EditMarkerModal = ({ isVisible, onClose, onUpdateMarker, selectedMarker }) => {
  const { 
    formState, 
    updateFormState, 
    setFullFormState, 
    error, 
    setError, 
    isLoading, 
    setIsLoading, 
    resetForm, 
    getEventDateString 
  } = useMarkerForm();

  // Ініціалізація форми даними маркера
  useEffect(() => {
    if (isVisible && selectedMarker) {
      console.log('Initializing form with marker:', selectedMarker);
      
      let dateType = 'none';
      let eventYear = '';
      let eventDate = '';
      let eventYearFrom = '';
      let eventYearTo = '';
      let eventDateFrom = '';
      let eventDateTo = '';

      if (selectedMarker.event_date) {
        if (/^\d{4}$/.test(selectedMarker.event_date)) {
          dateType = 'year';
          eventYear = selectedMarker.event_date;
        } else if (/^\d{4}-\d{4}$/.test(selectedMarker.event_date)) {
          dateType = 'yearRange';
          [eventYearFrom, eventYearTo] = selectedMarker.event_date.split('-');
        } else if (selectedMarker.event_date.includes(' - ')) {
          dateType = 'dateRange';
          const [from, to] = selectedMarker.event_date.split(' - ').map(d => {
            const [day, month, year] = d.split('.');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          });
          eventDateFrom = from;
          eventDateTo = to;
        } else if (selectedMarker.event_date.includes('.')) {
          dateType = 'date';
          const [day, month, year] = selectedMarker.event_date.split('.');
          eventDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }

      // Используем setFullFormState для установки всех значений сразу
      const initialState = {
        title: selectedMarker.title || '',
        tags: selectedMarker.tags || '',
        description: selectedMarker.description || '',
        selectedIcon: selectedMarker.icon || 'MapPin',
        dateType,
        eventYear,
        eventDate,
        eventYearFrom,
        eventYearTo,
        eventDateFrom,
        eventDateTo,
      };
      
      setFullFormState(initialState);
      setError(null);
      
      console.log('Form initialized with state:', initialState);
    }
  }, [isVisible, selectedMarker, setFullFormState, setError]);

  const handleSave = useCallback(async () => {
    const { title, description, eventYear, eventYearFrom, eventYearTo, eventDateFrom, eventDateTo, dateType, tags } = formState;

    // Валідація
    if (!title.trim()) return setError('Название не может быть пустым');
    if (!description.trim()) return setError('Описание не может быть пустым');
    if (title.length > 100) return setError('Название не может содержать более 100 символов');
    if (description.length > 3000) return setError('Описание не может содержать более 3000 символов');

    if (dateType === 'year' && eventYear && (eventYear < 1 || eventYear > new Date().getFullYear() + 100)) {
      return setError('Год должен быть в разумных пределах');
    }
    if (dateType === 'yearRange' && eventYearFrom && eventYearTo && parseInt(eventYearFrom) > parseInt(eventYearTo)) {
      return setError('Год начала не может быть больше года окончания');
    }
    if (dateType === 'dateRange' && eventDateFrom && eventDateTo && new Date(eventDateFrom) > new Date(eventDateTo)) {
      return setError('Дата начала не может быть больше даты окончания');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tagList = tags.split(/[#\s]+/).map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      // Передаем текущее состояние формы в getEventDateString
      const eventDateString = getEventDateString(formState);

      await onUpdateMarker(selectedMarker.id, {
        title: title.trim(),
        event_date: eventDateString,
        tags: tagList.join(' '),
        description: description.trim(),
        icon: formState.selectedIcon,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Ошибка обновления метки:', error);
      setError(error.response?.data?.error || error.message || 'Ошибка обновления метки');
    } finally {
      setIsLoading(false);
    }
  }, [formState, onUpdateMarker, getEventDateString, setIsLoading, setError, resetForm, selectedMarker, onClose]);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Добавим отладочную информацию
  console.log('Current form state:', formState);
  console.log('Is visible:', isVisible);
  console.log('Selected marker:', selectedMarker);

  if (!isVisible || !selectedMarker) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleCancel}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.headerLeft}>
            <h2 style={modalStyles.title}>Редагувати маркер</h2>
            <p style={modalStyles.subtitle}>
              🌏 ({selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)})
            </p>
          </div>
          <div style={modalStyles.datePickerContainer}>
            <div style={modalStyles.dateTypeContainer}>
              <DateTypeSelector
                dateType={formState.dateType}
                setDateType={(value) => updateFormState({ dateType: value })}
                isLoading={isLoading}
              />
            </div>
            <div style={modalStyles.dateFieldsContainer}>
              <div style={modalStyles.dateInputsContainer}>
                <DateInputs
                  dateType={formState.dateType}
                  formState={formState}
                  updateFormState={updateFormState}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <div style={modalStyles.headerRight}>
            <button
              onClick={handleSave}
              disabled={isLoading || !formState.title.trim() || !formState.description.trim()}
              style={infoPanelStyles.button('#059669', isLoading, !formState.title.trim() || !formState.description.trim())}
            >
              {isLoading ? '⏳' : '💾'} {isLoading ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              style={infoPanelStyles.button('#6b7280', isLoading)}
            >
              Отменить
            </button>
          </div>
        </div>

        {error && <div style={modalStyles.errorMessage}>{error}</div>}

        <div style={modalStyles.content}>
          <div style={modalStyles.titleRow}>
            <div style={modalStyles.textFieldsColumn}>
              <div style={modalStyles.fieldGroup}>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => {
                    console.log('Title changing to:', e.target.value);
                    updateFormState({ title: e.target.value });
                  }}
                  placeholder="Введіть назву маркеру..."
                  disabled={isLoading}
                  style={{
                    ...modalStyles.inputField,
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#059669')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              <div style={modalStyles.fieldGroup}>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(e) => updateFormState({ tags: e.target.value })}
                  placeholder="Введіть теги через пробіл..."
                  disabled={isLoading}
                  style={{
                    ...modalStyles.inputField,
                    backgroundColor: isLoading ? '#f9fafb' : 'white',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#059669')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
            <div style={modalStyles.iconsContainer}>
              <IconSelector
                selectedIcon={formState.selectedIcon}
                onIconSelect={(icon) => updateFormState({ selectedIcon: icon })}
                disabled={isLoading}
                isModerated={false}
              />
            </div>
          </div>
          <div style={modalStyles.fieldGroup}>
            <textarea
              value={formState.description}
              onChange={(e) => updateFormState({ description: e.target.value })}
              placeholder="Введить опис маркеру..."
              disabled={isLoading}
              style={{
                ...modalStyles.inputField,
                backgroundColor: isLoading ? '#f9fafb' : 'white',
                minHeight: '350px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#059669')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
            <div style={infoPanelStyles.charCounter}>
              {formState.description.length}/3000 символов
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EditMarkerModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateMarker: PropTypes.func.isRequired,
  selectedMarker: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    event_date: PropTypes.string,
    tags: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
};

export default EditMarkerModal;