import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUser, FaLock, FaHospital } from "react-icons/fa";
import "./styles.css"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mspId, setMspId] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    // Scenario 1: If username is admin
    if (username === "admin") {
      if (mspId === "Org1Msp") {
        navigate("/doctor"); // Admin for Org1 → Doctor
      } else if (mspId === "Org2Msp") {
        navigate("/patient"); // Admin for Org2Msp → Patient
      } else {
        alert("Invalid MSP ID. Please enter Org1 or Org2Msp.");
      }
    } 
    
    // Scenario 2: If username is not admin
    else {
      if (mspId === "Org2Msp") {
        navigate("/PatientDashboard"); // Non-admin for Org2Msp → Patient
      } else if (mspId === "Org1Msp") {
        navigate("/DoctorDashboard"); // Non-admin for Org1 → Doctor
      } else {
        alert("Invalid MSP ID. Please enter Org1 or Org2Msp.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">HealthLink</h1>
        <p className="login-subtitle">Secure Electronic Health Records</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input 
              type="text" 
              placeholder="User ID" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <FaHospital className="icon" />
            <input 
              type="text" 
              placeholder="MSP ID" 
              value={mspId} 
              onChange={(e) => setMspId(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
