import StateMachine from "../StateMachine/StateMachine";
import IdleState from "../StateMachine/states/Idle";

const states = {
    idle: "idle",
    walk: "walk"
}

export default class CharacterStateMachine extends StateMachine {
    constructor() {
        super();

        this.AddState(states.idle, IdleState);
    }
}