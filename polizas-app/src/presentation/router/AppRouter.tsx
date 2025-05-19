import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@presentation/pages/HomePage';
import PolizasPage from '@presentation/pages/PolizasPage';
import PolizaForm from '@presentation/pages/PolizaForm';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Rutas de Pólizas */}
      <Route path="/polizas" element={<PolizasPage />} />
      <Route path="/polizas/nueva" element={<PolizaForm />} />
      <Route path="/polizas/editar/:id" element={<PolizaForm />} />
      
      {/* Rutas de Inventario */}
      {/* Implementar cuando sean necesarias */}
      
      {/* Rutas de Empleados */}
      {/* Implementar cuando sean necesarias */}
      
      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
