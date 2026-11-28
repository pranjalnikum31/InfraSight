import { useEffect, useState } from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  RefreshCw,
  Server,
} from "lucide-react";

import { getInfrastructureHealth, getMetricsOverview } from "../services/api";

import CpuHistoryChart from "../components/charts/CpuHistoryChart";
import MemoryHistoryChart from "../components/charts/MemoryHistoryChart";
import DiskHistoryChart from "../components/charts/DiskHistoryChart";
import NetworkHistoryChart from "../components/charts/NetworkHistoryChart";

function MetricCard({ title, value, unit, icon: Icon, description }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon size={21} className="text-blue-600" />
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      <p className="text-xs text-gray-500 mt-3">{description}</p>
    </div>
  );
}

function getMetricValue(metric) {
  if (metric?.status !== "success" || !metric.data?.length) {
    return null;
  }

  return metric.data[0].value;
}

function formatNetwork(value) {
  if (value === null || value === undefined) return "N/A";
  return (value / 1024).toFixed(2);
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);

  // Fetch live infrastructure metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getMetricsOverview();

        if (!response.success) {
          throw new Error("Unable to retrieve metrics");
        }

        setMetrics(response.data);

        setMetrics(response.data.data);
        setError("");
      } catch (err) {
        console.error("Metrics API error:", err);
        setError("Unable to connect to the monitoring API.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 15000);

    return () => clearInterval(interval);
  }, []);

  // Fetch infrastructure health
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getInfrastructureHealth();

        const isConnected = response.data?.some(
          (target) =>
            target.job === "windows-machine" &&
            Number(target.value) === 1
        );

        setHealth(Boolean(isConnected));
      } catch (err) {
        console.error("Infrastructure health error:", err);
        setHealth(false);
      }
    };

    fetchHealth();

    const interval = setInterval(fetchHealth, 15000);

    return () => clearInterval(interval);
  }, []);

  const cpu = getMetricValue(metrics?.cpu);
  const memory = getMetricValue(metrics?.memory);
  const disk = getMetricValue(metrics?.disk);
  const received = getMetricValue(metrics?.network?.received);
  const sent = getMetricValue(metrics?.network?.sent);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading infrastructure metrics...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Infrastructure Overview
          </h2>
          <p className="text-gray-500 mt-1">
            Live infrastructure monitoring
          </p>
        </div>

        <div
          className={`flex items-center gap-2 text-sm ${health === true
              ? "text-green-600"
              : health === false
                ? "text-red-600"
                : "text-gray-500"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${health === true
                ? "bg-green-500 animate-pulse"
                : health === false
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
          />
          {health === true
            ? "Live monitoring"
            : health === false
              ? "Monitoring disconnected"
              : "Checking connection..."}
          <RefreshCw size={15} />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="CPU Usage"
          value={cpu !== null ? cpu.toFixed(2) : "N/A"}
          unit="%"
          icon={Cpu}
          description="Current processor utilization"
        />

        <MetricCard
          title="Memory Usage"
          value={memory !== null ? memory.toFixed(2) : "N/A"}
          unit="%"
          icon={MemoryStick}
          description="Physical memory utilization"
        />

        <MetricCard
          title="Disk Usage"
          value={disk !== null ? disk.toFixed(2) : "N/A"}
          unit="%"
          icon={HardDrive}
          description="Disk utilization"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Network Traffic
            </p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Network size={21} className="text-blue-600" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Received</span>
              <span className="font-semibold text-gray-900">
                {formatNetwork(received)} KB/s
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Sent</span>
              <span className="font-semibold text-gray-900">
                {formatNetwork(sent)} KB/s
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Network throughput
          </p>
        </div>
      </div>

      {/* Monitored Infrastructure */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Server className="text-blue-600" size={22} />

          <div>
            <h3 className="font-semibold text-gray-900">
              Monitored Infrastructure
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Windows Machine · host.docker.internal:9182
            </p>
          </div>

          <span
            className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${health === true
              ? "text-green-600 bg-green-50"
              : health === false
                ? "text-red-600 bg-red-50"
                : "text-gray-600 bg-gray-100"
              }`}
          >
            {health === true
              ? "Connected"
              : health === false
                ? "Disconnected"
                : "Checking..."}
          </span>
        </div>
      </div>

      {/* Historical Charts */}
      <div className="mt-8">
        <CpuHistoryChart />
      </div>

      <div className="mt-6">
        <MemoryHistoryChart />
      </div>

      <div className="mt-6">
        <DiskHistoryChart />
      </div>

      <div className="mt-6">
        <NetworkHistoryChart />
      </div>
    </div>
  );
}
