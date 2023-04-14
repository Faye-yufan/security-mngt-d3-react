import { Col, InputNumber, Row, Slider, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from 'dayjs-plugin-utc';
dayjs.extend(utc);

export default function ToggleBar({ dataPoints, onData }) {
  console.log("ToggleBar input dataPoints: ", dataPoints)
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
    dayjs(dataPoints[value]?.localtime).utc().format("YYYY-MM-DD HH:mm:ss");
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={dataPoints.length}
          tooltip={{ formatter }}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </Col>
      <div style={{ width: "100px" }}>
        <InputNumber
          min={0}
          max={dataPoints.length}
          style={{ marginLeft: "16px", width: "200px" }}
          value={formatter(inputValue)}
          onChange={onChange}
        />
      </div>
    </Row>
  );
}
