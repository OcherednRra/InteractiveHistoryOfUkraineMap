import { useState, useEffect } from 'react';

export const useInfoPanel = (selectedMarker, onUpdateMarker, onMarkerDelete, onClose) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Оновлюємо локальний стан при зміні обраної мітки
  useEffect(() => {
    if (selectedMarker) {
      setEditedDescription(selectedMarker.description || '');
      setIsEditing(false);
      setError(null);
    }
  }, [selectedMarker]);

  // Функція збереження змін
  const handleSave = async () => {
    if (!selectedMarker || !editedDescription.trim()) {
      setError('Опис не може бути порожнім');
      return;
    }

    if (editedDescription.length > 3000) {
      setError('Опис не може містити більше 3000 символів');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onUpdateMarker(selectedMarker.id, { description: editedDescription.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка оновлення мітки:', error);
      setError(error.response?.data?.error || error.message || 'Помилка оновлення мітки');
    } finally {
      setIsLoading(false);
    }
  };

  // Функція скасування редагування
  const handleCancel = () => {
    setEditedDescription(selectedMarker?.description || '');
    setIsEditing(false);
    setError(null);
  };

  // Функція видалення мітки
  const handleDelete = async () => {
    if (!selectedMarker || !onMarkerDelete || isDeleting) return;

    if (window.confirm(`Ви впевнені, що хочете видалити мітку "${selectedMarker.title || 'Без назви'}"?`)) {
      setIsDeleting(true);
      setError(null);

      try {
        await onMarkerDelete(selectedMarker.id); // Викликає markersAPI.delete
        onClose(); // Закриваємо панель після видалення
      } catch (error) {
        console.error('Помилка видалення мітки:', error);
        setError(error.response?.data?.error || error.message || 'Помилка видалення мітки');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return {
    isEditing,
    setIsEditing,
    editedDescription,
    setEditedDescription,
    isLoading,
    isDeleting,
    error,
    handleSave,
    handleCancel,
    handleDelete,
  };
};