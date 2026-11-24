
import prometheusClient from "../config/prometheus.js";
import { normalizeMetric } from "../utils/metrics.utils.js";

export const queryPrometheus = async (query) => {
  try {
    const response = await prometheusClient.get("/api/v1/query", {
      params: { query },
    });

    return response.data.data.result;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch Prometheus metrics"
    );
  }
};

export const getCpuUsageService = async () => {
  const query = `
    100 * (1 - avg(rate(windows_cpu_time_total{mode="idle"}[5m])))
  `;

  return await queryPrometheus(query);
};


export const getMemoryUsageService = async () => {
  const query = `
    100 * (
      1 -
      windows_memory_available_bytes
      /
      windows_memory_physical_total_bytes
    )
  `;

  return await queryPrometheus(query);
};


export const getDiskUsageService = async () => {
  const query = `
    100 * (
      1 -
      windows_logical_disk_free_bytes{volume!~"HarddiskVolume.*"}
      /
      windows_logical_disk_size_bytes{volume!~"HarddiskVolume.*"}
    )
  `;

  return await queryPrometheus(query);
};


export const getNetworkUsageService = async () => {
  const [received, sent] = await Promise.all([
    queryPrometheus(
      "rate(windows_net_bytes_received_total[1m])"
    ),
    queryPrometheus(
      "rate(windows_net_bytes_sent_total[1m])"
    ),
  ]);

  return {
    received,
    sent,
  };
};



export const getSystemOverviewService = async () => {
  const results = await Promise.allSettled([
    getCpuUsageService(),
    getMemoryUsageService(),
    getDiskUsageService(),
    getNetworkUsageService(),
  ]);

  const [cpu, memory, disk, network] = results;

  return {
    cpu: resolveMetric(cpu),
    memory: resolveMetric(memory),
    disk: resolveMetric(disk),
    network: {
      received: network.status === "fulfilled"
        ? resolveMetric({
          status: "fulfilled",
          value: network.value.received,
        })
        : resolveMetric(network),

      sent: network.status === "fulfilled"
        ? resolveMetric({
          status: "fulfilled",
          value: network.value.sent,
        })
        : resolveMetric(network),
    },
  };
};


const resolveMetric = (result, transform = normalizeMetric) => {
  if (result.status === "fulfilled") {
    return {
      status: "success",
      data: transform(result.value),
    };
  }

  return {
    status: "error",
    data: [],
    error: result.reason.message,
  };
};


export const queryPrometheusRange = async (
  query,
  start,
  end,
  step = "15s"
) => {
  try {
    const response = await prometheusClient.get(
      "/api/v1/query_range",
      {
        params: {
          query,
          start,
          end,
          step,
        },
      }
    );

    return response.data.data.result;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      "Failed to fetch historical metrics"
    );
  }
};

export const getCpuHistoryService = async (start, end, step = "15s") => {
  const query = `
    100 * (1 - avg(rate(windows_cpu_time_total{mode="idle"}[5m])))
  `;

  const result = await queryPrometheusRange(query, start, end, step);

  return normalizeHistoryMetric(result);
};


export const getMemoryHistoryService = async (start, end, step = "15s") => {
  const query = `
    100 * (
      1 -
      windows_memory_available_bytes
      /
      windows_memory_physical_total_bytes
    )
  `;

  const result = await queryPrometheusRange(query, start, end, step);

  return normalizeHistoryMetric(result);
};

export const getDiskHistoryService = async (start, end, step = "15s") => {
  const query = `
    100 * (
      1 -
      windows_logical_disk_free_bytes{volume!~"HarddiskVolume.*"}
      /
      windows_logical_disk_size_bytes{volume!~"HarddiskVolume.*"}
    )
  `;

  const result = await queryPrometheusRange(query, start, end, step);

  return normalizeHistoryMetric(result);
};


export const getNetworkHistoryService = async (
  start,
  end,
  step = "15s"
) => {
  const [received, sent] = await Promise.allSettled([
    queryPrometheusRange(
      "rate(windows_net_bytes_received_total[1m])",
      start,
      end,
      step
    ),
    queryPrometheusRange(
      "rate(windows_net_bytes_sent_total[1m])",
      start,
      end,
      step
    ),
  ]);

  return {
    received: resolveMetric(received, normalizeHistoryMetric),
    sent: resolveMetric(sent, normalizeHistoryMetric),
  };
};



export const getHistoricalOverviewService = async (
  start,
  end,
  step = "15s"
) => {
  const results = await Promise.allSettled([
    getCpuHistoryService(start, end, step),
    getMemoryHistoryService(start, end, step),
    getDiskHistoryService(start, end, step),
    getNetworkHistoryService(start, end, step),
  ]);

  const [cpu, memory, disk, network] = results;

  return {
    cpu: resolveMetric(cpu, (data) => data),
    memory: resolveMetric(memory, (data) => data),
    disk: resolveMetric(disk, (data) => data),
    network: network.status === "fulfilled"
      ? network.value
      : {
        received: resolveMetric(network, normalizeHistoryMetric),
        sent: resolveMetric(network, normalizeHistoryMetric),
      },
  };
};

const normalizeHistoryMetric = (result) => {
  return result.map((item) => ({
    ...item.metric,
    values: item.values.map(([timestamp, value]) => ({
      timestamp: Number(timestamp),
      value: Number(value),
    })),
  }));
};

