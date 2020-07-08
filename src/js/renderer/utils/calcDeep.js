export default (x, y, deep) => {
  const dist = Math.sqrt(x * x + y * y);
  const realDeep = 1 - (300 - Math.round(284 - dist)) / 300;
  return Math.random() > 0.5 ? realDeep * deep : -realDeep * deep;
};
