export default class State {
  protected parent: any;

  constructor(parent: any) {
    this.parent = parent;
  }

  protected get name() {
    return "name";
  }

  protected Enter(prevState: any): void {}
  protected Exit(): void {}
  protected Update(timeElapsed: number, input: any): void {}
}
