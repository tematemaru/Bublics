import Renderer3D from './Renderer3D';

export default (points, colors) => {
  const renderer3D = new Renderer3D(points, colors);
  renderer3D.animate();
  renderer3D.init();
};
