import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Download from './pages/Download';
import Favorites from './pages/Favorites';
import LiveChart from './pages/LiveChart';
import History from './pages/Histroy'; // Typo: Consider renaming to History.jsx
import Navbar from './Layout/Navbar';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <>
    <div className="container-fluid p-0">
      <Navbar />
      <main style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/liveChart" element={<LiveChart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/report-download" element={<Download />} />
        <Route path="/history" element={<History />} />
      </Routes>
      </main>
      </div>
    </>
  );
}

export default App;
