<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React, { useEffect, useState, useRef } from 'react';
>>>>>>> acf62be4877130ff5f637f646e39972771c1375a
import "./../styles/doctor.css";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const patientIdRef = useRef(null); // Use ref for the input field

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fabric/doctor/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  };

  const viewPDF = (patientId) => {
    localStorage.setItem('patientId', patientId);
    window.location.href = '/EHRViewer';
  };

  const showEditModal = (patientId) => {
    setCurrentPatientId(patientId);
    setPdfText('');
  };

  const closeEditModal = () => {
    setCurrentPatientId(null);
  };

  const updatePDF = async () => {
    if (!pdfText.trim()) {
      alert('Please enter text to update the PDF.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/fabric/doctor/update-pdf?pid=${currentPatientId}&newText=${encodeURIComponent(pdfText)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update PDF');
      alert('PDF updated successfully!');
      viewPDF(currentPatientId);
      closeEditModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const patientId = patientIdRef.current.value.trim(); // Access the input value using ref
    if (!patientId) {
      alert('Please enter a patient ID.');
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/fabric/doctor/add-request?pid=${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to add request');
      alert('Request added successfully!');
      fetchPatients();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="doctor-dashboard-container">
      {/* Navbar */}
      <div className="doctor-navbar">
        Electronic Health Record System
        <button onClick={handleLogout} className="doctor-logout-button">Logout</button>
      </div>

      {/* Form to Add Patient Request */}
      <div className="doctor-add-request-form">
        <input ref={patientIdRef} placeholder="Enter Patient ID" />
        <button onClick={addRequest} className="doctor-add-request-button">Add Request</button>
      </div>

      {/* Patient List */}
      {/* Patient List */}
      <div className="doctor-patient-list">
      <h2>Patients</h2>
      {patients.map(patient => (
        <div key={patient.pid} className="doctor-patient-card">
          <span>Patient ID: {patient.pid}</span>
          <button onClick={() => viewPDF(patient.pid)} className="doctor-action-button">View PDF</button>
          <button onClick={() => showEditModal(patient.pid)} className="doctor-action-button">Update</button>
        </div>
      ))}
      </div>

      {/* Edit PDF Modal */}
      {currentPatientId && (
        <div className="doctor-modal">
          <h3>Edit PDF for Patient {currentPatientId}</h3>
          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Enter text to append to the PDF"
          />
          <button onClick={updatePDF} className="doctor-modal-button">Save Changes</button>
          <button onClick={closeEditModal} className="doctor-modal-button doctor-cancel">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;