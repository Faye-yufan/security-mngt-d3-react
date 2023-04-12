import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const AssignmentHistory = ({ 
  assignments,
  onEditAssignment,
  onRemoveAssignment,
 }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Assignment History
      </Typography>
      <List>
        {assignments.map((assignment, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={assignment.zoneName}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Floor Level: {assignment.floorLevel}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    Devices:{' '}
                    {assignment.devices.map((device) => device.name).join(', ')}
                  </Typography>
                  <br />
                </>
              }
            />
            <Button onClick={() => onEditAssignment(index)}>Edit</Button>
            <Button onClick={() => onRemoveAssignment(index)}>
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AssignmentHistory;
