import React, { useState, useEffect } from 'react';
import InteractiveGrid from './components/InteractiveGrid';
import CreateAssignment from './components/CreateAssignment';
import DropdownList from './components/DropdownList';
import Header from './components/Header';
import AssignmentHistory from './components/AssignmentHistory';
import axios from 'axios';

function App() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Ground Floor');
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

  const handleCreateAssignment = (newAssignment, selectedCells) => {
    setAssignments((prevAssignments) => [
      ...prevAssignments,
      { ...newAssignment, selectedCells },
    ]);

    // Set colors for the devices
    const newDeviceColors = { ...deviceColors };
    newAssignment.devices.forEach((device) => {
      newDeviceColors[device.macAddress] = 'blue';
    });
    setDeviceColors(newDeviceColors);
  };

  const openCreateAssignmentForm = () => {
    setFormOpen(true);
  };

  const handleEditAssignment = (index) => {
    setEditingAssignmentIndex(index);
    openCreateAssignmentForm();
  };

  const handleRemoveAssignment = (index) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((_, i) => i !== index)
    );
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

  return (
    <div>
      <Header 
      assignmentBtn="add"
      dataPointsForTimeCalled={dataPointsForTimeCalled} />
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
            onDataPointsForTime={handleDataPointsForTime}
          />
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
  );
}

export default App;
