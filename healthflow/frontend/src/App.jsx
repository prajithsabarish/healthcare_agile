import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import ProjectsDashboard from './pages/ProjectsDashboard';
import ScrumBoard from './pages/ScrumBoard';
import ProductBacklog from './pages/ProductBacklog';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

import SprintPlanning from './pages/SprintPlanning';
import DailyScrum from './pages/DailyScrum';
import SprintReview from './pages/SprintReview';
import Retrospective from './pages/Retrospective';
import UserManagement from './pages/UserManagement';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes using MainLayout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<ProjectsDashboard />} />
            <Route path="projects" element={<ProjectsDashboard />} />
            <Route path="backlog" element={<ProductBacklog />} />
            <Route path="board" element={<ScrumBoard />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="planning" element={<SprintPlanning />} />
            <Route path="daily-scrum" element={<DailyScrum />} />
            <Route path="review" element={<SprintReview />} />
            <Route path="retrospective" element={<Retrospective />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
