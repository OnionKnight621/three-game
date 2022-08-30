import StateMachine from "../StateMachine/StateMachine";
import IdleState from "../StateMachine/states/Idle";
import WalkState from "../StateMachine/states/Walk";
import { states } from "../StateMachine/states";
import { Animations } from "./CharacterController";
import RollState from "../StateMachine/states/Roll";

export default class CharacterStateMachine extends StateMachine {
  public animations: Animations;

  constructor(animations: Animations) {
    super();
    this.animations = animations;

    this.AddState(states.idle, IdleState);
    this.AddState(states.walk, WalkState);
    this.AddState(states.roll, RollState);
  }
}
