import React, { useEffect, useState } from 'react';
import "./../styles/doctor.css";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/fabric/doctor/patients', {
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
      const response = await fetch(`/fabric/doctor/update-pdf?pid=${currentPatientId}&newText=${encodeURIComponent(pdfText)}`, {
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

    const patientId = document.getElementById('patient-id').value.trim();
    if (!patientId) {
      alert('Please enter a patient ID.');
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/fabric/doctor/add-request?pid=${patientId}`, {
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
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
        Electronic Health Record System
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Form to Add Patient Request */}
      <div className="add-request-form">
        <input id="patient-id" placeholder="Enter Patient ID" />
        <button onClick={addRequest} className="add-request-button">Add Request</button>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="loading-spinner"></div>}

      {/* Patient List */}
      <div className="patient-list">
        <h2>Patients</h2>
        {patients.map(patient => (
          <div key={patient.pid} className="patient-card">
            <h4 className="patient-id">Patient ID: {patient.pid}</h4>
            <div>
              <button onClick={() => viewPDF(patient.pid)} className="action-button">View PDF</button>
              <button onClick={() => showEditModal(patient.pid)} className="action-button">Update</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit PDF Modal */}
      {currentPatientId && (
        <div className="modal">
          <h3>Edit PDF for Patient {currentPatientId}</h3>
          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Enter text to append to the PDF"
          />
          <br />
          <button onClick={updatePDF} className="modal-button">Save Changes</button>
          <button onClick={closeEditModal} className="modal-button cancel">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
