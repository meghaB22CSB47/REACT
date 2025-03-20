import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import Field from './Field';

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

const fields = [
  'diagnosis', 'treatment', 'medications', 'doctorNotes',
  'patientHistory', 'allergies', 'labResults', 'imagingReports',
  'vitalSigns', 'familyHistory', 'lifestyleFactors', 'immunizations',
  'carePlan', 'followUpInstructions'
];

const EHRViewer = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [ehrData, setEhrData] = useState({});
  const [loading, setLoading] = useState(true);

  const patientId = localStorage.getItem('patientId');

  const fetchEHR = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/fabric/doctor/view-ehr?patientId=${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch EHR');
      const data = await response.json();
      setEhrData(data);
    } catch (error) {
      console.error('Error fetching EHR:', error);
      alert('Failed to load EHR data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      const response = await fetch(`/fabric/doctor/update-ehr?patientId=${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({ patientId, ...ehrData })
      });
      if (!response.ok) throw new Error('Failed to update EHR');
      setIsEditing(false);
      alert('EHR updated successfully!');
    } catch (error) {
      console.error('Error updating EHR:', error);
      alert('Failed to update EHR');
    }
  };

  useEffect(() => {
    fetchEHR();
  }, []);

  return (
    <div>
      <Navbar title={`EHR for Patient ID: ${patientId}`} onUpdate={handleUpdate} isEditing={isEditing} />
      <div className="content-wrapper">
        <div className="container">
          {loading ? <Loader /> : fields.map((field) => (
            <Field
              key={field}
              label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={ehrData[field]}
              isEditing={isEditing}
              onChange={(e) => setEhrData({ ...ehrData, [field]: e.target.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EHRViewer;
