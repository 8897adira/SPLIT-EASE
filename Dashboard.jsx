import React from "react";
import "../styles/Dashboard.css";

const Dashboard = ({ setShowSplitScreen }) => {
  const recentSplits = [
    { title: "Goa Trip", total: 4800, date: "Oct 20, 2025" },
    { title: "Team Dinner", total: 1250.86, date: "Oct 15, 2025" },
    { title: "Movie Night", total: 950, date: "Oct 10, 2025" },
  ];

  return (
    <div className="dashboard">
      <h2>
        SPLIT - <span>EASE</span>
      </h2>

      <div className="card total-bill">
        <p>Total Spent</p>
        <h1>₹7,000.86</h1>
        <button onClick={() => setShowSplitScreen(true)}>Split a New Bill</button>
      </div>

      <div className="card recent-splits">
        <p>Your Recent Splits</p>
        <ul>
          {recentSplits.map((s, i) => (
            <li key={i}>
              <div>
                <h4>{s.title}</h4>
                <small>{s.date}</small>
              </div>
              <p>₹{s.total}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card actions">
        <p>Quick Actions</p>
        <div className="buttons">
          <button onClick={() => setShowSplitScreen(true)}>➕ New Split</button>
          <button>📜 View History</button>
          <button>⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
