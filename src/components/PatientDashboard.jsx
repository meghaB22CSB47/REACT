import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Navbar Component
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

const PatientDashboard = () => {
  const [status, setStatus] = useState('Accepted');
  const [acceptedDoctors, setAcceptedDoctors] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle Data Fetching
  useEffect(() => {
    if (status === 'Accepted') {
      fetchDoctorData();
    } else if (status === 'Pending') {
      fetchPendingRequests();
    }
  }, [status]);

  // Fetch Accepted Doctors
  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/fabric/patient/accepted', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch accepted doctors');
      const data = await response.json();
      setAcceptedDoctors(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Fetch Pending Requests
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/fabric/patient/request', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch pending requests');
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Handle Doctor Actions
  const handleAction = async (action, doctorId) => {
    try {
      const response = await fetch(`/fabric/patient/request/${doctorId}?status=${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) throw new Error(`Failed to ${action} doctor`);
      alert(`Doctor ${action} successfully!`);
      status === 'Pending' ? fetchPendingRequests() : fetchDoctorData();
    } catch (error) {
      console.error(error);
    }
  };

  // View History
  const viewHistory = (doctorId) => {
    localStorage.setItem('doctorId', doctorId);
    window.location.href = '/history';
  };

  return (
    <>
      {/* Include Navbar Component */}
      <Navbar />
      <div className="content-wrapper">
        {/* Status Selector */}
        <div className="container">
          <h2>Patient Dashboard</h2>
          <label>Choose Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Accepted">Accepted</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="refresh-button" onClick={status === 'Accepted' ? fetchDoctorData : fetchPendingRequests}>
            Refresh
          </button>
          {loading && <div className="loading">Loading...</div>}
        </div>

        {/* Accepted Doctors Section */}
        {status === 'Accepted' && (
          <div className="container">
            <h2>Accepted Doctors</h2>
            {acceptedDoctors.length > 0 ? (
              acceptedDoctors.map((doctorId) => (
                <div className="doctor-actions-row" key={doctorId}>
                  <span className="doctor-id-display">Doctor ID: {doctorId}</span>
                  <button className="doctor-button view-button" onClick={() => viewHistory(doctorId)}>View History</button>
                  <button className="doctor-button revoke-button" onClick={() => handleAction('Revoke', doctorId)}>Revoke</button>
                </div>
              ))
            ) : (
              <p>No accepted doctors available.</p>
            )}
          </div>
        )}

        {/* Pending Requests Section */}
        {status === 'Pending' && (
          <div className="container">
            <h2>Pending Requests</h2>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((doctorId) => (
                <div className="doctor-actions-row" key={doctorId}>
                  <span className="doctor-id-display">Doctor ID: {doctorId}</span>
                  <button className="doctor-button accept-button" onClick={() => handleAction('Accepted', doctorId)}>Accept</button>
                  <button className="doctor-button revoke-button" onClick={() => handleAction('Rejected', doctorId)}>Reject</button>
                </div>
              ))
            ) : (
              <p>No pending requests available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PatientDashboard;
