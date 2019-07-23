import { Entity } from "../entity/entity";
import { State } from "../state/state";

export class Customer {
  constructor(customer?: Customer) {
    Object.assign(this, customer);
  }

  public customerID: string;
  public DBAName: string;
  public contactFname: string;
  public contactTitle: string;
  public contactLname: string;
  public title: string;
  public address1: string;
  public address2: string;
  public city: string;
  public stateID: string;
  public zipCode: string;
  public phone: string;
  public phone2: string;
  public mobile: string;
  public email: string;
  public billingAddress1: string;
  public billingAddress2: string;
  public billingCity: string;
  public billingStateID: string;
  public billingZipCode: string;
  public entityID: number;

  public entity: Entity;
  public state: State;
  public billingState: State;
}