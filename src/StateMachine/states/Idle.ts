import State from "../State";

export default class IdleState extends State {
    constructor() {
        super();

        this.name = "idle"
    }

    Enter(): void {
        
    }

    Exit(): void {

    }

    Update(timeElapsed: number, input: any): void {

    }
}