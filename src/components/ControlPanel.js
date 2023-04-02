import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const ControlPanel = ( {selectedCells}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [floorLevel, setFloorLevel] = useState('');

  const handleFloorLevelChange = (event) => {
    setFloorLevel(event.target.value);
  };

  return (
    <>
      <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
        <AddIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="drawer-content" style={{ padding: '16px', width: '300px' }}>
          <h2>Create Assignment</h2>
          <p>Zone</p>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="floor-level-label">Floor Level</InputLabel>
            <Select
              labelId="floor-level-label"
              value={floorLevel}
              onChange={handleFloorLevelChange}
              label="Floor Level"
            >
              <MenuItem value="L0">Ground Floor</MenuItem>
              <MenuItem value="L1">1st Floor</MenuItem>
              <MenuItem value="L2">2nd Floor</MenuItem>
              <MenuItem value="L3">3rd Floor</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth variant="outlined" margin="normal" label="Zone Name" />
          <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Selected Cells"
                value={JSON.stringify(selectedCells)}
                InputProps={{ readOnly: true }}
            />
          <p>Device Information</p>
          <TextField fullWidth variant="outlined" margin="normal" label="Device Name" />
          <TextField fullWidth variant="outlined" margin="normal" label="MAC Address" />
          <p>Personnel Information</p>
          <TextField fullWidth variant="outlined" margin="normal" label="Personnel Name" />
          <TextField fullWidth variant="outlined" margin="normal" label="Employee ID" />
          <TextField fullWidth variant="outlined" margin="normal" label="MAC Address" />
          <TextField fullWidth variant="outlined" margin="normal" label="Email Address" />
          <TextField fullWidth variant="outlined" margin="normal" label="Phone Number" />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Submit
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default ControlPanel;
