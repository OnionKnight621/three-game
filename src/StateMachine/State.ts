export default class State {
  protected parent: any;

  constructor(parent: any) {
    this.parent = parent;
  }

  protected get name() {
    return "name";
  }

  // @ts-ignore
  protected Enter(prevState: any): void {}
  protected Exit(): void {}
  // @ts-ignore
  protected Update(timeElapsed: number, input: any): void {}
}
