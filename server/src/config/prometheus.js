import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const prometheusClient = axios.create({
  baseURL: process.env.PROMETHEUS_URL,
  timeout: 5000,
});

export default prometheusClient;
