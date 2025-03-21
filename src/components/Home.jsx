import React from 'react';
import '../styles/home.css';



const Home = () => {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="home-page-container">
      {/* Header Section */}
      <header className="home-header">
        <div className="home-logo">HEALTH LINK</div>
        <button className="home-login-btn" onClick={handleLogin}>Login</button>
      </header>

      {/* Hero Section */}
      <section className="home-hero">
        <h1>WELCOME TO <span className="home-highlight">HEALTH LINK</span></h1>
        <p>
          <strong>HealthLink</strong> is a blockchain-based <strong>Electronic Health Record (EHR)</strong> system.
          Built on <strong>Hyperledger Fabric</strong> for security, decentralization, and transparency.
        </p>

      </section>

      {/* Features Section */}
      <section className="home-features">
        <div className="feature-card">
          <h3>Secure Data Management</h3>
          <p>Blockchain ensures tamper-proof medical records.</p>
        </div>

        <div className="feature-card">
          <h3>Enhanced Privacy</h3>
          <p>Patients retain ownership and control over data.</p>
        </div>

        <div className="feature-card">
          <h3>Seamless Access</h3>
          <p>Healthcare providers access records with patient consent.</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        &copy; 2025 HEALTH LINK. All Rights Reserved.
      </footer>
    </div>
  );
};


  


export default Home;
