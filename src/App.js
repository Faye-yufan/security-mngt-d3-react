import React, { useState } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import ControlPanel from './components/ControlPanel';
import DropdownList from './components/DropdownList';
import Header from './components/Header';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);

  return (
    <div>
      <Header />
      <div className="app-container">
        <DropdownList />
        <div className="grid-container">
          <InteractiveGrid
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
          />
          <ControlPanel selectedCells={selectedCells} />
        </div>
      </div>
    </div>
  );
}

export default App;
