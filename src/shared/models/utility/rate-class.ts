export class RateClass {
  constructor(rateClass: RateClass) {
    Object.assign(this, rateClass);
  }

  public name: string;
  public isDefault: boolean;
}