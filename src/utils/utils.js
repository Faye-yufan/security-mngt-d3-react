import axios from "axios";

export const sendDataToDjango = async (localtime, dataPoints, staffInfo) => {
  const url = "http://localhost:8000/api/receive_data/";

  const data = {
    localtime: localtime,
    data_points: dataPoints,
    staff_info: staffInfo,
  };

  try {
    const response = await axios.post(url, data);
    console.log(response.data);
  } catch (error) {
    console.error("Error sending data to Django:", error);
  }
};

export const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
