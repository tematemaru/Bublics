import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import ParticleDonut from './ParticleDonut';

export default class Renderer3D {
  constructor(points) {
    this.raycaster1 = new THREE.Raycaster();
    this.raycaster1.params.Points.threshold = 1;
    this.raycaster2 = new THREE.Raycaster();
    this.raycaster2.params.Points.threshold = 1;
    this.points = points;
    this.mouseCoor = { x: 0, y: 0 };
    this.isCameraRotating = true;
    this.cameraTime = 0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.camera2 = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('renderer').appendChild(this.renderer.domElement);

    this.particleDonut1 = new ParticleDonut(this.points, {
      size: 20,
      deep: 50,
    });

    this.particleDonut2 = new ParticleDonut(this.points, {
      size: 20,
      deep: 50,
    });

    this.d1 = new THREE.Object3D();
    this.d2 = new THREE.Object3D();
    this.d1.add(this.particleDonut1.getPointCloud());
    this.d1.add(this.particleDonut1.ringMesh);

    this.d2.add(this.particleDonut2.getPointCloud());
    this.d2.add(this.particleDonut2.ringMesh);
    this.scene.add(this.d1);
    this.scene.add(this.d2);

    this.renderer.render(this.scene, this.camera);

    this.addHelpers();

    this.params = {
      translateX1: 0,
      translateY1: 0,
      translateZ1: 50,

      translateX2: 0,
      translateY2: 0,
      translateZ2: -150,

      rotateX1: 1.9,
      rotateY1: 2.5,
      rotateZ1: 0.0,

      rotateX2: 1.7,
      rotateY2: 0.5,
      rotateZ2: -1.0,
    };

    this.setInitPositions();
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('click', this.boom.bind(this));
    window.addEventListener('touchend', this.boom.bind(this));
    this.camera.position.setZ(500);

    this.ConeBufferGeometry = new THREE.ConeBufferGeometry(20, 100, 3);
    this.ConeBufferGeometry.translate(0, 50, 0);
    this.ConeBufferGeometry.rotateX(Math.PI / 2);
    this.helper = null;
  }

  handleRay(mouse, raycaster, target) {
    if (target.isBoombed) return;
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects([target.ringMesh]);
    if (intersects.length) {
      for (let i = 0; i < intersects.length; i += 1) {
        if (this.d1.children[1].uuid === intersects[i].object.uuid) {
          target.setintersectionPos(this.d1.worldToLocal(intersects[i].point));
        }
        if (this.d2.children[1].uuid === intersects[i].object.uuid) {
          target.setintersectionPos(this.d2.worldToLocal(intersects[i].point));
        }
      }
    } else {
      target.setintersectionPos(new THREE.Vector3(0, 0, 0));
    }
  }

  handleMouseMove({ clientX, clientY }) {
    this.mouseCoor.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouseCoor.y = -(clientY / window.innerHeight) * 2 + 1;
  }

  handleResize() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setInitPositions() {
    this.d1.translateX(this.params.translateX1);
    this.d1.translateY(this.params.translateY1);
    this.d1.translateZ(this.params.translateZ1);
    this.d1.rotateX(this.params.rotateX1);
    this.d1.rotateY(this.params.rotateY1);
    this.d1.rotateZ(this.params.rotateZ1);
    this.d2.translateX(this.params.translateX2);
    this.d2.translateY(this.params.translateY2);
    this.d2.translateZ(this.params.translateZ2);
    this.d2.rotateX(this.params.rotateX2);
    this.d2.rotateY(this.params.rotateY2);
    this.d2.rotateZ(this.params.rotateZ2);
  }

  addHelpers() {
    if (process.env.APP_ENV === 'development') {
      this.helper = new THREE.Mesh(
        this.ConeBufferGeometry,
        new THREE.MeshNormalMaterial()
      );
      this.scene.add(this.helper);
      this.axesHelper = new THREE.AxesHelper(5);
      this.scene.add(this.axesHelper);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.enableZoom = true;
    }
  }

  rotateCameraWithAnimation() {
    if (this.isCameraRotating) {
      const nextXPos = -Math.cos(this.cameraTime / 400) * 500;
      const nextYPos = -Math.sin(this.cameraTime / 400) * 500;
      const nextZPos = nextYPos;
      this.camera.position.x = nextXPos;
      this.camera.position.y = nextYPos;
      this.camera.position.z = nextZPos;
      this.camera.lookAt(0, 0, 0);
      this.cameraTime += 1;
    }
  }

  init() {
    this.particleDonut1.startInitAnimation();
    this.particleDonut2.startInitAnimation();
  }

  boom() {
    this.particleDonut1.boom(10);
    this.particleDonut2.boom(10);
  }

  animate() {
    this.handleRay(this.mouseCoor, this.raycaster1, this.particleDonut1);
    this.handleRay(this.mouseCoor, this.raycaster2, this.particleDonut2);
    this.particleDonut1.animate();
    this.d1.rotateZ(0.0025);
    this.d2.rotateZ(-0.0025);
    this.particleDonut2.animate();
    this.rotateCameraWithAnimation();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}
