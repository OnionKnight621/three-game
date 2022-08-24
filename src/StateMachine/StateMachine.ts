import CharacterControllerInput from "../Character/Controls/CharacterControllerInput";
import State from "./State";
import IdleState from "./states/Idle";
import WalkState from "./states/Walk";

export type state = typeof IdleState | typeof WalkState;

export default class StateMachine {
  private states: any = {}; // TODO: set proper type for this mess
  private currentState?: State;

  protected AddState(name: string, type: state) {
    this.states[name] = type;
  }

  public SetState(name: string): void {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.name === name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this.states[name](this);

    this.currentState = state;
    state.Enter(prevState);
  }

  public Update(timeElapsed: number, input: CharacterControllerInput): void {
    if (this.currentState) {
      this.currentState.Update(timeElapsed, input);
    }
  }
}
