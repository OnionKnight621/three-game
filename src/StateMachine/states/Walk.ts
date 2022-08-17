import { states } from ".";
import CharacterControllerInput from "../../Character/Controls/CharacterControllerInput";
import State from "../State";

export default class WalkState extends State {
  constructor(parent: any) {
    super(parent);
  }

  get name() {
    return states.walk;
  }

  protected Enter(prevState: any): void {
    const curAction = this.parent.animations[states.walk].action;

    if (prevState) {
      const prevAction = this.parent.animations[prevState.name].action;

      curAction.enabled = true;

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
      return;
    }

    this.parent.SetState(states.idle);
  }
}
