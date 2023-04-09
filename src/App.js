import React, { useState, useEffect } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import CreateAssignment from './components/CreateAssignment';
import DropdownList from './components/DropdownList';
import Header from './components/Header';
import AssignmentHistory from './components/AssignmentHistory';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Ground Floor');
  const [assignments, setAssignments] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [deviceColors, setDeviceColors] = useState({});

  useEffect(() => {
    fetch('/data_0910_1st_5min_500ms.json')
      .then((response) => response.json())
      .then((data) => setDataPoints(data));
  }, []);

  const handleCreateAssignment = (newAssignment, selectedCells) => {
    setAssignments((prevAssignments) => [
      ...prevAssignments,
      { ...newAssignment, selectedCells },
    ]);

    // Set colors for the devices
    const newDeviceColors = { ...deviceColors };
    newAssignment.devices.forEach((device) => {
      newDeviceColors[device.macAddress] = 'red';
    });
    setDeviceColors(newDeviceColors);
  };

  return (
    <div>
      <Header assignmentBtn="add" />
      <div className="app-container">
        <DropdownList
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="grid-container">
          <InteractiveGrid
            dataPoints={dataPoints}
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
            selectedOption={selectedOption}
            assignments={assignments}
            deviceColors={deviceColors}
          />
          <CreateAssignment
            selectedCells={selectedCells}
            assignmentBtn="text"
            onCreateAssignment={handleCreateAssignment}
          />
          <AssignmentHistory assignments={assignments} />
        </div>
      </div>
    </div>
  );
}

export default App;
