import React, { useState, useEffect } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import CreateAssignment from './components/CreateAssignment';
import DropdownList from './components/DropdownList';
import Header from './components/Header';
import ToggleBar from './components/ToogleBar';
import AssignmentHistory from './components/AssignmentHistory';
import Legend from './components/Legend';
import axios from 'axios';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedOption, setSelectedOption] = useState('3rd Floor');
  const [assignments, setAssignments] = useState([]);
  const [editingAssignmentIndex, setEditingAssignmentIndex] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [deviceColors, setDeviceColors] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [dataPointsForTimeCalled, setDataPointsForTimeCalled] = useState(false);

  useEffect(() => {
    fetch('/data_0910_3rd_5min_500ms.json')
      .then((response) => response.json())
      .then((data) => setDataPoints(data));
  }, []);

  useEffect(() => {
    const storedAssignments = localStorage.getItem('assignments');
    const storedSelectedCells = localStorage.getItem('selectedCells');
    const storedDeviceColors = localStorage.getItem('deviceColors');

    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }

    if (storedSelectedCells) {
      setSelectedCells(JSON.parse(storedSelectedCells));
    }

    if (storedDeviceColors) {
      setDeviceColors(JSON.parse(storedDeviceColors));
    }
  }, []);

  const handleCreateAssignment = (newAssignment, selectedCells) => {
    const newAssignments = [
      ...assignments,
      { ...newAssignment, selectedCells },
    ];
    setAssignments(newAssignments);

    // Set colors for the devices
    const newDeviceColors = { ...deviceColors };
    newAssignment.devices.forEach((device) => {
      newDeviceColors[device.macAddress] = 'blue';
    });
    setDeviceColors(newDeviceColors);

    // Save the updated assignments and selected cells to local storage
    localStorage.setItem('assignments', JSON.stringify(newAssignments));
    localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
    localStorage.setItem('deviceColors', JSON.stringify(newDeviceColors));
  };

  const openCreateAssignmentForm = () => {
    setFormOpen(true);
  };

  const handleEditAssignment = (index) => {
    setEditingAssignmentIndex(index);
    openCreateAssignmentForm();

    localStorage.setItem('assignments', JSON.stringify(assignments));
  };

  const handleRemoveAssignment = (index) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(newAssignments);

    // Save the updated assignments to local storage
    localStorage.setItem('assignments', JSON.stringify(newAssignments));
  };

  const handleDataPointsForTime = async (dataPoints, assignments) => {
    setDataPointsForTimeCalled(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/', {
        dataPoints,
        assignments,
      });
      // Handle the response from the Django backend
      console.log(response.data);
    } catch (error) {
      // Handle any errors
      console.error('Error sending data points:', error);
    }
    setDataPointsForTimeCalled(false);
  };

  const [manualCurrentIdx, setManualCurrentIdx] = useState(0);
  const handleManualCurrentIdx = (data) => {
    setManualCurrentIdx(data);
  };
  useEffect(() => {}, [manualCurrentIdx]);

  return (
    <div>
      <Header
        assignmentBtn="add"
        dataPointsForTimeCalled={dataPointsForTimeCalled}
      />
      <div className="app-container">
        <div>
          <Legend />
        </div>
        <div>
          <InteractiveGrid
            dataPoints={dataPoints}
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
            selectedOption={selectedOption}
            assignments={assignments}
            deviceColors={deviceColors}
            manualCurrentIdx={manualCurrentIdx}
            onDataPointsForTime={handleDataPointsForTime}
          />
        </div>
        <div className="grid-container">
          <ToggleBar dataPoints={dataPoints} onData={handleManualCurrentIdx} />
          <DropdownList
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <div className="assignment">
            <CreateAssignment
              selectedCells={selectedCells}
              setSelectedCells={setSelectedCells}
              assignmentBtn="text"
              onCreateAssignment={handleCreateAssignment}
              assignmentToEdit={
                editingAssignmentIndex !== null
                  ? assignments[editingAssignmentIndex]
                  : null
              }
              formOpen={formOpen}
              setFormOpen={setFormOpen}
            />
            <AssignmentHistory
              assignments={assignments}
              onEditAssignment={handleEditAssignment}
              onRemoveAssignment={handleRemoveAssignment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
