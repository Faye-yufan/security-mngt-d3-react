import React, { useState } from 'react';

function DropdownList() {
  const [selectedOption, setSelectedOption] = useState('Ground Floor');

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleSelect}>
        <option value="Ground Floor">Ground Floor</option>
        <option value="1st Floor">1st Floor</option>
        <option value="2nd Floor">2nd Floor</option>
        <option value="3rd Floor">3rd Floor</option>
      </select>
      <p>You have selected: {selectedOption}</p>
    </div>
  );
}

export default DropdownList;
