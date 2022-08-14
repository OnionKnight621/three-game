import * as Three from "three";

import CharacterControllerInput from "./Controls/CharacterControllerInput";

export default class ThirdPersonScene extends Three.Scene {
  private readonly threejs = new Three.WebGLRenderer({
    antialias: true,
  });

  private readonly camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1.0,
    1000
  );
  private readonly dLight = new Three.DirectionalLight(0xffffff, 1.0);
  private readonly axesHelper = new Three.AxesHelper(100);
  private readonly gridHelper = new Three.GridHelper(
    100,
    100,
    "green",
    "green"
  );
  private readonly plane = new Three.Mesh(
    new Three.PlaneGeometry(100, 100, 10, 10),
    new Three.MeshBasicMaterial({
      color: 0xff715b,
      side: Three.DoubleSide,
    })
  );

  constructor() {
    super();

    this.setCanvas();

    this.camera.position.set(0, 25, 15);
    this.camera.lookAt(0, 0, 0);

    this.setDLight();
    this.setPlain();

    this.axesHelper.position.set(0, 0.01, 0);
    this.add(this.axesHelper);
    this.add(this.gridHelper);

    const geometry = new Three.BoxGeometry(2, 4, 2);
    const material = new Three.MeshBasicMaterial({ color: 0x1ea896 });
    const cube = new Three.Mesh(geometry, material);
    cube.position.set(0, 1, 0);
    this.add(cube);

    window.addEventListener("resize", () => {
      this.onResize();
    });

    new CharacterControllerInput();

    this.RAF();
  }

  setCanvas() {
    this.threejs.outputEncoding = Three.sRGBEncoding;
    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = Three.PCFSoftShadowMap;
    this.threejs.setPixelRatio(window.devicePixelRatio);
    this.threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.threejs.domElement);
  }

  setDLight() {
    this.dLight.position.set(-100, 100, 100);
    this.dLight.target.position.set(0, 0, 0);
    this.dLight.castShadow = true;
    this.dLight.shadow.bias = -0.001;
    this.dLight.shadow.mapSize.width = 4096;
    this.dLight.shadow.mapSize.height = 4096;
    this.dLight.shadow.camera.near = 0.1;
    this.dLight.shadow.camera.far = 500.0;
    this.dLight.shadow.camera.near = 0.5;
    this.dLight.shadow.camera.far = 500.0;
    this.dLight.shadow.camera.left = 50;
    this.dLight.shadow.camera.right = -50;
    this.dLight.shadow.camera.top = 50;
    this.dLight.shadow.camera.bottom = -50;

    this.add(this.dLight);
    this.add(new Three.DirectionalLightHelper(this.dLight, 1, "purple"));
  }

  setPlain() {
    this.plane.castShadow = false;
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -Math.PI / 2;

    this.add(this.plane);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.threejs.setSize(window.innerWidth, window.innerHeight);
  }

  RAF() {
    requestAnimationFrame(() => {
      this.threejs.render(this, this.camera);
      this.RAF();
    });
  }
}
