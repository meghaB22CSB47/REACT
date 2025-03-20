import React from 'react';
import { fetchWithAuth } from '../api/api';

const Home = () => {
  const fetchData = async () => {
    try {
      const data = await fetchWithAuth('/api/protected');
      console.log('Protected data:', data);
      alert('Protected data fetched. Check console.');
    } catch (error) {
      console.error('Error fetching protected data:', error);
      alert('Failed to fetch data.');
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={fetchData}>Fetch Protected Data</button>
    </div>
  );
};

export default Home;
