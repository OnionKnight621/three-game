import * as Three from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { states } from "../StateMachine/states";
import ThirdPersonScene from "../ThirdPersonScene";
import CharacterStateMachine from "./CharacterStateMachine";
import CharacterControllerInput from "./Controls/CharacterControllerInput";

export default class CharacterController {
  private acceleration = new Three.Vector3(1, 0.25, 50.0);
  private decceleration = new Three.Vector3(-0.0005, -0.0001, -5.0);
  private velocilty = new Three.Vector3(0, 0, 0);

  private animations: any = {};
  private input = new CharacterControllerInput();
  private stateMachine = new CharacterStateMachine(this.animations);
  private mixer: Three.AnimationMixer | undefined;
  private loadManager: Three.LoadingManager | undefined;
  private target: any;

  private scene: any;

  constructor(scene: ThirdPersonScene) {
    this.scene = scene;

    let path = "/public/model/";

    if (window.location.host === "onionknight621.github.io") {
      path = "https://onionknight621.github.io/three-game/model/"; // TODO: prepare smth more convenient
    }

    this.loadModels(path);
  }

  private loadModels(path: string) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load("xbot.fbx", (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse((c) => {
        c.castShadow = true;
      });

      this.target = fbx;
      this.scene.add(this.target);

      this.mixer = new Three.AnimationMixer(this.target);

      this.loadManager = new Three.LoadingManager();
      this.loadManager.onLoad = () => {
        this.stateMachine.SetState("idle");
      };

      const onLoad = (animName: string, anim: any) => {
        const clip = anim.animations[0];
        const action = this.mixer?.clipAction(clip);

        this.animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this.loadManager);
      loader.setPath(path);
      loader.load("Walking.fbx", (a) => {
        onLoad(states.walk, a);
      });
      loader.load("Idle.fbx", (a) => {
        onLoad(states.idle, a);
      });
    });
  }

  public Update(timeInSeconds: number) {
    if (!this.target) {
      return;
    }

    this.stateMachine.Update(timeInSeconds, this.input);

    const velocity = this.velocilty;
    const frameDecceleration = new Three.Vector3(
        velocity.x * this.decceleration.x,
        velocity.y * this.decceleration.y,
        velocity.z * this.decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this.target;
    const _Q = new Three.Quaternion();
    const _A = new Three.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this.acceleration.clone();

    if (this.input.keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this.input.keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }

    if (this.input.keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this.acceleration.y);
      _R.multiply(_Q);
    }
    if (this.input.keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this.acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new Three.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new Three.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new Three.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);

    console.log(controlObject.position, "pos")

    if (this.mixer) {
      this.mixer.update(timeInSeconds);
    }
  }
}
