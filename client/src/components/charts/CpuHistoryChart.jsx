
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "../../services/api";

export default function CpuHistoryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const end = Math.floor(Date.now() / 1000);
        const start = end - 3600;

        const response = await api.get("/metrics/history/cpu", {
          params: {
            start,
            end,
            step: "15s",
          },
        });

        const cpuData = response.data.data?.[0]?.values || [];

        setData(
          cpuData.map((item) => ({
            timestamp: item.timestamp,
            time: new Date(item.timestamp * 1000).toLocaleTimeString(),
            usage: Number(item.value.toFixed(2)),
          }))
        );
      } catch (err) {
        console.error("CPU history error:", err);
        setError("Unable to load CPU history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p className="text-gray-500">Loading CPU history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          CPU Usage History
        </h3>
        <p className="text-sm text-gray-500">
          Processor utilization over the last hour
        </p>
      </div>

      <div className="h-72">
        {data.length === 0 ? (
          <p className="text-gray-500">No historical data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                minTickGap={30}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                unit="%"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "CPU Usage"]}
              />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
