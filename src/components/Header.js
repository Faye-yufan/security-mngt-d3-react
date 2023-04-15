import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  MailOutline,
  PersonOutline,
  Close as CloseIcon,
} from '@mui/icons-material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CreateAssignment from './CreateAssignment';

const Header = ({ assignmentBtn, dataPointsForTimeCalled }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle Dialog open/close
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRemoveMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (dataPointsForTimeCalled) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `New message: ${new Date().toLocaleString()}`,
      ]);
      setSnackbarOpen(true);
    }
  }, [dataPointsForTimeCalled]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kiana Security & Workflow Management
        </Typography>
        <CreateAssignment assignmentBtn={assignmentBtn} />
        <IconButton color="inherit" onClick={handleDialogOpen}>
          <Badge badgeContent={messages.length} color="error">
            <MailOutline />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <PersonOutline />
        </IconButton>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ marginTop: '64px' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="warning"
            onClose={handleSnackbarClose}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            New security alert!
          </MuiAlert>
        </Snackbar>
        <Dialog onClose={handleDialogClose} open={dialogOpen}>
          <DialogTitle>Mailbox</DialogTitle>
          <DialogContent>
            <List>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveMessage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Header;