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
    // this.input = new CharacterControllerInput();
    // this.stateMachine = new CharacterStateMachine(this.animations);

    this.scene = scene;

    this.loadModels();
  }

  private loadModels() {
    const loader = new FBXLoader();
    loader.setPath("./public/assets/");
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
      loader.setPath("./public/assets/");
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

    if (this.mixer) {
      this.mixer.update(timeInSeconds);
    }
  }
}
