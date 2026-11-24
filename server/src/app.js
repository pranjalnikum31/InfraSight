import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/metrics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/metrics", metricsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InfraSight API is running",
  });
});

export default app;
