import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import firstFloorImageUrl from '../asset/floor-1-ground.png';
import secondFloorImageUrl from '../asset/floor-2-first.png';
import thirdFloorImageUrl from '../asset/floor-3-second.png';
import fourthFloorImageUrl from '../asset/floor-4-third.png';

const InteractiveGrid = ({
  dataPoints,
  selectedCells,
  setSelectedCells,
  selectedOption,
  assignments,
  deviceColors,
  onDataPointsForTime,
}) => {
  const [gridSize, setGridSize] = useState(14);
  const [startPlotting, setStartPlotting] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [currentDataPoints, setCurrentDataPoints] = useState([]);
  const startPlottingRef = useRef(startPlotting);
  const svgRef = useRef();
  let updatedSelectedCells = [...selectedCells];

  useEffect(() => {
    const width = 700;
    const height = 700;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    startPlottingRef.current = startPlotting;
    const xScale = d3.scaleLinear().domain([0, gridSize]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, gridSize]).range([0, height]);

    // Create a group for the image
    const imageGroup = svg.append('g');

    // Create a group for the overlay layer
    const overlayGroup = svg.append('g');

    const backgroundImageUrl = () => {
      switch (selectedOption) {
        case 'Ground Floor':
          return firstFloorImageUrl;
        case '1st Floor':
          return secondFloorImageUrl;
        case '2nd Floor':
          return thirdFloorImageUrl;
        case '3rd Floor':
          return fourthFloorImageUrl;
        default:
          return firstFloorImageUrl;
      }
    };

    imageGroup
      .append('image')
      .attr('xlink:href', backgroundImageUrl)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('pointer-events', 'none');
    // Reorder the groups so that the overlay group is between the image group and the grid group
    imageGroup.raise(); // Bring the image group to the top
    overlayGroup.raise(); // Bring the overlay group to the top (above the image group)

    // Add a semi-transparent white rectangle to the overlay group
    overlayGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white')
      .attr('opacity', 0.5);

    // Create a group for the grid lines
    const gridGroup = svg.append('g');

    // Create a group for the rectangles
    const rectGroup = svg.append('g');

    const drawGrid = () => {
      gridGroup.selectAll('.grid-line').remove();

      const gridLines = d3.range(0, gridSize + 1);

      // Vertical lines
      gridGroup
        .selectAll('.grid-line-vertical')
        .data(gridLines)
        .enter()
        .append('line')
        .attr('class', 'grid-line grid-line-vertical')
        .attr('x1', (d) => xScale(d))
        .attr('x2', (d) => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'grey')
        .attr('opacity', 0.6)
        .attr('stroke-width', 1);

      // Horizontal lines
      gridGroup
        .selectAll('.grid-line-horizontal')
        .data(gridLines)
        .enter()
        .append('line')
        .attr('class', 'grid-line grid-line-horizontal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .attr('stroke', 'grey')
        .attr('opacity', 0.6)
        .attr('stroke-width', 1);
    };

    drawGrid();

    // render the assigned cells first
    const renderAssignedCells = () => {
      assignments.forEach((assignment) => {
        const zoneName = assignment.zoneName;

        let firstCellInAssignment;
        assignment.selectedCells.forEach((cell, index) => {
          const cellId = `cell-${cell.x}-${cell.y}`;
          const existingCell = rectGroup.select(`#${cellId}`);

          if (existingCell.empty()) {
            rectGroup
              .append('rect')
              .attr('id', cellId)
              .attr('x', xScale(cell.x))
              .attr('y', yScale(cell.y))
              .attr('width', xScale(1) - xScale(0))
              .attr('height', yScale(1) - yScale(0))
              .attr('fill', '#CBC568')
              .attr('opacity', 0.5);
          }

          if (index === 0) {
            firstCellInAssignment = cell;
          }
        });

        // Add the surrounding square
        rectGroup
          .append('rect')
          .attr('class', 'zone-name-tag-bg')
          .attr('x', xScale(firstCellInAssignment.x) + xScale(1) + 2 - 2) // Adjust the position as needed
          .attr('y', yScale(firstCellInAssignment.y) - 20) // Adjust the position as needed
          .attr('width', zoneName.length * 6 * 2) // Adjust the width based on the length of the zone name
          .attr('height', 25) // Adjust the height as needed
          .attr('fill', '#DCDCDC')
          .attr('opacity', 0.8);

        // Add the zone name tag
        rectGroup
          .append('text')
          .attr('class', 'zone-name-tag')
          .attr('x', xScale(firstCellInAssignment.x) + xScale(1) + 2) // Adjust the position as needed
          .attr('y', yScale(firstCellInAssignment.y) - 2) // Adjust the position as needed
          .attr('font-size', '24px')
          .attr('font-weight', 'bold')
          .attr('fill', 'black')
          .attr('opacity', 0.8)
          .text(zoneName);
      });
    };

    renderAssignedCells();

    // plot the current data points
    const plotDataPoint = (rectGroup, dataPoint, deviceColors) => {
      const x = dataPoint.projected_norm_x;
      const y = dataPoint.projected_norm_y;
      const isInDeviceColors = deviceColors[dataPoint.ClientMacAddr];
      const staffOrDevice = dataPoint["Staff/Device"];
    
      // Selected fixed device but the state has not occurred yet
      const isFixedNormal =
        isInDeviceColors && dataPoint.localtime < 1568121986000;
      // Selected fixed device and the state has occurred
      const isFixedWithState =
        isInDeviceColors && dataPoint.localtime >= 1568121986000;
      // is staff but not specifically for this device
      const isStaff = dataPoint['Staff ID'] !== 'nan';
    
      let color, size, alpha, strokeWidth, stroke;
    
      if (isFixedNormal) {
        color = '#0096FF';
        size = 8;
        alpha = 1;
        strokeWidth = 3;
        stroke = 'black';
      } else if (isFixedWithState) {
        color = 'red';
        size = 10;
        alpha = 1;
        strokeWidth = 2;
        stroke = 'black';
      } else if (isStaff) {
        color = 'orange';
        size = 7;
        alpha = 1;
        strokeWidth = 0;
        stroke = 'transparent';
      } else {
        // Default case
        color = 'black';
        size = 5;
        alpha = 0.5;
        strokeWidth = 0;
        stroke = 'transparent';
      }
    
      // Show tooltip
      const showTooltip = (event) => {
        const tooltip = document.getElementById("tooltip");
        const content = `
          <strong>${staffOrDevice}</strong><br/>
          ClientMacAddr: ${dataPoint.ClientMacAddr}`;
    
        tooltip.innerHTML = content;
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
        tooltip.style.display = "block";
      };
    
      // Hide tooltip
      const hideTooltip = () => {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
      };
    
      // Plot the data point
      rectGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', height - y)
        .attr('r', size)
        .attr('fill', color)
        .attr('opacity', alpha)
        .attr('pointer-events', 'all')
        .style('stroke', stroke)
        .style('stroke-width', strokeWidth)
        .on('mouseover', showTooltip)
        .on('mousemove', showTooltip)
        .on('mouseout', hideTooltip);
    };    

    const startPlottingDataPoints = (currentTimeIndex) => {
      const startTime = dataPoints[0].localtime; // get the start time of the data
      const timeDiff = 500; // set the time interval to plot data
      let currentIndex = currentTimeIndex;

      const plotDataPoints = () => {
        if (!startPlottingRef.current) {
          return; // If the "Stop" button is clicked, stop the function execution
        }

        // clear previous data points
        rectGroup.selectAll('circle').remove();

        // get the current time window
        const currentTime = startTime + currentIndex * timeDiff;
        const currentData = dataPoints.filter(
          (d) =>
            d.localtime >= currentTime && d.localtime < currentTime + timeDiff
        );
        setCurrentDataPoints((prevCurrentDataPoints) => currentData);

        // Check if the current time is 13:26:26
        if (
          currentData.length !== 0 &&
          currentData[0].localtime === 1568121986000
        ) {
          onDataPointsForTime(currentData, assignments);
        }

        currentData.forEach((dataPoint) => {
          plotDataPoint(rectGroup, dataPoint, deviceColors);
          // Update the timer display
          const timerDisplay = document.getElementById('timer');
          const date = new Date(dataPoint.localtime);
          const londonTimeOptions = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          };
          const londonTime = date.toLocaleString('en-GB', londonTimeOptions);
          const fractionalSeconds = date.getMilliseconds();

          timerDisplay.textContent = `${londonTime}.${
            fractionalSeconds ? '5' : '0'
          }`;
        });

        currentIndex++;
        setCurrentTimeIndex((prevDataIndex) => currentIndex);

        // set timeout to plot the next data points
        if (currentIndex < dataPoints.length) {
          setTimeout(plotDataPoints, timeDiff);
        }
      };

      plotDataPoints();
    };

    if (startPlotting) {
      startPlottingDataPoints(currentTimeIndex);
    } else {
      currentDataPoints.forEach((dataPoint) => {
        plotDataPoint(rectGroup, dataPoint, deviceColors);
      });
    }

    svg.on('click', (event) => {
      const coords = d3.pointer(event);

      const x = Math.floor(xScale.invert(coords[0]));
      const y = Math.floor(yScale.invert(coords[1]));

      const cellId = `cell-${x}-${y}`;
      const assignedCells = assignments
        .map((assignment) => assignment.selectedCells)
        .reduce((acc, selectedCells) => acc.concat(selectedCells), []);

      const existingCell = rectGroup.select(`#${cellId}`);

      if (!existingCell.empty()) {
        // Check if the cell is assigned
        const isAssigned = assignedCells.some(
          (cell) => cell.x === x && cell.y === y
        );

        // If the cell is already highlighted, and not being assigned, remove the highlight
        if (!isAssigned) {
          existingCell.remove();
          updatedSelectedCells = updatedSelectedCells.filter(
            (cell) => cell.x !== x || cell.y !== y
          );
        }
      } else {
        updatedSelectedCells = [...updatedSelectedCells, { x, y }];
        rectGroup
          .append('rect')
          .attr('id', cellId)
          .attr('x', xScale(x))
          .attr('y', yScale(y))
          .attr('width', xScale(1) - xScale(0))
          .attr('height', yScale(1) - yScale(0))
          .attr('fill', '#CBC568')
          .attr('opacity', 0.5);
      }
      setSelectedCells((prevSelectedCells) => updatedSelectedCells);
    });
  }, [gridSize, selectedOption, assignments, startPlotting]);

  return (
    <div className="interactive-grid">
      <button onClick={() => setStartPlotting(!startPlotting)}>
        {startPlotting ? 'Stop' : 'Start'}
      </button>
      <div id="timer" style={{ fontSize: '20px', fontWeight: 'bold' }}></div>
      <br />
      <svg ref={svgRef} />
      <p>Adjust Selection Size</p>
      <input
        className="interactive-grid--toggle"
        type="range"
        min="1"
        max="50"
        value={gridSize}
        onChange={(e) => setGridSize(+e.target.value)}
      />
      <div
      id="tooltip"
      style={{
        position: 'absolute',
        display: 'none',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '4px',
        border: '1px solid #ccc',
      }}
    ></div>
    </div>
  );
};

export default InteractiveGrid;
