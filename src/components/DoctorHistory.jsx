import React, { useEffect, useState } from 'react';
import "./../styles/history.css";

const DoctorHistory = () => {
  const [doctorId, setDoctorId] = useState('');
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem('doctorId');
    const storedHistoryData = JSON.parse(localStorage.getItem('historyData'));

    if (storedDoctorId) setDoctorId(storedDoctorId);
    if (storedHistoryData) setHistoryData(storedHistoryData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  };

  const handleGoBack = () => {
    window.location.href = '/PatientDashboard';
  };

  return (
    <div className="doctor-history-container">
      <div className="doctor-history-navbar">
        <h1> HISTORY </h1>
        <div className="doctor-history-button-container">
          <button className="doctor-history-button doctor-history-logout-button" onClick={handleLogout}>Logout</button>
          <button className="doctor-history-button doctor-history-back-button" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      <div className="doctor-history-content-wrapper">
        <div className="doctor-history-box">
          <h2>{`History for Doctor ID: ${doctorId}`}</h2>
          {historyData.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <table className="doctor-history-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Timestamp</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.timestamp}</td>
                    <td>{item.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorHistory;
