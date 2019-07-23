export class ServiceType {
  constructor(serviceType: ServiceType) {
    Object.assign(this, serviceType);
  }

  public serviceTypeID: string;
  public name: string;
  public units: string;
}
