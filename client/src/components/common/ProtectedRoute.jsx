// ProtectedRoute.jsx (обновленный с дополнительными проверками)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Сохраняем текущий путь для редиректа после входа
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Можно добавить дополнительную проверку валидности токена
  try {
    // Простая проверка формата JWT токена
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;