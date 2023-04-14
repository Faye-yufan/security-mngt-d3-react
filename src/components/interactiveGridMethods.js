import * as d3 from "d3";
import firstFloorImageUrl from "../asset/floor-1-ground.png";
import secondFloorImageUrl from "../asset/floor-2-first.png";
import thirdFloorImageUrl from "../asset/floor-3-second.png";
import fourthFloorImageUrl from "../asset/floor-4-third.png";
// background
export const createImageGroup = (svg, width, height, backgroundImageUrl) => {
  const imageGroup = svg.append("g");
  imageGroup
    .append("image")
    .attr("xlink:href", backgroundImageUrl)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "none");
  imageGroup.raise();
};
// Overlay
export const createOverlayGroup = (svg, width, height) => {
  const overlayGroup = svg.append("g");
  overlayGroup
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("opacity", 0.5);
  overlayGroup.raise();
};
// Grid
export const createGripGroup = ({
  svg,
  width,
  height,
  xScale,
  yScale,
  gridSize,
}) => {
  const gridGroup = svg.append("g");
  gridGroup.selectAll(".grid-line").remove();
  const gridLines = d3.range(0, gridSize + 1);
  // Vertical lines
  gridGroup
    .selectAll(".grid-line-vertical")
    .data(gridLines)
    .enter()
    .append("line")
    .attr("class", "grid-line grid-line-vertical")
    .attr("x1", (d) => xScale(d))
    .attr("x2", (d) => xScale(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "grey")
    .attr("opacity", 0.6)
    .attr("stroke-width", 1);

  // Horizontal lines
  gridGroup
    .selectAll(".grid-line-horizontal")
    .data(gridLines)
    .enter()
    .append("line")
    .attr("class", "grid-line grid-line-horizontal")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d))
    .attr("stroke", "grey")
    .attr("opacity", 0.6)
    .attr("stroke-width", 1);
};
// AssignedCells
export const createAssignedCells = ({
  rectGroup,
  assignments,
  xScale,
  yScale,
}) => {
  assignments.forEach((assignment) => {
    const zoneName = assignment.zoneName;

    let firstCellInAssignment;
    assignment.selectedCells.forEach((cell, index) => {
      const cellId = `cell-${cell.x}-${cell.y}`;
      const existingCell = rectGroup.select(`#${cellId}`);

      if (existingCell.empty()) {
        rectGroup
          .append("rect")
          .attr("id", cellId)
          .attr("x", xScale(cell.x))
          .attr("y", yScale(cell.y))
          .attr("width", xScale(1) - xScale(0))
          .attr("height", yScale(1) - yScale(0))
          .attr("fill", "#CBC568")
          .attr("opacity", 0.5);
      }

      if (index === 0) {
        firstCellInAssignment = cell;
      }
    });

    // Add the surrounding square
    rectGroup
      .append("rect")
      .attr("class", "zone-name-tag-bg")
      .attr("x", xScale(firstCellInAssignment.x) + xScale(1) + 2 - 2) // Adjust the position as needed
      .attr("y", yScale(firstCellInAssignment.y) - 20) // Adjust the position as needed
      .attr("width", zoneName.length * 6 * 2) // Adjust the width based on the length of the zone name
      .attr("height", 25) // Adjust the height as needed
      .attr("fill", "#DCDCDC")
      .attr("opacity", 0.8);

    // Add the zone name tag
    rectGroup
      .append("text")
      .attr("class", "zone-name-tag")
      .attr("x", xScale(firstCellInAssignment.x) + xScale(1) + 2) // Adjust the position as needed
      .attr("y", yScale(firstCellInAssignment.y) - 2) // Adjust the position as needed
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .attr("opacity", 0.8)
      .text(zoneName);
  });
};
// current data points
export const plotDataPoint = ({
  rectGroup,
  dataPoint,
  deviceColors,
  height,
}) => {
  if (!dataPoint) return;
  const x = dataPoint?.projected_norm_x;
  const y = dataPoint?.projected_norm_y;
  const isInDeviceColors = deviceColors[dataPoint.ClientMacAddr];
  const staffOrDevice = dataPoint["Staff/Device"];

  // Selected fixed device but the state has not occurred yet
  const isFixedNormal = isInDeviceColors && dataPoint.localtime < 1568121986000;
  // Selected fixed device and the state has occurred
  const isFixedWithState =
    isInDeviceColors && dataPoint.localtime >= 1568121986000;
  // is staff but not specifically for this device
  const isStaff = dataPoint["Staff ID"] !== "nan";

  let color, size, alpha, strokeWidth, stroke;

  if (isFixedNormal) {
    color = "#0096FF";
    size = 8;
    alpha = 1;
    strokeWidth = 3;
    stroke = "black";
  } else if (isFixedWithState) {
    color = "red";
    size = 10;
    alpha = 1;
    strokeWidth = 2;
    stroke = "black";
  } else if (isStaff) {
    color = "orange";
    size = 7;
    alpha = 1;
    strokeWidth = 0;
    stroke = "transparent";
  } else {
    // Default case
    color = "black";
    size = 5;
    alpha = 0.5;
    strokeWidth = 0;
    stroke = "transparent";
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
    .append("circle")
    .attr("cx", x)
    .attr("cy", height - y)
    .attr("r", size)
    .attr("fill", color)
    .attr("opacity", alpha)
    .attr("pointer-events", "all")
    .style("stroke", stroke)
    .style("stroke-width", strokeWidth)
    .on("mouseover", showTooltip)
    .on("mousemove", showTooltip)
    .on("mouseout", hideTooltip);
};

// handle area select
export const handleAreaSelect = ({
  event,
  xScale,
  yScale,
  assignments,
  rectGroup,
  updatedSelectedCells,
  setUpdatedSelectedCells,
}) => {
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
      setUpdatedSelectedCells(
        updatedSelectedCells.filter((cell) => cell.x !== x || cell.y !== y)
      );
    }
  } else {
    setUpdatedSelectedCells((prevUpdatedSelectedCells) => [
      ...prevUpdatedSelectedCells,
      { x, y },
    ]);

    rectGroup
      .append("rect")
      .attr("id", cellId)
      .attr("x", xScale(x))
      .attr("y", yScale(y))
      .attr("width", xScale(1) - xScale(0))
      .attr("height", yScale(1) - yScale(0))
      .attr("fill", "#CBC568")
      .attr("opacity", 0.5);
  }
};

