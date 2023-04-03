import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, MenuItem, Menu } from '@mui/material';
import { Add, MailOutline, PersonOutline } from '@mui/icons-material';
import CreateAssignment from './CreateAssignment';

const Header = ({ assignmentBtn }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kiana
        </Typography>
        {/* <Box>
          <IconButton onClick={handleClick}>
            <Typography>Ground Floor</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Ground Floor</MenuItem>
            <MenuItem onClick={handleClose}>1st Floor</MenuItem>
            <MenuItem onClick={handleClose}>2nd Floor</MenuItem>
          </Menu>
        </Box> */}
        <CreateAssignment assignmentBtn={assignmentBtn}/>
        <IconButton color="inherit">
          <MailOutline />
        </IconButton>
        <IconButton color="inherit">
          <PersonOutline />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
