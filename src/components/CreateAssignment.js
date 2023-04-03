import React, { useState } from 'react';
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
import { select } from 'd3';

const CreateAssignment = ({
  selectedCells,
  assignmentBtn,
  onCreateAssignment,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zone, setZone] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [devices, setDevices] = useState([{ deviceName: '', macAddress: '' }]);
  const [personnels, setPersonnels] = useState([
    {
      name: '',
      employeeID: '',
      macAddress: '',
      email: '',
      phone: '',
    },
  ]);

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

  const handlePersonnelChange = (index, field, value) => {
    const newPersonnels = [...personnels];
    newPersonnels[index][field] = value;
    setPersonnels(newPersonnels);
  };

  const addPersonnel = () => {
    setPersonnels([
      ...personnels,
      { name: '', employeeID: '', macAddress: '', email: '', phone: '' },
    ]);
  };

  const removePersonnel = (index) => {
    setPersonnels(personnels.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newAssignment = {
      zoneName: zone,
      floorLevel: floorLevel,
      responsiblePersonnel: [...personnels],
    };
    onCreateAssignment(newAssignment);
    // Clear the form fields here if necessary
    setZone('');
    setFloorLevel('');
    setPersonnels([
      {
        name: '',
        employeeID: '',
        macAddress: '',
        email: '',
        phone: '',
      },
    ]);
    setDevices([{ deviceName: '', macAddress: '' }]);
  };

  return (
    <>
      {renderAssignBtn()}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Assignment</DialogTitle>
        <DialogContent>
          <p className="assignment--information-title">Zone</p>
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
            label="Zone Name"
            onChange={handleZoneChange}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Selected Zones"
            value={JSON.stringify(selectedCells)}
            InputProps={{ readOnly: true }}
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
          <p className="assignment--information-title">Personnel Information</p>
          {personnels.map((personnel, index) => (
            <div key={index}>
              <p>Personnel {index + 1}</p>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Name"
                    value={personnel.name}
                    onChange={(e) =>
                      handlePersonnelChange(index, 'name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Employee ID"
                    value={personnel.employeeID}
                    onChange={(e) =>
                      handlePersonnelChange(index, 'employeeID', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="MAC Address"
                    value={personnel.macAddress}
                    onChange={(e) =>
                      handlePersonnelChange(index, 'macAddress', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Email Address"
                    value={personnel.email}
                    onChange={(e) =>
                      handlePersonnelChange(index, 'email', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Phone Number"
                    value={personnel.phone}
                    onChange={(e) =>
                      handlePersonnelChange(index, 'phone', e.target.value)
                    }
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    color="secondary"
                    onClick={() => removePersonnel(index)}
                    disabled={personnels.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addPersonnel}
            style={{ marginTop: '16px' }}
          >
            Add Personnel
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
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
