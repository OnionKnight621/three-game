export default class StateMachine {
    private states: any = {};
    private currentState: any = null;
  
    protected AddState(name: string, type: any) {
      this.states[name] = type;
    }
  
    SetState(name: string): void {
      const prevState = this.currentState;
      
      if (prevState) {
        if (prevState.Name == name) {
          return;
        }
        prevState.Exit();
      }
  
      const state = new this.states[name](this);
  
      this.currentState = state;
      state.Enter(prevState);
    }
  
    Update(timeElapsed: number, input: any): void {
      if (this.currentState) {
        this.currentState.Update(timeElapsed, input);
      }
    }
  };