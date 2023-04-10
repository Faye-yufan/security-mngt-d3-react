import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const AssignmentHistory = ({ assignments }) => {
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
                    {assignment.devices
                      .map((device) => device.name)
                      .join(', ')}
                  </Typography>
                  <br />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AssignmentHistory;
