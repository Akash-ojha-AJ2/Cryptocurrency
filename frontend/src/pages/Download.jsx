import React, { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function DownloadPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/reports`)
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">📁 Available Reports</h3>
      <ul className="list-group">
        {reports.map((report, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            {report.filename}
            <a
              href={`${BACKEND_URL}/api/reports/view/${report.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary"
            >
              Open
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DownloadPage;
