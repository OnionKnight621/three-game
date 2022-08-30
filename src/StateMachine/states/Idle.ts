import { states } from ".";
import CharacterStateMachine from "../../Character/CharacterStateMachine";
import CharacterControllerInput from "../../Character/Controls/CharacterControllerInput";
import State from "../State";
import { stateType } from "../StateMachine";

export default class IdleState extends State {
  constructor(characterSM: CharacterStateMachine) {
    super(characterSM);
  }

  public get name() {
    return states.idle;
  }

  public Enter(prevState: stateType): void {
    const curAction = this.characterSM.animations[states.idle].action;

    if (!curAction) return;

    if (prevState) {
      const prevAction = this.characterSM.animations[prevState.name].action;

      curAction.time = 0.0;
      curAction.enabled = true;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  // @ts-ignore
  public Update(timeElapsed: number, input: CharacterControllerInput): void {
    if (
      input.keys.forward ||
      input.keys.backward ||
      input.keys.left ||
      input.keys.right
    ) {
      this.characterSM.SetState(states.walk);
      return;
    }

    if (input.keys.space) {
      this.characterSM.SetState(states.roll);
      return;
    }

    this.characterSM.SetState(states.idle);
  }
}
