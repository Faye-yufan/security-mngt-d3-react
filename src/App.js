import React, { useState } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import ControlPanel from './components/ControlPanel';
import DropdownList from './components/DropdownList';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);

  return (
    <div className="app-container">
      <DropdownList />
      <InteractiveGrid selectedCells={selectedCells} setSelectedCells={setSelectedCells} />
      <ControlPanel selectedCells={selectedCells} />
    </div>
  );
}

export default App;
