import React from 'react';
import { Navigate } from 'react-router-dom';

const ProvinceDashboard: React.FC = () => {
  // Redirect province users to schools management
  return <Navigate to="/schools" replace />;
};

export default ProvinceDashboard;