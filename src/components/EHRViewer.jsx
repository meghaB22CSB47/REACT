import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/api';
import Navbar from './Navbar';
import { useSearchParams } from 'react-router-dom';
//import "./../styles/ehr.css";

const EHRViewer = () => {
  const [ehrData, setEhrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  useEffect(() => {
    const fetchEHR = async () => {
      try {
        const data = await fetchWithAuth(`http://localhost:8080/fabric/doctor/view-ehr?patientId=${patientId}`);
        setEhrData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEHR();
  }, [patientId]);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar title={`EHR for Patient ID: ${patientId}`} />
      <h2>Patient EHR Data</h2>
      <pre>{JSON.stringify(ehrData, null, 2)}</pre>
    </div>
  );
};

export default EHRViewer;
