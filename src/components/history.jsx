import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  return (
    <div className="navbar">
      Electronic Health Record System
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

const DoctorHistory = () => {
  const [doctorId, setDoctorId] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctorId = localStorage.getItem('doctorId');
    const storedHistoryData = JSON.parse(localStorage.getItem('historyData'));
    setDoctorId(storedDoctorId);
    setHistoryData(storedHistoryData || []);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/patient');
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar title="Doctor History" onLogout={handleLogout} />

      <div className="content-wrapper">
        <div className="container">
          <h2>History for Doctor ID: {doctorId}</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Timestamp</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.timestamp}</td>
                    <td>{item.hash}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No history data available.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="button back-button" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorHistory;
