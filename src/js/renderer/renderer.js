import { Vector3 } from 'three';
import app from './app';

Math.getRandomArbitrary = (min, max, floor = false) => {
  let res;
  if (floor) {
    res = Math.floor(Math.random() * (max - min)) + min;
  } else {
    res = Math.random() * (max - min) + min;
  }

  return res;
};

export default () => {
  const length = 230;
  const ellipsesCount = 2 * Math.PI;
  let radius = 170;
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    radius = 200;
  }
  const circlePointsCoordinates = [];
  let gradient = -50;
  for (let i = 0; i < length; i += 1) {
    for (
      let j = 0;
      j < ellipsesCount;
      j += 0.01 + Math.abs(gradient) / length / 25
    ) {
      const x = radius * Math.sin(j + Math.random() / 10);
      const y = radius * Math.cos(j + Math.random() / 10);
      const distance = Math.floor(Math.sqrt(x * x + y * y));
      circlePointsCoordinates.push(
        new Vector3(
          x + Math.getRandomArbitrary(-80, 80),
          y + Math.getRandomArbitrary(-80, 80),
          (Math.getRandomArbitrary(-20, 20) * distance) / 360
        )
      );
    }
    gradient += 1;

    radius += 2.5;
  }
  app(circlePointsCoordinates);
};
