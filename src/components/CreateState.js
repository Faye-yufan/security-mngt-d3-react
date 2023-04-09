import React, { useState } from 'react';
import {
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  Select,
  InputLabel,
  Typography,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CreateState = ({ open, handleClose, handleSave }) => {
  const [stateInfo, setStateInfo] = useState({
    name: '',
    staff: [
      {
        name: '',
        macAddress: '',
        email: '',
        phone: '',
      },
    ],
    messages: [''],
    priority: '',
  });
  const [lockedMessages, setLockedMessages] = useState([]);

  const handleChange = (field, value) => {
    setStateInfo({ ...stateInfo, [field]: value });
  };

  const handleStaffChange = (index, field, value) => {
    const newStaff = [...stateInfo.staff];
    newStaff[index][field] = value;
    setStateInfo({ ...stateInfo, staff: newStaff });
  };

  const handleMessagesChange = (index, value) => {
    const newMessages = [...stateInfo.messages];
    newMessages[index] = value;
    setStateInfo({ ...stateInfo, messages: newMessages });
  };

  const addStaff = () => {
    setStateInfo({
      ...stateInfo,
      staff: [
        ...stateInfo.staff,
        { name: '', macAddress: '', email: '', phone: '' },
      ],
    });
  };

  const removeStaff = (index) => {
    const newStaff = stateInfo.staff.filter((_, i) => i !== index);
    setStateInfo({ ...stateInfo, staff: newStaff });
  };

  const addMessage = () => {
    if (stateInfo.messages.length < 4) {
      setStateInfo((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, ''],
      }));
    }
  };

  const lockMessage = (index) => {
    setLockedMessages([...lockedMessages, index]);
  };

  const removeMessage = (index) => {
    const newMessages = stateInfo.messages.filter((_, i) => i !== index);
    setStateInfo({ ...stateInfo, message: newMessages });
  };

  const handleSaveState = () => {
    handleSave(stateInfo);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create State</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container item xs={12} alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="State Name"
                value={stateInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="priority-level-label">Priority</InputLabel>
                <Select labelId="priority-level-label" label="Priority">
                  {/* Add your menu items here */}
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <p className="state--information-title">Staff Information</p>
          {stateInfo.staff.map((staff, index) => (
            <Grid container item xs={12} key={index} spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Staff {index + 1}</Typography>
                  <IconButton
                    color="secondary"
                    onClick={() => removeStaff(index)}
                    disabled={stateInfo.staff.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Grid>
              {/* Add staff input fields here */}
              <Grid container item xs={12} alignItems="center" spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="Name"
                    value={staff.name}
                    onChange={(e) =>
                      handleStaffChange(index, 'name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    label="MAC Address"
                    value={staff.macAddress}
                    onChange={(e) =>
                      handleStaffChange(index, 'macAddress', e.target.value)
                    }
                  />
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Email Address"
                  value={staff.email}
                  onChange={(e) =>
                    handleStaffChange(index, 'email', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  label="Phone Number"
                  value={staff.phone}
                  onChange={(e) =>
                    handleStaffChange(index, 'phone', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addStaff}
              style={{ marginTop: '16px' }}
            >
              Add Staff
            </Button>
          </Grid>
          <p className="state--information-title">Step Messages</p>
          <Grid container spacing={2}>
  {stateInfo.messages.map((message, index) => (
    <Grid item xs={12} sm={10} key={index}>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
        label={`Step Message ${index + 1}`}
        value={message}
        onChange={(e) => handleMessagesChange(index, e.target.value)}
        readOnly={lockedMessages.includes(index)} // Conditionally apply readOnly prop
      />
      {lockedMessages.includes(index) ? (
        <IconButton color="secondary" onClick={() => removeMessage(index)}>
          <RemoveIcon />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          onClick={() => lockMessage(index)}
          disabled={message.length === 0}
        >
          <AddIcon />
        </IconButton>
      )}
    </Grid>
  ))}
  {stateInfo.messages.length < 4 && (
    <Grid item xs={12}>
      <IconButton
        color="primary"
        onClick={addMessage}
        disabled={stateInfo.messages[stateInfo.messages.length - 1].length === 0}
      >
        <AddIcon />
      </IconButton>
    </Grid>
  )}
</Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveState} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateState;
