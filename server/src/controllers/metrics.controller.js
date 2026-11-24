
import {
  getCpuUsageService,
  getMemoryUsageService,
  getDiskUsageService,
  getNetworkUsageService,
  getSystemOverviewService,
  getCpuHistoryService,
  getMemoryHistoryService,
  getDiskHistoryService,
  getNetworkHistoryService,
  getHistoricalOverviewService,
} from "../services/metrics.service.js";

const validateHistoryQuery = (req, res) => {
  const { start, end, step = "15s" } = req.query;

  if (!start || !end) {
    res.status(400).json({
      success: false,
      message: "Start and end timestamps are required",
    });

    return null;
  }

  const startTime = Number(start);
  const endTime = Number(end);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    res.status(400).json({
      success: false,
      message: "Start and end must be valid timestamps",
    });

    return null;
  }

  if (startTime >= endTime) {
    res.status(400).json({
      success: false,
      message: "Start must be earlier than end",
    });

    return null;
  }

  if (!/^[1-9]\d*(ms|s|m|h)$/.test(step)) {
    res.status(400).json({
      success: false,
      message: "Invalid step duration",
    });

    return null;
  }

  const maxRange = 7 * 24 * 60 * 60;

  if (endTime - startTime > maxRange) {
    res.status(400).json({
      success: false,
      message: "Maximum historical query range is 7 days",
    });

    return null;
  }

  return { startTime, endTime, step };
};

export const getCpuUsage = async (req, res) => {
  try {
    const result = await getCpuUsageService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMemoryUsage = async (req, res) => {
  try {
    const result = await getMemoryUsageService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDiskUsage = async (req, res) => {
  try {
    const result = await getDiskUsageService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNetworkUsage = async (req, res) => {
  try {
    const result = await getNetworkUsageService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSystemOverview = async (req, res) => {
  try {
    const result = await getSystemOverviewService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCpuHistory = async (req, res) => {
  try {
    const params = validateHistoryQuery(req, res);
    if (!params) return;

    const result = await getCpuHistoryService(
      params.startTime,
      params.endTime,
      params.step
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMemoryHistory = async (req, res) => {
  try {
    const params = validateHistoryQuery(req, res);
    if (!params) return;

    const result = await getMemoryHistoryService(
      params.startTime,
      params.endTime,
      params.step
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDiskHistory = async (req, res) => {
  try {
    const params = validateHistoryQuery(req, res);
    if (!params) return;

    const result = await getDiskHistoryService(
      params.startTime,
      params.endTime,
      params.step
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNetworkHistory = async (req, res) => {
  try {
    const params = validateHistoryQuery(req, res);
    if (!params) return;

    const result = await getNetworkHistoryService(
      params.startTime,
      params.endTime,
      params.step
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistoricalOverview = async (req, res) => {
  try {
    const params = validateHistoryQuery(req, res);
    if (!params) return;

    const result = await getHistoricalOverviewService(
      params.startTime,
      params.endTime,
      params.step
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