// auto play time gap
export const TIME_GAP = 500;

// draw current data list
export const drawCurData = ({
  currentIndex,
  rectGroup,
  dataPoints,
  setCurrentDataPoints,
  onDataPointsForTime,
  assignments,
  deviceColors,
  height,
}) => {
  if (!rectGroup || !dataPoints.length) return;
  const startTime = dataPoints[0].localtime;
  // clear previous data points
  rectGroup.selectAll("circle").remove();
  // get the current time window
  const currentTime = startTime + currentIndex * TIME_GAP;
  const currentData = dataPoints.filter(
    (d) => d.localtime >= currentTime && d.localtime < currentTime + TIME_GAP
  );
  setCurrentDataPoints((prevCurrentDataPoints) => currentData);
  // Check if the current time is 13:26:26
  if (currentData.length !== 0 && currentData[0].localtime === 1568121986000) {
    onDataPointsForTime(currentData, assignments);
  }
  currentData.forEach((dataPoint) => {
    plotDataPoint({ rectGroup, dataPoint, deviceColors, height });
    // Update the timer display
    const timerDisplay = document.getElementById("timer");
    const date = new Date(dataPoint.localtime);
    const londonTimeOptions = {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const londonTime = date.toLocaleString("en-GB", londonTimeOptions);
    const fractionalSeconds = date.getMilliseconds();

    timerDisplay.textContent = `${londonTime}.${fractionalSeconds ? "5" : "0"}`;
  });
};

export const backgroundImage = (selectedOption) => {
  switch (selectedOption) {
    case "Ground Floor":
      return firstFloorImageUrl;
    case "1st Floor":
      return secondFloorImageUrl;
    case "2nd Floor":
      return thirdFloorImageUrl;
    case "3rd Floor":
      return fourthFloorImageUrl;
    default:
      return firstFloorImageUrl;
  }
};
