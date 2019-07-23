import { Invoice } from '../invoice/invoice';
import { State } from '../state/state';
import { Utility } from '../utility/utility';

export class ContractLocation {
  constructor(contractLocation?: ContractLocation) {
    Object.assign(this, contractLocation);
  }

  public contractLocationID?: string;
  public contractID?: string;
  public address1?: string;
  public address2?: string;
  public city?: string;
  public stateID?: string;
  public zipCode?: string;
  public isPaid?: boolean;
  public utilityID?: string;
  public supplierID?: string;
  public utilityAccountNum?: string;
  public utilityNameKey?: string;
  public utilityReferenceNum?: string;
  public utilityMeterNum?: string;
  public annualUsage?: number;
  public rateClass?: string;
  public zone?: string;

  public invoice?: Invoice;
  public utility?: Utility;
  public state?: State;
}