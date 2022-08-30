import CharacterStateMachine from "../Character/CharacterStateMachine";
import CharacterControllerInput from "../Character/Controls/CharacterControllerInput";
import { stateType } from "./StateMachine";

export default class State {
  protected characterSM: CharacterStateMachine;

  constructor(characterSM: CharacterStateMachine) {
    this.characterSM = characterSM;
  }

  public get name() {
    return "name";
  }

  // @ts-ignore
  public Enter(prevState: stateType): void {}
  public Finished(): void {}
  public Cleanup(): void {}
  public Exit(): void {}
  // @ts-ignore
  public Update(timeElapsed: number, input: CharacterControllerInput): void {}
}
