import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Important: for Collapse to work
import '../App.css';

function Navbar() {
  const location = useLocation();

  // ✅ Collapse the navbar on link click (especially on mobile)
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: true });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top">
      <Link className="navbar-brand" to="/" onClick={closeNavbar}>🚀 CryptoPulse</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" to="/" onClick={closeNavbar}>Dashboard</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/liveChart' ? 'active' : ''}`}>
            <Link className="nav-link" to="/liveChart" onClick={closeNavbar}>Live Chart</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
            <Link className="nav-link" to="/favorites" onClick={closeNavbar}>Favorites</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/setting' ? 'active' : ''}`}>
            <Link className="nav-link" to="/history" onClick={closeNavbar}>History</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/report-download' ? 'active' : ''}`}>
            <Link className="nav-link" to="/report-download" onClick={closeNavbar}>Download</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
