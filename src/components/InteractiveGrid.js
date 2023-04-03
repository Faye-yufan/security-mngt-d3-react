import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import firstFloorImageUrl from '../asset/floor-1-ground.png';
import secondFloorImageUrl from '../asset/floor-2-first.png';
import thirdFloorImageUrl from '../asset/floor-3-second.png';
import fourthFloorImageUrl from '../asset/floor-4-third.png';


const InteractiveGrid = ({ selectedCells, setSelectedCells, selectedOption }) => {
  const [gridSize, setGridSize] = useState(10);
  const svgRef = useRef();
  let updatedSelectedCells = selectedCells;

  useEffect(() => {
    const width = 700;
    const height = 700;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear().domain([0, gridSize]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, gridSize]).range([0, height]);

    // Create a group for the image
    const imageGroup = svg.append('g');

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

    svg.on('click', (event) => {
      const coords = d3.pointer(event);

      const x = Math.floor(xScale.invert(coords[0]));
      const y = Math.floor(yScale.invert(coords[1]));

      const cellId = `cell-${x}-${y}`;

      const existingCell = rectGroup.select(`#${cellId}`);

      if (!existingCell.empty()) {
        // If the cell is already highlighted, remove the highlight
        existingCell.remove();
        updatedSelectedCells = updatedSelectedCells.filter(cell => cell.x !== x || cell.y !== y);
      } else {
        updatedSelectedCells = [...updatedSelectedCells, { x, y }];
        rectGroup
          .append('rect')
          .attr('id', cellId)
          .attr('x', xScale(x))
          .attr('y', yScale(y))
          .attr('width', xScale(1) - xScale(0))
          .attr('height', yScale(1) - yScale(0))
          .attr('fill', 'yellow')
          .attr('opacity', 0.5);
      }
      setSelectedCells(prevSelectedCells => updatedSelectedCells);
    });
    
  }, [gridSize, selectedOption]);

  return (
    <div className="interactive-grid">
      <svg ref={svgRef} />
      <br />
      <p>Adjust Selection Size</p>
      <input
        className="interactive-grid--toggle"
        type="range"
        min="1"
        max="50"
        value={gridSize}
        onChange={(e) => setGridSize(+e.target.value)}
      />
      
    </div>
  );
};

export default InteractiveGrid;
