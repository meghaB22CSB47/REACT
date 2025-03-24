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
    const loginData = {username,password,mspId}

    try {
      const response = await fetch('http://localhost:8080/fabric/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) throw new Error('Login failed');

      const token = await response.text();
      localStorage.setItem('jwt', token);
      
      if (username === 'admin') {
        navigate('/admin');
      } else if (mspId === 'Org1MSP') {
        navigate('/DoctorDashboard');
      } else if (mspId === 'Org2MSP') {
        navigate('/PatientDashboard');z
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
      <h1 className="login-title">WELCOME</h1>
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input type="text" placeholder="USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <input type="text" placeholder="MSP ID" value={mspId} onChange={(e) => setMspId(e.target.value)} required />
        </div>
        <button type="submit" className="login-btn">SIGN IN</button>
      </form>
      <footer className="footer">
        &copy; 2025 HEALTH LINK. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Login;
