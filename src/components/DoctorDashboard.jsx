import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewPDF = (patientId) => {
    localStorage.setItem('patientId', patientId);
    navigate('/EHRViewer');
  };

  const updatePDF = async () => {
    if (!pdfText.trim()) {
      alert("Please enter text to update the PDF.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/fabric/doctor/update-pdf?pid=${currentPatientId}&newText=${encodeURIComponent(pdfText)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (response.ok) {
        alert("PDF updated successfully!");
        setPdfText("");
      } else {
        alert("Failed to update PDF");
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
    } finally {
      setLoading(false);
      setCurrentPatientId(null);
    }
  };

  const addRequest = async () => {
    const patientId = document.getElementById('patient-id').value;
    if (!patientId.trim()) {
      alert("Please enter a patient ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/fabric/doctor/add-request?pid=${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (response.ok) {
        alert("Request added successfully!");
        fetchPatients();
      } else {
        alert("Failed to add request");
      }
    } catch (error) {
      console.error('Error adding request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar with Title */}
      <Navbar title="Doctor Dashboard" />

      {/* Add Request */}
      <div className="form-container">
        <input type="text" id="patient-id" placeholder="Enter Patient ID" />
        <button className="add-button" onClick={addRequest}>Add Request</button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Patient List */}
      <div className="patient-list">
        {patients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          patients.map((patient) => (
            <div key={patient.pid} className="patient-item">
              <h4>Patient ID: {patient.pid}</h4>
              <div>
                <button className="view-button" onClick={() => viewPDF(patient.pid)}>View PDF</button>
                <button className="update-button" onClick={() => setCurrentPatientId(patient.pid)}>Update</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Update Modal */}
      {currentPatientId && (
        <div className="edit-modal">
          <h3>Edit PDF for Patient {currentPatientId}</h3>
          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Enter text to append to the PDF"
          />
          <button onClick={updatePDF}>Save Changes</button>
          <button onClick={() => setCurrentPatientId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
