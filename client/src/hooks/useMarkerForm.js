// hooks/useMarkerForm.js
import { useState, useCallback } from 'react';

export const useMarkerForm = () => {
  const [formState, setFormState] = useState({
    title: '',
    tags: '',
    description: '',
    selectedIcon: 'unknown', // Changed from 'MapPin' to match available icons
    dateType: 'none',
    eventYear: '',
    eventDate: '',
    eventYearFrom: '',
    eventYearTo: '',
    eventDateFrom: '',
    eventDateTo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = useCallback(() => {
    setFormState({
      title: '',
      tags: '',
      description: '',
      selectedIcon: 'unknown', // Changed from 'MapPin' to match available icons
      dateType: 'none',
      eventYear: '',
      eventDate: '',
      eventYearFrom: '',
      eventYearTo: '',
      eventDateFrom: '',
      eventDateTo: '',
    });
    setError(null);
  }, []);

  // Функция для обновления состояния формы
  const updateFormState = useCallback((updates) => {
    console.log('Updating form state with:', updates); // Для отладки
    setFormState((prev) => {
      const newState = { ...prev, ...updates };
      console.log('New form state:', newState); // Для отладки
      return newState;
    });
  }, []);

  // Функция для установки всего состояния сразу (для инициализации)
  const setFullFormState = useCallback((newState) => {
    console.log('Setting full form state:', newState); // Для отладки
    setFormState(newState);
  }, []);

  // Исправленная функция - принимает состояние как параметр
  const getEventDateString = useCallback((state = formState) => {
    switch (state.dateType) {
      case 'year':
        return state.eventYear;
      case 'date':
        return state.eventDate ? new Date(state.eventDate).toLocaleDateString('uk-UA') : '';
      case 'yearRange':
        return state.eventYearFrom && state.eventYearTo
          ? `${state.eventYearFrom}-${state.eventYearTo}`
          : '';
      case 'dateRange':
        const fromDate = state.eventDateFrom
          ? new Date(state.eventDateFrom).toLocaleDateString('uk-UA')
          : '';
        const toDate = state.eventDateTo
          ? new Date(state.eventDateTo).toLocaleDateString('uk-UA')
          : '';
        return fromDate && toDate ? `${fromDate} - ${toDate}` : '';
      default:
        return '';
    }
  }, [formState]);

  return {
    formState,
    updateFormState,
    setFullFormState,
    error,
    setError,
    isLoading,
    setIsLoading,
    resetForm,
    getEventDateString,
  };
};