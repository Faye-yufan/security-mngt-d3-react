import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import backgroundImageUrl from '../asset/first-floor.png';

const InteractiveGrid = () => {
  const [gridSize, setGridSize] = useState(10);
  const [selectedCells, setSelectedCells] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 800;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear().domain([0, gridSize]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, gridSize]).range([0, height]);

    // Create a group for the image
    const imageGroup = svg.append('g');
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
        .attr('stroke-width', 1);
    };

    drawGrid();

    svg.on('click', (event) => {
      const coords = d3.pointer(event);
      console.log(coords)

      const x = Math.floor(xScale.invert(coords[0]));
      const y = Math.floor(yScale.invert(coords[1]));

      const cellId = `cell-${x}-${y}`;

      const existingCell = rectGroup.select(`#${cellId}`);

      if (!existingCell.empty()) {
        // If the cell is already highlighted, remove the highlight
        existingCell.remove();
      } else {
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
      // Move the image and grid lines below the rectangles
    // gridGroup.lower();
    // imageGroup.lower();
    // rectGroup.upper();
    });
  }, [gridSize, selectedCells]);

  return (
    <div className="interactive-grid">
      <input
        type="range"
        min="1"
        max="50"
        value={gridSize}
        onChange={(e) => setGridSize(+e.target.value)}
      />
      <br />
      <svg ref={svgRef} />
    </div>
  );
};

export default InteractiveGrid;
