import { useState, useCallback, useMemo } from 'react';

export const useMarkerFilter = (markers = [], currentUserEmail = '') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState('');
  const [eventDateTo, setEventDateTo] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showOnlyMyMarkers, setShowOnlyMyMarkers] = useState(false);

  // Функция поиска по тексту
  const searchInText = useCallback((text, query) => {
    if (!text || !query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  }, []);

  // Функция проверки даты в диапазоне
  const isDateInRange = useCallback((date, from, to) => {
    if (!date) return !from && !to;
    
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

  // Функция проверки года события
  const isEventYearInRange = useCallback((eventDate, yearFrom, yearTo) => {
    if (!yearFrom && !yearTo) return true;
    if (!eventDate) return false;

    // Извлекаем год из текста события
    const yearMatch = eventDate.match(/\b(19|20)\d{2}\b/);
    if (!yearMatch) return false;
    
    const eventYear = parseInt(yearMatch[0]);
    
    if (yearFrom && eventYear < parseInt(yearFrom)) return false;
    if (yearTo && eventYear > parseInt(yearTo)) return false;

    return true;
  }, []);

  // Функция проверки тегов
  const hasMatchingTags = useCallback((markerTags, selectedTags) => {
    if (!selectedTags || selectedTags.length === 0) return true;
    if (!markerTags) return false;

    const markerTagList = markerTags.toLowerCase().split(',').map(tag => tag.trim());
    return selectedTags.some(selectedTag => 
      markerTagList.some(markerTag => markerTag.includes(selectedTag.toLowerCase()))
    );
  }, []);

  // Получение уникальных тегов из всех меток
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    markers.forEach(marker => {
      if (marker.tags) {
        marker.tags.split(',').forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagSet.add(trimmedTag);
          }
        });
      }
    });
    return Array.from(tagSet).sort();
  }, [markers]);

  // Получение уникальных авторов
  const availableAuthors = useMemo(() => {
    const authorSet = new Set();
    markers.forEach(marker => {
      if (marker.user_email) {
        authorSet.add(marker.user_email);
      }
    });
    return Array.from(authorSet).sort();
  }, [markers]);

  // Основная функция определения видимости меток
  const getMarkerVisibility = useCallback((marker) => {
    // Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      const matchesTitle = searchInText(marker.title, query);
      const matchesTags = searchInText(marker.tags, query);
      const matchesDescription = searchInText(marker.description, query);
      
      if (!matchesTitle && !matchesTags && !matchesDescription) {
        return 0.1; // Скрыть метку
      }
    }

    // Фильтр по дате создания
    if (!isDateInRange(marker.created_at, dateFrom, dateTo)) {
      return 0.1;
    }

    // Фильтр по году события
    if (!isEventYearInRange(marker.event_date, eventDateFrom, eventDateTo)) {
      return 0.1;
    }

    // Фильтр по тегам
    if (!hasMatchingTags(marker.tags, selectedTags)) {
      return 0.1;
    }

    // Фильтр по авторам
    if (selectedAuthors.length > 0 && !selectedAuthors.includes(marker.user_email)) {
      return 0.1;
    }

    // Фильтр "только мои метки"
    if (showOnlyMyMarkers && marker.user_email !== currentUserEmail) {
      return 0.1;
    }

    return 1; // Показать метку полностью
  }, [
    searchQuery,
    dateFrom,
    dateTo,
    eventDateFrom,
    eventDateTo,
    selectedTags,
    selectedAuthors,
    showOnlyMyMarkers,
    currentUserEmail,
    searchInText,
    isDateInRange,
    isEventYearInRange,
    hasMatchingTags
  ]);

  // Карта видимости меток
  const markerVisibilityMap = useMemo(() => {
    const visibilityMap = new Map();
    markers.forEach(marker => {
      visibilityMap.set(marker.id, getMarkerVisibility(marker));
    });
    return visibilityMap;
  }, [markers, getMarkerVisibility]);

  // Функция очистки всех фильтров
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setEventDateFrom('');
    setEventDateTo('');
    setSelectedTags([]);
    setSelectedAuthors([]);
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
      selectedTags.length > 0 ||
      selectedAuthors.length > 0 ||
      showOnlyMyMarkers
    );
  }, [searchQuery, dateFrom, dateTo, eventDateFrom, eventDateTo, selectedTags, selectedAuthors, showOnlyMyMarkers]);

  // Статистика фильтрации
  const filterStats = useMemo(() => {
    const visibleCount = Array.from(markerVisibilityMap.values()).filter(opacity => opacity === 1).length;
    return {
      total: markers.length,
      visible: visibleCount,
      hidden: markers.length - visibleCount,
      hasFiltered: hasActiveFilters
    };
  }, [markerVisibilityMap, markers.length, hasActiveFilters]);

  // Функции для работы с тегами
  const toggleTag = useCallback((tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  // Функции для работы с авторами
  const toggleAuthor = useCallback((author) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author)
        : [...prev, author]
    );
  }, []);

  const clearAuthors = useCallback(() => {
    setSelectedAuthors([]);
  }, []);

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
    selectedTags,
    setSelectedTags,
    selectedAuthors,
    setSelectedAuthors,
    showOnlyMyMarkers,
    setShowOnlyMyMarkers,
    
    // Доступные опции
    availableTags,
    availableAuthors,
    
    // Результаты
    markerVisibilityMap,
    hasActiveFilters,
    filterStats,
    
    // Методы
    clearAllFilters,
    getMarkerVisibility,
    toggleTag,
    clearTags,
    toggleAuthor,
    clearAuthors
  };
};