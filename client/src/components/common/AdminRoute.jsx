// components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUserRole } from '../../utils/auth';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const userRole = getCurrentUserRole();

  if (!token) {
    // Если нет токена, перенаправляем на логин
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'admin') {
    // Если пользователь не админ, перенаправляем на карту
    return <Navigate to="/map" replace />;
  }

  // Проверяем валидность токена
  try {
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

export default AdminRoute;