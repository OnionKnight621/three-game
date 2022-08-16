export default class State {
  protected name: string | undefined;

  protected Enter(): void {
    console.log("Enter state:", this.name);
  }
  protected Exit(): void {
    console.log("Exit state:", this.name);
  }
  protected Update(timeElapsed: number, input: any): void {
    console.log("Update state:", this.name, input);
  }
}
