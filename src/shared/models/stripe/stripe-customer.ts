export class StripeCustomer {
  constructor(customer: StripeCustomer) {
    Object.assign(this, customer);
  }

  public id: string;
  public defaultSourceId: string;
}