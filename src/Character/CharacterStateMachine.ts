import StateMachine from "../StateMachine/StateMachine";
import IdleState from "../StateMachine/states/Idle";
import WalkState from "../StateMachine/states/Walk";
import { states } from "../StateMachine/states";

export default class CharacterStateMachine extends StateMachine {
  protected animations: any;

  constructor(animations: any) {
    super();
    this.animations = animations;

    this.AddState(states.idle, IdleState);
    this.AddState(states.walk, WalkState);
  }
}
