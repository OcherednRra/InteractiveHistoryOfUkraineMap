import { useState, useCallback, useMemo } from 'react';

export const useMarkerSearch = (markers = [], currentUserEmail = '') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState('');
  const [eventDateTo, setEventDateTo] = useState('');
  const [showOnlyMyMarkers, setShowOnlyMyMarkers] = useState(false);

  // Функция поиска по тексту
  const searchInText = useCallback((text, query) => {
    if (!text || !query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  }, []);

  // Функция проверки даты в диапазоне
  const isDateInRange = useCallback((date, from, to) => {
    if (!date) return !from && !to; // Если дата не указана, показываем только если фильтр не установлен
    
    const checkDate = new Date(date);
    if (isNaN(checkDate.getTime())) return false;

    if (from) {
      const fromDate = new Date(from);
      if (checkDate < fromDate) return false;
    }

    if (to) {
      const toDate = new Date(to + 'T23:59:59');
      if (checkDate > toDate) return false;
    }

    return true;
  }, []);

  // Функция проверки текста события на вхождение года/периода
  const isEventDateMatch = useCallback((eventDate, from, to) => {
    if (!from && !to) return true;
    if (!eventDate) return false;

    const eventDateText = eventDate.toLowerCase();
    
    if (from && !eventDateText.includes(from.toLowerCase())) return false;
    if (to && !eventDateText.includes(to.toLowerCase())) return false;

    return true;
  }, []);

  // Основная функция фильтрации
  const filteredMarkers = useMemo(() => {
    if (!markers || markers.length === 0) return [];

    return markers.filter((marker) => {
      // Поиск по тексту
      if (searchQuery.trim()) {
        const query = searchQuery.trim();
        const matchesTitle = searchInText(marker.title, query);
        const matchesTags = searchInText(marker.tags, query);
        const matchesDescription = searchInText(marker.description, query);
        
        if (!matchesTitle && !matchesTags && !matchesDescription) {
          return false;
        }
      }

      // Фильтр по дате создания
      if (!isDateInRange(marker.created_at, dateFrom, dateTo)) {
        return false;
      }

      // Фильтр по дате события
      if (!isEventDateMatch(marker.event_date, eventDateFrom, eventDateTo)) {
        return false;
      }

      // Фильтр "только мои метки"
      if (showOnlyMyMarkers && marker.user_email !== currentUserEmail) {
        return false;
      }

      return true;
    });
  }, [
    markers, 
    searchQuery, 
    dateFrom, 
    dateTo, 
    eventDateFrom, 
    eventDateTo, 
    showOnlyMyMarkers, 
    currentUserEmail,
    searchInText,
    isDateInRange,
    isEventDateMatch
  ]);

  // Функция очистки всех фильтров
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setEventDateFrom('');
    setEventDateTo('');
    setShowOnlyMyMarkers(false);
  }, []);

  // Проверка наличия активных фильтров
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery.trim() || 
      dateFrom || 
      dateTo || 
      eventDateFrom || 
      eventDateTo || 
      showOnlyMyMarkers
    );
  }, [searchQuery, dateFrom, dateTo, eventDateFrom, eventDateTo, showOnlyMyMarkers]);

  // Статистика поиска
  const searchStats = useMemo(() => ({
    total: markers.length,
    filtered: filteredMarkers.length,
    hasResults: filteredMarkers.length > 0,
    isFiltering: hasActiveFilters
  }), [markers.length, filteredMarkers.length, hasActiveFilters]);

  return {
    // Состояние фильтров
    searchQuery,
    setSearchQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    eventDateFrom,
    setEventDateFrom,
    eventDateTo,
    setEventDateTo,
    showOnlyMyMarkers,
    setShowOnlyMyMarkers,
    
    // Результаты
    filteredMarkers,
    hasActiveFilters,
    searchStats,
    
    // Методы
    clearAllFilters,
    searchInText,
    isDateInRange,
    isEventDateMatch
  };
};