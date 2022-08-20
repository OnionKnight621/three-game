import * as Three from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { states } from "../StateMachine/states";
import ThirdPersonScene from "../ThirdPersonScene";
import CharacterStateMachine from "./CharacterStateMachine";
import CharacterControllerInput from "./Controls/CharacterControllerInput";

export default class CharacterController {
  private animations: any = {};
  private input = new CharacterControllerInput();
  private stateMachine = new CharacterStateMachine(this.animations);

  private mixer?: Three.AnimationMixer;
  private loadManager?: Three.LoadingManager;
  private target?: Three.Group;
  private scene?: ThirdPersonScene;

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
      fbx.scale.setScalar(0.06);
      fbx.traverse((c) => {
        c.castShadow = true;
      });

      this.target = fbx;
      this.scene?.add(this.target);

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

    const controlObject = this.target;

    if (this.input.keys.forward) {
      controlObject.position.z += 0.1;
      controlObject.rotation.y = 0 * Math.PI;
    }
    if (this.input.keys.left) {
      controlObject.position.x += 0.1;
      controlObject.rotation.y = 0.5 * Math.PI;
    }
    if (this.input.keys.backward) {
      controlObject.position.z -= 0.1;
      controlObject.rotation.y = 1.0 * Math.PI;
    }
    if (this.input.keys.right) {
      controlObject.position.x -= 0.1;
      controlObject.rotation.y = 1.5 * Math.PI;
    }

    if (this.mixer) {
      this.mixer.update(timeInSeconds);
    }
  }
}
