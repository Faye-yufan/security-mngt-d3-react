import React, { useState } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import CreateAssignment from './components/CreateAssignment';
import DropdownList from './components/DropdownList';
import Header from './components/Header';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Ground Floor');

  return (
    <div>
      <Header 
        assignmentBtn="add"
      />
      <div className="app-container">
        <DropdownList 
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="grid-container">
          <InteractiveGrid
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
            selectedOption={selectedOption}
          />
          <CreateAssignment 
            selectedCells={selectedCells}
            assignmentBtn="text"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
