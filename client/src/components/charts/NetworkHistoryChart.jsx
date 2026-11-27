
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getNetworkHistory } from "../../services/api";

export default function NetworkHistoryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getNetworkHistory();

        const receivedData =
          response.data?.received?.data?.[0]?.values || [];

        const sentData =
          response.data?.sent?.data?.[0]?.values || [];

        const formattedData = receivedData.map((item, index) => ({
          timestamp: item.timestamp,
          time: new Date(item.timestamp * 1000).toLocaleTimeString(),
          received: Number((item.value / 1024).toFixed(2)),
          sent: Number(
            ((sentData[index]?.value || 0) / 1024).toFixed(2)
          ),
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Network history error:", err);
        setError("Unable to load network history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading network history...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Network Traffic History
        </h3>
        <p className="text-sm text-gray-500">
          Incoming and outgoing traffic over the last hour
        </p>
      </div>

      <div className="h-72">
        {data.length === 0 ? (
          <p className="text-gray-500">No historical data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={30} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "KB/s",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => [`${value} KB/s`]} />
              <Legend />

              <Line
                type="monotone"
                dataKey="received"
                name="Received"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="sent"
                name="Sent"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
