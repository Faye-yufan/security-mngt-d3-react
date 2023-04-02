import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function DropdownList({ selectedOption, setSelectedOption }) {
  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="floor-level-label">Floor Level</InputLabel>
        <Select
          labelId="floor-level-label"
          value={selectedOption}
          onChange={handleSelect}
          label="Floor Level"
        >
          <MenuItem value="Ground Floor">Ground Floor</MenuItem>
          <MenuItem value="1st Floor">1st Floor</MenuItem>
          <MenuItem value="2nd Floor">2nd Floor</MenuItem>
          <MenuItem value="3rd Floor">3rd Floor</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default DropdownList;
