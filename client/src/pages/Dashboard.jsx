import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get("/metrics/overview");
        console.log("InfraSight metrics:", response.data);
        setMetrics(response.data);
      } catch (err) {
        console.error("Metrics API error:", err);
        setError("Unable to connect to the monitoring API.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Infrastructure Overview
      </h2>

      <p className="text-gray-500 mt-1 mb-8">
        Live infrastructure monitoring
      </p>

      {loading && <p>Loading infrastructure metrics...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {metrics && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-green-600 font-medium">
            API connection successful
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Live metrics received from InfraSight backend.
          </p>
          <pre className="mt-4 text-xs overflow-auto bg-gray-50 p-4 rounded-lg">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}