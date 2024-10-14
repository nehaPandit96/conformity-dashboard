import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './App.css'; 
import Navbar from './Navbar';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const Dashboard: React.FC = () => {
  const [complianceData, setComplianceData] = useState({
    complianceScore: 0,
    controlsImplemented: 0,
    pendingTasks: 0,
  });
  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    // Fetch compliance data if token exists
    axios.get('http://localhost:4001/api/compliance-data', {
      headers: { Authorization: token }
    })
      .then(response => setComplianceData(response.data))
      .catch(error => setError('Error fetching compliance data'));
  }, [navigate]);

  const chartData = {
    labels: ['Compliance Score', 'Controls Implemented', 'Pending Tasks'],
    datasets: [
      {
        label: 'Compliance Metrics',
        data: [
          complianceData.complianceScore,
          complianceData.controlsImplemented,
          complianceData.pendingTasks,
        ],
        fill: true,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
  console.log("complianceData",complianceData)

  return (
    <div className="app-container"> 
      <Navbar />
      <div className="main-container">
       <header className="container-header">
         <h1>Compliance Dashboard</h1>
         <div className="metrics-container">
           <div className="metric">
             <h3>Compliance Score</h3>
             <p>{complianceData.complianceScore}%</p>
           </div>
           <div className="metric">
             <h3>Controls Implemented</h3>
             <p>{complianceData.controlsImplemented}</p>
           </div>
           <div className="metric">
             <h3>Pending Tasks</h3>
             <p>{complianceData.pendingTasks}</p>
           </div>
         </div>
         <button onClick={() => setShowChart(!showChart)} className="chart-button">
           {showChart ? 'Hide Chart' : 'Show Compliance Chart'}
         </button>
         {showChart && (
           <div className="chart-container">
             <Line data={chartData} options={{ responsive: true }} />
           </div>
         )}
         {error && <p style={{ color: 'red' }}>{error}</p>}
       </header>
      </div>
      <footer className="footer">
        © 2024 Conformity AI. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
