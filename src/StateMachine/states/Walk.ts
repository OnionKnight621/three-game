import { states } from ".";
import CharacterStateMachine from "../../Character/CharacterStateMachine";
import CharacterControllerInput from "../../Character/Controls/CharacterControllerInput";
import State from "../State";
import { stateType } from "../StateMachine";

export default class WalkState extends State {
  constructor(characterSM: CharacterStateMachine) {
    super(characterSM);
  }

  public get name() {
    return states.walk;
  }

  public Enter(prevState: stateType): void {
    const curAction = this.characterSM.animations[states.walk].action;

    if (!curAction) return;

    if (prevState) {
      const prevAction = this.characterSM.animations[prevState.name].action;

      curAction.reset();
      curAction.enabled = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  // @ts-ignore
  public Update(timeElapsed: number, input: CharacterControllerInput): void {
    if (input.keys.forward && input.keys.backward) {
      this.characterSM.SetState(states.idle);
      return;
    }

    if (input.keys.right && input.keys.left) {
      this.characterSM.SetState(states.idle);
      return;
    }

    if (
      input.keys.forward ||
      input.keys.backward ||
      input.keys.left ||
      input.keys.right
    ) {
      if (input.keys.space) {
        this.characterSM.SetState(states.roll);
        return;
      }
      return;
    }

    this.characterSM.SetState(states.idle);
  }
}
