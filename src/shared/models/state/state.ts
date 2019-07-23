export class State {
  constructor(state: State) {
    Object.assign(this, state);
  }

  public stateID: string;
  public name: string;
  public stateShort: string;
  public stateLong: string;
}