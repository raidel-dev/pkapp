export class DefaultUtilityMap {
  constructor(defaultUtilityMap: DefaultUtilityMap) {
    Object.assign(this, defaultUtilityMap);
  }

  public serviceTypeID: string;
  public utilityID: string;
}