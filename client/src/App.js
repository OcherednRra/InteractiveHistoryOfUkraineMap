import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import AdminModerationPage from './pages/AdminModerationPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/moderation" 
          element={
            <AdminRoute>
              <AdminModerationPage />
            </AdminRoute>
          }
        />
        <Route 
          path="/" 
          element={
            token ? <Navigate to="/map" replace /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="*" 
          element={
            token ? <Navigate to="/map" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;