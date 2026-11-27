
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTimeRange = () => {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 3600;

  return { start, end, step: "15s" };
};

export const getCpuHistory = async () => {
  const response = await api.get("/metrics/history/cpu", {
    params: getTimeRange(),
  });

  return response.data;
};

export const getMemoryHistory = async () => {
  const response = await api.get("/metrics/history/memory", {
    params: getTimeRange(),
  });

  return response.data;
};

export const getDiskHistory = async () => {
  const response = await api.get("/metrics/history/disk", {
    params: getTimeRange(),
  });

  return response.data;
};
export const getNetworkHistory = async () => {
  const response = await api.get("/metrics/history/network", {
    params: getTimeRange(),
  });

  return response.data;
};
export default api;
