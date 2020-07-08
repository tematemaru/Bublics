import * as THREE from 'three';
import { TweenMax, TimelineMax, Power1, Power4 } from 'gsap';
import fragmentShader from './fragment.frag';
import vertexShader from './vertex.vert';

const particleImage = '/images/point-gradient.png';

export default class ParticleDonut {
  constructor(points) {
    this.points = points;
    this.time = 0;
    this.intersectOld = false;
    this.texture = new THREE.TextureLoader().load(particleImage);
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        uMouse: {
          type: 'vec3',
          value: new THREE.Vector3(0, 0, 0),
        },
        dot: {
          type: 't',
          value: new THREE.TextureLoader().load(particleImage),
        },
        uIntensive: {
          type: 'f',
          value: 0,
        },
        blend: { type: 'f', value: 0.0 },
        translation: { type: 'vec3', value: new THREE.Vector3() },
        size: { type: 'f', value: 25 },
        time: { type: 'f', value: this.time },
        resolution: {
          type: 'vec2',
          value: { x: window.innerWidth, y: window.innerHeight },
        },
      },
      alphaTest: 0.1,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: false,
      vertexShader,
      fragmentShader,
    });

    this.RingBufferGeometry = new THREE.RingGeometry(0, 1450, 32);
    this.RingBufferGeometry.computeFaceNormals(); // 'FACE NORMALS
    this.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.ringMesh = new THREE.Mesh(
      this.RingBufferGeometry,
      this.MeshBasicMaterial
    );

    this.geometry = new THREE.BufferGeometry();
    this.numVertices = this.points.length;

    this.positions = new Float32Array(this.numVertices * 3);
    this.geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.attributes.position.copyVector3sArray(this.points);

    this.randPoints = new Float32Array(this.numVertices * 3);

    const randPoints = [];
    for (let i = 0; i < this.numVertices; i += 1) {
      randPoints.push(
        new THREE.Vector3(
          Math.getRandomArbitrary(-1500, 1500),
          Math.getRandomArbitrary(-1500, 1500),
          Math.getRandomArbitrary(-1500, 1500)
        )
      );
    }
    this.geometry.addAttribute(
      'randPoints',
      new THREE.BufferAttribute(this.randPoints, 3)
    );
    this.geometry.attributes.randPoints.copyVector3sArray(randPoints);

    this.pointCloud = new THREE.Points(this.geometry, this.material);
  }

  setintersectionPos(point) {
    this.material.uniforms.uMouse.value.set(point.x, point.y, point.z);
  }

  startInitAnimation() {
    if (this.isBoombed) return;
    this.isBoombed = true;
    this.stopAnimation = true;
    this.material.uniforms.blend.value = 1;
    TweenMax.to(this.material.uniforms.blend, 10, {
      value: 0,
      ease: Power1.easeOut,
      onComplete: () => {
        this.stopAnimation = false;
        this.isBoombed = false;
      },
    });
  }

  setColor(color) {
    this.MeshBasicMaterial.color = color;
  }

  getPointCloud() {
    return this.pointCloud;
  }

  rotateAroundObjectAxis(axis, radians) {
    const rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    this.pointCloud.matrix.multiply(rotObjectMatrix);
    this.ringMesh.matrix.multiply(rotObjectMatrix);

    this.pointCloud.rotation.setFromRotationMatrix(this.pointCloud.matrix);
    this.ringMesh.rotation.setFromRotationMatrix(this.pointCloud.matrix);
    this.RingBufferGeometry.computeFaceNormals();
  }

  rotateX(rotation) {
    this.rotateAroundObjectAxis(new THREE.Vector3(1, 0, 0), rotation);
  }

  rotateY(rotation) {
    this.rotateAroundObjectAxis(new THREE.Vector3(0, 1, 0), rotation);
  }

  rotateZ(rotation) {
    this.rotateAroundObjectAxis(new THREE.Vector3(0, 0, 1), rotation);
  }

  setRotation(x = 0, y = 0, z = 0) {
    const rotObjectMatrixX = new THREE.Matrix4();
    rotObjectMatrixX.makeRotationAxis(
      new THREE.Vector3(1, 0, 0).normalize(),
      x
    );

    const rotObjectMatrixY = new THREE.Matrix4();

    rotObjectMatrixY.makeRotationAxis(
      new THREE.Vector3(0, 1, 0).normalize(),
      y
    );
    const rotObjectMatrixZ = new THREE.Matrix4();
    rotObjectMatrixZ.makeRotationAxis(
      new THREE.Vector3(0, 1, 0).normalize(),
      z
    );

    const resultRot = new THREE.Matrix4();
    resultRot
      .multiply(rotObjectMatrixX)
      .multiply(rotObjectMatrixY)
      .multiply(rotObjectMatrixZ);
    this.pointCloud.geometry.applyMatrix(resultRot);
    this.ringMesh.geometry.applyMatrix(resultRot);
    this.ringMesh.geometry.elementsNeedUpdate = true;
    this.RingBufferGeometry.normalsNeedUpdate = true;
    this.RingBufferGeometry.computeFaceNormals();
  }

  setTranslate(x, y, z) {
    this.material.uniforms.translation.value = new THREE.Vector3(
      x - window.innerWidth / 2,
      -(y - window.innerHeight / 2),
      z
    ).normalize();
    const translationMat = new THREE.Matrix4();
    translationMat.makeTranslation(x, y, z);
    this.pointCloud.geometry.applyMatrix(translationMat);
    this.ringMesh.geometry.applyMatrix(translationMat);
    this.ringMesh.geometry.elementsNeedUpdate = true;
    this.RingBufferGeometry.normalsNeedUpdate = true;
    this.RingBufferGeometry.computeFaceNormals();
  }

  boom(duration) {
    if (this.isBoombed) return;
    this.stopAnimation = true;
    this.isBoombed = true;
    this.material.uniforms.blend.value = 0;
    const tl = new TimelineMax();
    tl.to(this.material.uniforms.blend, duration, {
      value: 1,
      ease: Power4.easeOut,
    });
    tl.to(
      this.material.uniforms.blend,
      duration,
      {
        value: 0,
        ease: Power4.easeInOut,
        onComplete: () => {
          this.stopAnimation = false;
          this.isBoombed = false;
        },
      },
      '-=4'
    );

    tl.play();
  }

  animate() {
    if (!this.stopAnimation) {
      this.material.uniforms.time.value += 1;
    }
  }
}
