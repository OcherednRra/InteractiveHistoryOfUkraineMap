import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { IconSelector } from './ui/IconSelector';
import { modalStyles } from '../styles/createMarkerModalStyles';
import { infoPanelStyles } from '../styles/infoPanelStyles';
import { useMarkerForm } from '../hooks/useMarkerForm';

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

const DateInputs = ({ dateType, formState, setFormState, isLoading }) => {
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
          onChange={(e) => setFormState({ eventYear: e.target.value })}
          placeholder="1990"
          {...commonProps}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          value={formState.eventDate}
          onChange={(e) => setFormState({ eventDate: e.target.value })}
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
            onChange={(e) => setFormState({ eventYearFrom: e.target.value })}
            placeholder="от"
            {...commonProps}
          />
          <input
            type="number"
            min="1"
            max={new Date().getFullYear() + 100}
            value={formState.eventYearTo}
            onChange={(e) => setFormState({ eventYearTo: e.target.value })}
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
            onChange={(e) => setFormState({ eventDateFrom: e.target.value })}
            {...commonProps}
          />
          <input
            type="date"
            value={formState.eventDateTo}
            onChange={(e) => setFormState({ eventDateTo: e.target.value })}
            {...commonProps}
          />
        </div>
      );
    default:
      return null;
  }
};

const CreateMarkerModal = ({ isVisible, onClose, onCreateMarker, coordinates }) => {
  const { formState, updateFormState, error, setError, isLoading, setIsLoading, resetForm, getEventDateString } = useMarkerForm();

  const handleIconSelect = useCallback((iconName) => {
    try {
      if (typeof updateFormState === 'function') {
        updateFormState({ selectedIcon: iconName });
      } else {
        console.error('updateFormState is not a function');
      }
    } catch (err) {
      console.error('Error setting icon:', err);
    }
  }, [updateFormState]);

  const handleSave = useCallback(async () => {
    const { title, description, eventYear, eventYearFrom, eventYearTo, eventDateFrom, eventDateTo, dateType, tags } = formState;

    // Валідація
    if (!title.trim()) return setError('Назва не може бути пустою');
    if (!description.trim()) return setError('Опис не може бути пустим');
    if (title.length > 100) return setError('Назва не може містити більше 100 символів');
    if (description.length > 3000) return setError('Опис не може містити більше 3000 символів');

    if (dateType === 'year' && eventYear && (eventYear < 1 || eventYear > new Date().getFullYear() + 100)) {
      return setError('Рік має бути від 1 до ' + (new Date().getFullYear() + 100));
    }
    if (dateType === 'yearRange' && eventYearFrom && eventYearTo && parseInt(eventYearFrom) > parseInt(eventYearTo)) {
      return setError('Рік початку не може бути більше року закінчення');
    }
    if (dateType === 'dateRange' && eventDateFrom && eventDateTo && new Date(eventDateFrom) > new Date(eventDateTo)) {
      return setError('Дата початку не може бути більше дати закінчення');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tagList = tags.split(/[#\s]+/).map(tag => tag.trim()).filter(tag => tag.length > 0);

      await onCreateMarker({
        title: title.trim(),
        event_date: getEventDateString(),
        tags: tagList.join(' '),
        description: description.trim(),
        icon: formState.selectedIcon,
      });

      resetForm();
    } catch (error) {
      console.error('Помилка створення маркеру:', error);
      setError(error.response?.data?.error || error.message || 'Помилка створення маркеру. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  }, [formState, onCreateMarker, getEventDateString, setIsLoading, setError, resetForm]);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  React.useEffect(() => {
    console.log('FormState:', formState);
    console.log('updateFormState type:', typeof updateFormState);
  }, [formState, updateFormState]);

  if (!isVisible) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleCancel}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.headerLeft}>
            <h2 style={modalStyles.title}>Створити новий маркер</h2>
            {coordinates && (
              <p style={modalStyles.subtitle}>
                🌏 ({coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)})
              </p>
            )}
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
                            setFormState={updateFormState}
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
              {isLoading ? '⏳' : '💾'} {isLoading ? 'Збереження...' : 'Створити'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              style={infoPanelStyles.button('#6b7280', isLoading)}
            >
              Скасувати
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
                  onChange={(e) => updateFormState({ title: e.target.value })}
                  placeholder="Введіть назву маркера..."
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
                onIconSelect={handleIconSelect}
                disabled={isLoading}
                isModerated={false}
              />
            </div>
          </div>
          <div style={modalStyles.fieldGroup}>
            <textarea
              value={formState.description}
              onChange={(e) => updateFormState({ description: e.target.value })}
              placeholder="Введіть опис маркеру (підримує Markdown)..."
              disabled={isLoading}
              style={{
                ...modalStyles.inputField,
                backgroundColor: isLoading ? '#f9fafb' : 'white',
                minHeight: '400px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#059669')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
            <div style={infoPanelStyles.charCounter}>
              {formState.description.length}/3000 символів
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateMarkerModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateMarker: PropTypes.func.isRequired,
  coordinates: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
};

export default CreateMarkerModal;