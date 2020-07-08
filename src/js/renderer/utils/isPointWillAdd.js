export default (x, y, curRad, radius) => {
  const valueProb = curRad / radius;
  const distanceProbX = Math.abs(x / curRad / 2);
  const distanceProbY = Math.abs(y / curRad / 2);

  if (
    Math.random() < valueProb &&
    Math.random() > distanceProbX &&
    Math.random() > distanceProbY
  ) {
    return true;
  }
  return false;
};
