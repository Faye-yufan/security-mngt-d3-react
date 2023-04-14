import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CreateState from './CreateState';

const CreateAssignment = ({
  selectedCells,
  setSelectedCells,
  assignmentBtn,
  onCreateAssignment,
  assignmentToEdit,
  formOpen,
  setFormOpen,
}) => {
  const [zone, setZone] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [devices, setDevices] = useState([{ deviceName: '', macAddress: '' }]);
  const [states, setStates] = useState([]);
  const [editingStateIndex, setEditingStateIndex] = useState(null);
  const [stateFormOpen, setStateFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createStateOpen, setCreateStateOpen] = useState(false);
  const [isEditingState, setIsEditingState] = useState(false);

  useEffect(() => {
    if (assignmentToEdit) {
      setZone(assignmentToEdit.zoneName);
      setFloorLevel(assignmentToEdit.floorLevel);
      setDevices(assignmentToEdit.devices);
      setStates(assignmentToEdit.states);
    } else {
      setZone('');
      setFloorLevel('');
      setDevices([{ deviceName: '', macAddress: '' }]);
      setStates([]);
    }
  }, [assignmentToEdit]);

  useEffect(() => {
    if (assignmentToEdit) {
      setSelectedCells(assignmentToEdit.selectedCells || []);
    }
  }, [assignmentToEdit, setSelectedCells]);

  const renderAssignBtn = () => {
    if (assignmentBtn === 'add') {
      return (
        <IconButton
          variant="contained"
          color="inherit"
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </IconButton>
      );
    } else if (assignmentBtn === 'text') {
      return (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Create Assignment
        </Button>
      );
    }
  };

  const handleFloorLevelChange = (event) => {
    setFloorLevel(event.target.value);
  };

  const handleZoneChange = (event) => {
    setZone(event.target.value);
  };

  const handleDeviceChange = (index, field, value) => {
    const newDevices = [...devices];
    newDevices[index][field] = value;
    setDevices(newDevices);
  };

  const addDevice = () => {
    setDevices([...devices, { deviceName: '', macAddress: '' }]);
  };

  const removeDevice = (index) => {
    setDevices(devices.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newAssignment = {
      zoneName: zone,
      floorLevel: floorLevel,
      devices: [...devices],
      states: [...states],
    };
    onCreateAssignment(newAssignment, selectedCells);
    // Clear the form fields here if necessary
    setZone('');
    setFloorLevel('');
    setSelectedCells([]);
    setDevices([{ deviceName: '', macAddress: '' }]);
    setStates([]);
  };

  const handleOpenCreateState = () => {
    setCreateStateOpen(true);
  };

  const handleCloseCreateState = () => {
    setCreateStateOpen(false);
    setIsEditingState(false);
  };

  const handleSaveState = (newState) => {
    setStates([...states, newState]);
  };

  const removeState = (index) => {
    const newStates = states.filter((_, i) => i !== index);
    setStates(newStates);
  };

  const openStateForm = () => {
    setStateFormOpen(true);
  };

  const handleEditState = (index) => {
    setEditingStateIndex(index);
    setIsEditingState(true);
    openStateForm();
  };

  return (
    <>
      {renderAssignBtn()}
      <Dialog
        open={dialogOpen || formOpen}
        onClose={() => {
          setDialogOpen(false);
          setFormOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Assignment</DialogTitle>
        <DialogContent>
          <p className="assignment--information-title">Process Zone</p>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="floor-level-label">Floor Level</InputLabel>
            <Select
              labelId="floor-level-label"
              value={floorLevel}
              onChange={handleFloorLevelChange}
              label="Floor Level"
            >
              <MenuItem value="Ground">Ground Floor</MenuItem>
              <MenuItem value="L1">1st Floor</MenuItem>
              <MenuItem value="L2">2nd Floor</MenuItem>
              <MenuItem value="L3">3rd Floor</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Process Name"
            value={zone}
            onChange={handleZoneChange}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Selected Zones"
            value={JSON.stringify(selectedCells)}
            InputProps={{ readOnly: true }}
            disabled
          />
          <p className="assignment--information-title">Device Information</p>
          {devices.map((device, index) => (
            <div>
              <p>Device {index + 1}</p>
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Device Name"
                  value={device.deviceName}
                  onChange={(e) =>
                    handleDeviceChange(index, 'deviceName', e.target.value)
                  }
                  style={{ marginRight: '8px' }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="MAC Address"
                  value={device.macAddress}
                  onChange={(e) =>
                    handleDeviceChange(index, 'macAddress', e.target.value)
                  }
                  style={{ marginRight: '8px' }}
                />
                <IconButton
                  color="secondary"
                  onClick={() => removeDevice(index)}
                  disabled={devices.length === 1}
                >
                  <RemoveIcon />
                </IconButton>
              </div>
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addDevice}
            style={{ marginTop: '16px' }}
          >
            Add Device
          </Button>
          <p className="assignment--information-title">State Information</p>
          {states.map((state, index) => (
            <div key={index}>
              <p>{state.name}</p>
              <IconButton color="secondary" onClick={() => removeState(index)}>
                <RemoveIcon />
              </IconButton>
              <Button onClick={() => handleEditState(index)}>Edit</Button>
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateState}
          >
            Add State
          </Button>
          <CreateState
            open={createStateOpen || isEditingState}
            handleClose={handleCloseCreateState}
            handleSave={handleSaveState}
            stateToEdit={
              editingStateIndex !== null
                ? states[editingStateIndex]
                : null
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setFormOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateAssignment;
