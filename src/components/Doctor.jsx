import React from "react";
import { useNavigate } from "react-router-dom";
import "./doctor.css"; // Ensure CSS is linked

const Doctor = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="doctor-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="form-container">
        <h1 className="form-title">Add Doctor</h1>
        <form>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input type="text" placeholder="Doctor Name" required />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="btn">Add Doctor</button>
        </form>
      </div>
    </div>
  );
};

export default Doctor;
