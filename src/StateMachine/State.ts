import CharacterStateMachine from "../Character/CharacterStateMachine";
import CharacterControllerInput from "../Character/Controls/CharacterControllerInput";
import { state } from "./StateMachine";

export default class State {
  protected characterSM: CharacterStateMachine;

  constructor(characterSM: CharacterStateMachine) {
    this.characterSM = characterSM;
  }

  public get name() {
    return "name";
  }

  // @ts-ignore
  public Enter(prevState: state): void {}
  public Exit(): void {}
  // @ts-ignore
  public Update(timeElapsed: number, input: CharacterControllerInput): void {}
}
