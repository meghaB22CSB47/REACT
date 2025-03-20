import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/patient.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Accepted");
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState({ accepted: false, pending: false });

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  useEffect(() => {
    toggleDoctorActions();
  }, [status]);

  const toggleDoctorActions = () => {
    if (status === "Accepted" && !dataFetched.accepted) {
      fetchDoctorData();
    } else if (status === "Pending" && !dataFetched.pending) {
      fetchPendingRequests();
    }
  };

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fabric/patient/accepted', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch doctor data.");
      const data = await response.json();
      setDoctors(data);
      setDataFetched({ ...dataFetched, accepted: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fabric/patient/request', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch pending requests.");
      const data = await response.json();
      setPendingDoctors(data);
      setDataFetched({ ...dataFetched, pending: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, doctorId) => {
    try {
      const response = await fetch(`http://localhost:8080/fabric/patient/request/${doctorId}?status=${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error(`Failed to ${action} doctor.`);
      alert(`Doctor ${action} successful!`);
      refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  const viewHistory = (doctorId) => {
    navigate(`/DoctorHistory/${doctorId}`);
  };

  const refreshData = () => {
    if (status === "Accepted") {
      setDataFetched({ ...dataFetched, accepted: false });
      fetchDoctorData();
    } else {
      setDataFetched({ ...dataFetched, pending: false });
      fetchPendingRequests();
    }
  };

  return (
    <div className="patient-dashboard">
      <div className="navbar">
        Electronic Health Record System
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="container">
        <h2>Patient Dashboard</h2>
        <label htmlFor="status">Choose Status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="refresh-button" onClick={refreshData}>Refresh</button>
      </div>

      {loading && <div className="loading"></div>}

      {status === "Accepted" && (
        <div className="container">
          <h2>Accepted Doctors</h2>
          {doctors.length > 0 ? doctors.map((doctorId) => (
            <div key={doctorId} className="doctor-actions-row">
              <span className="doctor-id-display">Doctor ID: {doctorId}</span>
              <button className="doctor-button view-button" onClick={() => viewHistory(doctorId)}>View History</button>
              <button className="doctor-button revoke-button" onClick={() => handleAction('Revoke', doctorId)}>Revoke</button>
            </div>
          )) : <p>No accepted doctors available.</p>}
        </div>
      )}

      {status === "Pending" && (
        <div className="container">
          <h2>Pending Requests</h2>
          {pendingDoctors.length > 0 ? pendingDoctors.map((doctorId) => (
            <div key={doctorId} className="doctor-actions-row">
              <span className="doctor-id-display">Doctor ID: {doctorId}</span>
              <button className="doctor-button accept-button" onClick={() => handleAction('Accepted', doctorId)}>Accept</button>
              <button className="doctor-button revoke-button" onClick={() => handleAction('Rejected', doctorId)}>Reject</button>
            </div>
          )) : <p>No pending requests available.</p>}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
