export class Zone {
  constructor(zone: Zone) {
    Object.assign(this, zone);
  }

  public name: string;
}