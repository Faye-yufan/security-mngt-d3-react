import React, { useEffect, useState } from 'react';
import { Box, Grid, Slider, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
dayjs.extend(utc);

export default function ToggleBar({ dataPoints, onData }) {
  const [inputValue, setInputValue] = useState(1);
  const sendCurToParent = (data) => {
    onData(data);
  };

  useEffect(() => {
    sendCurToParent(inputValue);
  }, [inputValue]);

  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  const formatter = (value) =>
    dayjs(dataPoints[value]?.localtime).utc().format('HH:mm:ss');

  return (
    <Grid container spacing={2} className="toggle-bar">
      <Grid item xs={12} sm={12}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="body1" align="center">
              Select time
            </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              value={formatter(inputValue)}
              onChange={(event) => onChange(event.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid container justifyContent="center">
          <Box sx={{ width: '80%' }}>
            <Slider
              value={inputValue}
              onChange={(event, newValue) => onChange(newValue)}
              valueLabelFormat={formatter}
              min={0}
              max={dataPoints.length}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
