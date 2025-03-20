import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import admin from './components/admin';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import EHRViewer from './components/EHRViewer';
import DoctorHistory from './components/DoctorHistory';
import Home from './components/Home';

const App = () => {
  const token = localStorage.getItem('jwt');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/DoctorDashboard" element={token ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/PatientDashboard" element={token ? <PatientDashboard /> : <Navigate to="/login" />} />
        <Route path="/EHRViewer" element={token ? <EHRViewer /> : <Navigate to="/login" />} />
        <Route path="/history/:doctorId" element={token ? <DoctorHistory /> : <Navigate to="/login" />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
