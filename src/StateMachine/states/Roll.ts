import * as Three from "three";

import { states } from ".";
import CharacterStateMachine from "../../Character/CharacterStateMachine";
import State from "../State";
import { stateType } from "../StateMachine";

export default class RollState extends State {
  constructor(characterSM: CharacterStateMachine) {
    super(characterSM);
  }

  public get name() {
    return states.roll;
  }

  public Enter(prevState: stateType): void {
    const curAction = this.characterSM.animations[states.roll].action;
    const mixer = curAction.getMixer();

    mixer.addEventListener("finished", this.Finished.bind(this));

    if (!curAction) return;

    if (prevState) {
      const prevAction = this.characterSM.animations[prevState.name].action;

      curAction.reset();
      curAction.setLoop(Three.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  public Finished(): void {
    this.characterSM.SetState("idle");
  }
}
