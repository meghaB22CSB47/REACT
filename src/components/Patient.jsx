import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./patient.css"; 


const Patient = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load admin.js functions when component mounts
    if (window.initializeAdmin) {
      window.initializeAdmin();
    }
  }, []);

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="patient-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="form-container">
        <h1 className="form-title">Add Patient</h1>
        <form id="registerForm" enctype="multipart/form-data">
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input type="text" name="username" id="username" placeholder="Patient Name" required />
          </div>
          <div className="input-group">
            <i className="fas fa-id-badge"></i>
            <input type="text" name="patientId" id="patientId" placeholder="Patient ID" required />
          </div>
          <div className="input-group">
            <i className="fas fa-file-upload"></i>
            <input type="file" id="file" name="file" accept=".json" />
            <label for="file">Upload EHR File</label>
          </div>
          <button type="submit" className="btn">Add Patient</button>
        </form>
      </div>
    </div>
  );
};

export default Patient;
