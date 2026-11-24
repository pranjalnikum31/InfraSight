
export const normalizeMetric = (result) => {
  return result.map((item) => ({
    ...item.metric,
    value: Number(item.value[1]),
    timestamp: Number(item.value[0]),
  }));
};
