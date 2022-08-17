import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import CharacterController from "./Character/CharacterController";
import CharacterControllerInput from "./Character/Controls/CharacterControllerInput";

export default class ThirdPersonScene extends Three.Scene {
  private readonly renderer = new Three.WebGLRenderer({
    antialias: true,
  });

  private readonly camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1.0,
    1000
  );
  private readonly dLight = new Three.DirectionalLight(0xffffff, 1.0);

  private readonly plane = new Three.Mesh(
    new Three.PlaneGeometry(100, 100, 10, 10),
    new Three.MeshBasicMaterial({
      color: 0xff715b,
      side: Three.DoubleSide,
    })
  );

  // helpers
  private readonly axesHelper = new Three.AxesHelper(100);
  private readonly gridHelper = new Three.GridHelper(
    100,
    100,
    "green",
    "green"
  );
  private readonly dLightHelper = new Three.DirectionalLightHelper(
    this.dLight,
    1,
    "purple"
  );
  private readonly stats = Stats();
  private readonly orbControls = new OrbitControls(
    this.camera,
    this.renderer.domElement
  );

  private mixers: any = [];
  private previousRAF: number | null = null;
  private controls: CharacterController | null = null;

  constructor() {
    super();

    this.setCanvas();

    this.camera.position.set(0, 35, 20);
    this.camera.lookAt(0, 0, 0);

    this.setDLight();
    this.setPlain();

    this.axesHelper.position.set(0, 0.01, 0);
    this.add(this.axesHelper);
    this.add(this.gridHelper);

    const geometry = new Three.BoxGeometry(2, 4, 2);
    const material = new Three.MeshBasicMaterial({ color: 0x1ea896 });
    const cube = new Three.Mesh(geometry, material);
    cube.position.set(10, 2, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.add(cube);

    window.addEventListener("resize", () => {
      this.onResize();
    });

    document.body.appendChild(this.stats.dom);

    new CharacterControllerInput();

    this.loadCharacter();

    this.RAF();
  }

  private setCanvas(): void {
    this.renderer.outputEncoding = Three.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = Three.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  private setDLight(): void {
    this.dLight.position.set(10, 20, 15);
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
    this.add(this.dLightHelper);
  }

  private setPlain(): void {
    this.plane.castShadow = false;
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -Math.PI / 2;

    this.add(this.plane);
  }

  private loadCharacter() {
    this.controls = new CharacterController(this);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private RAF(): void {
    requestAnimationFrame((t) => {
      if (!this.previousRAF) {
        this.previousRAF = t;
      }

      this.RAF();

      this.renderer.render(this, this.camera);
      this.stats.update();
      this.orbControls.update();
      this.dLightHelper.update();
      this.step(t - this.previousRAF);

      this.previousRAF = t;
    });
  }

  private step(timeElapsed: number): void {
    const elapsed = timeElapsed * 0.001;

    this.mixers.map((m: any) => m.update(elapsed));

    if (this.controls) {
      this.controls.Update(elapsed);
    }
  }
}
