import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { debounce } from "lodash";
import {
  createImageGroup,
  createOverlayGroup,
  createGripGroup,
  createAssignedCells,
  plotDataPoint,
  handleAreaSelect,
  drawCurData,
  backgroundImage,
  TIME_GAP,
} from "./interactiveGridMethods";

const InteractiveGrid = ({
  dataPoints,
  selectedCells,
  setSelectedCells,
  selectedOption,
  assignments,
  deviceColors,
  onDataPointsForTime,
  manualCurrentIdx,
}) => {
  const [gridSize, setGridSize] = useState(14);
  const [startPlotting, setStartPlotting] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [currentDataPoints, setCurrentDataPoints] = useState([]);
  const startPlottingRef = useRef(startPlotting);
  const svgRef = useRef();
  const [updatedSelectedCells, setUpdatedSelectedCells] = useState([
    ...selectedCells,
  ]);

  const backgroundImageUrl = backgroundImage(selectedOption);

  const width = 600;
  const height = 600;
  let svg = null;
  useEffect(() => {
    svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    startPlottingRef.current = startPlotting;
    const xScale = d3.scaleLinear().domain([0, gridSize]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, gridSize]).range([0, height]);
    // setRectGroup(svg.append("g"));
    // Create a group for the image
    createImageGroup(svg, width, height, backgroundImageUrl);

    // Create a group for the overlay layer
    createOverlayGroup(svg, width, height);

    // Create a group for the grid lines
    createGripGroup({ svg, width, height, xScale, yScale, gridSize });

    // Create a group for the rectangles
    const rectGroup = svg.append("g");
    createAssignedCells({ rectGroup, svg, assignments, xScale, yScale });

    const startPlottingDataPoints = (currentDataIndex) => {
      let currentIndex = currentDataIndex;
      const plotDataPoints = () => {
        if (!startPlottingRef.current) {
          return; // If the "Stop" button is clicked, stop the function execution
        }
        // draw function
        drawCurData({
          currentIndex,
          rectGroup,
          dataPoints,
          setCurrentDataPoints,
          onDataPointsForTime,
          assignments,
          deviceColors,
          height,
        });

        currentIndex++;
        setCurrentDataIndex((prevDataIndex) => currentIndex);

        // set timeout to plot the next data points
        if (currentIndex < dataPoints.length) {
          setTimeout(plotDataPoints, TIME_GAP);
        }
      };

      plotDataPoints();
    };

    if (startPlotting) {
      startPlottingDataPoints(currentDataIndex);
    } else {
      currentDataPoints.forEach((dataPoint) => {
        plotDataPoint(rectGroup, dataPoint, deviceColors);
      });
    }

    svg.on("click", (event) => {
      handleAreaSelect({
        event,
        xScale,
        yScale,
        assignments,
        rectGroup,
        updatedSelectedCells,
        setUpdatedSelectedCells,
      });
    });
  }, [gridSize, selectedOption, assignments, startPlotting]);

  // update local selected cells
  useEffect(() => {
    setSelectedCells(updatedSelectedCells);
  }, [updatedSelectedCells]);
  const debounceCall = debounce(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const rectGroup = svg?.append("g");

    console.log(manualCurrentIdx, rectGroup, "chart");
    drawCurData({
      currentIndex: manualCurrentIdx,
      rectGroup,
      dataPoints,
      setCurrentDataPoints,
      onDataPointsForTime,
      assignments,
      deviceColors,
      height,
    });
    // rectGroup.selectAll("circle").remove();
  }, 500);
  useEffect(() => {
    debounceCall();
  }, [manualCurrentIdx]);

  // size toggle bar handler
  const handelSizeChange = (e) => setGridSize(+e.target.value);

  return (
    <div className="interactive-grid">
      <button onClick={() => setStartPlotting(!startPlotting)}>
        {startPlotting ? "Stop" : "Start"}
      </button>
      <div id="timer" style={{ fontSize: "20px", fontWeight: "bold" }}></div>
      <br />
      <svg ref={svgRef} />
      <p>Adjust Selection Size</p>
      <input
        className="interactive-grid--toggle"
        type="range"
        min="1"
        max="50"
        value={gridSize}
        onChange={handelSizeChange}
      />
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: "none",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "4px",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
};

export default InteractiveGrid;
