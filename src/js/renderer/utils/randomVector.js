import * as THREE from 'three';

export default (min = -2500, max = 2500) => {
  return new THREE.Vector3(
    Math.getRandomArbitrary(min, max),
    Math.getRandomArbitrary(min, max),
    Math.getRandomArbitrary(min, max)
  );
};
