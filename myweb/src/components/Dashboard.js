import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [clientsEnregistres, setClientsEnregistres] = useState(0);
  const [commandeStatus, setCommandeStatus] = useState(0);
  const [barData, setBarData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Clients enregistrés',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Demandes reçues',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compteClientResponse, commandeResponse] = await Promise.all([
          fetch('http://192.168.209.25:4000/api/compteclient'),
          fetch('http://192.168.209.25:4000/api/commande'),
        ]);

        const compteClientData = await compteClientResponse.json();
        const commandeData = await commandeResponse.json();

        // Clients enregistrés (utilisateurs et comptes clients)
        const totalClientsEnregistres = compteClientData.length;
        setClientsEnregistres(totalClientsEnregistres);

        // Commandes reçues
        setCommandeStatus(commandeData.length); // Total des commandes reçues

        // Données pour le graphique
        setBarData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Clients enregistrés',
              data: generateMonthlyData(compteClientData),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Demandes reçues',
              data: generateMonthlyData(commandeData),
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Historique des commandes
        setRecentOrders(commandeData);

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const generateMonthlyData = (data) => {
    if (!Array.isArray(data)) {
      console.error('Données des commandes incorrectes:', data);
      return Array(12).fill(0); // Retourne un tableau vide si les données ne sont pas correctes
    }
    const monthlyData = Array(12).fill(0);
    data.forEach((item) => {
      if (item.date && item.date instanceof Date) {
        const month = item.date.getMonth();
        if (month >= 0 && month < 12) {
          monthlyData[month] += 1;
        }
      }
    });
    return monthlyData;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-cards">
          <div className="card blue-card">
            <h4>Clients Enregistrés</h4>
            <p>{clientsEnregistres}</p>
          </div>
          <div className="card yellow-card">
            <h4>Commandes</h4>
            <p>{commandeStatus}</p>
          </div>
          <div className="card red-card">
            <h4>Pharmacies</h4>
            <p>{0 /* Remplacez ce chiffre avec la récupération des pharmacies si nécessaire */}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-chart-container">
          <Bar
            data={barData}
            options={{
              scales: {
                y: { beginAtZero: true },
              },
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Clients enregistrés et Commandes par Mois' },
              },
            }}
          />
        </div>

        <div className="recent-orders">
          <h4>Historique des Commandes</h4>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Nom du Client</th>
                <th>Matricule</th>
                <th>Nom de Commande</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order, index) => (
                <tr key={index}>
                  <td>{order.clientName}</td>
                  <td>{order.matricule}</td>
                  <td>{order.commandeName}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
