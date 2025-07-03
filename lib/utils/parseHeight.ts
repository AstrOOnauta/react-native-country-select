const parseHeight = (
  value: number | string | undefined,
  windowHeight: number,
): number => {
  if (value === undefined) {
    return 0;
  }

  const MIN_ALLOWED_PERCENTAGE = 0.1; // 10%
  const MAX_ALLOWED_PERCENTAGE = windowHeight; // 100%

  if (typeof value === 'number') {
    return Math.min(
      Math.max(value, MIN_ALLOWED_PERCENTAGE * MAX_ALLOWED_PERCENTAGE),
      MAX_ALLOWED_PERCENTAGE,
    );
  }

  if (typeof value === 'string') {
    const percentageMatch = value.match(/^(\d+(?:\.\d+)?)%$/);

    if (percentageMatch) {
      const percentage = parseFloat(percentageMatch[1]) / 100;
      const height = percentage * MAX_ALLOWED_PERCENTAGE;
      return Math.min(
        Math.max(height, MIN_ALLOWED_PERCENTAGE * MAX_ALLOWED_PERCENTAGE),
        MAX_ALLOWED_PERCENTAGE,
      );
    }
  }

  return 0;
};

export default parseHeight;
