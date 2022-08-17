import { states } from ".";
import CharacterControllerInput from "../../Character/Controls/CharacterControllerInput";
import State from "../State";

export default class IdleState extends State {
  constructor(parent: any) {
    super(parent);
  }

  get name() {
    return states.idle;
  }

  protected Enter(prevState: any): void {
    const curAction = this.parent.animations[states.idle].action;

    if (prevState) {
      const prevAction = this.parent.animations[prevState.name].action;

      curAction.time = 0.0;
      curAction.enabled = true;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);
      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  public Exit(): void {}

  // @ts-ignore
  protected Update(timeElapsed: number, input: CharacterControllerInput): void {
    if (
      input.keys.forward ||
      input.keys.backward ||
      input.keys.left ||
      input.keys.right
    ) {
      this.parent.SetState(states.walk);
    } else {
      this.parent.SetState(states.idle);
    }
  }
}
