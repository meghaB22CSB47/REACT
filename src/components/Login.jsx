import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../styles/login.css";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mspId, setMspId] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = new URLSearchParams({ username, password, mspId });

    try {
      const response = await fetch('/fabric/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginData.toString()
      });

      if (!response.ok) throw new Error('Login failed');

      const token = await response.text();
      localStorage.setItem('jwt', token);

      if (username === 'admin') {
        navigate('/admin');
      } else if (mspId === 'Org1MSP') {
        navigate('/DoctorDashboard');
      } else if (mspId === 'Org2MSP') {
        navigate('/PatientDashboard');
      } else {
        alert('Unknown MSP ID');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign In</h1>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <input type="text" placeholder="MSP ID" value={mspId} onChange={(e) => setMspId(e.target.value)} required />
        </div>
        <button type="submit" className="login-btn">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
