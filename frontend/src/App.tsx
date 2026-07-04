import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MatchesList from './pages/MatchesList';
import MatchesForm from './pages/MatchesForm';
import StatsList from './pages/StatsList';
import StatsForm from './pages/StatsForm';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<MatchesList />} />
            <Route path="/matches/new" element={<MatchesForm />} />
            <Route path="/stats" element={<StatsList />} />
            <Route path="/stats/new" element={<StatsForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;