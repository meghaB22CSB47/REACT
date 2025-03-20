import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Patient from "./components/Patient";
import PatientDashboard from "./components/PatientDashboard";
import Doctor from "./components/Doctor";
import DoctorDashboard from "./components/DoctorDashboard";
import EHRViewer from './components/EHRViewer';

import history from './components/history';


function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

