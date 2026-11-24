
import express from "express";

import {
  getCpuUsage,
  getMemoryUsage,
  getDiskUsage,
  getNetworkUsage,
  getSystemOverview,
  getCpuHistory,
  getMemoryHistory,
  getDiskHistory,
  getNetworkHistory,
  getHistoricalOverview,
} from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/cpu", getCpuUsage);
router.get("/memory", getMemoryUsage);
router.get("/disk", getDiskUsage);
router.get("/network", getNetworkUsage);
router.get("/overview", getSystemOverview);

router.get("/history", getHistoricalOverview);
router.get("/history/cpu", getCpuHistory);
router.get("/history/memory", getMemoryHistory);
router.get("/history/disk", getDiskHistory);
router.get("/history/network", getNetworkHistory);

export default router;
