import React from 'react';
import '../utils/Legend.css';

const Legend = () => {
  return (
    <div className="legend-container">
      <div className="legend">
        <ul>
          <li>
            <span className="legend-item machine"></span> Machine of Interest
          </li>
          <li>
            <span className="legend-item issue"></span> Machine with issue
          </li>
          <li>
            <span className="legend-item staff"></span> Staff Member
          </li>
          <li>
            <span className="legend-item unauthorized"></span> Unauthorized
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Legend;
