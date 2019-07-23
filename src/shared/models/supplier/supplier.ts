import { RfqSessionBid } from '../rfq-session-bid/rfq-session-bid';
import { environment } from '../../../environments/environment';

export class Supplier {
  constructor(supplier: Supplier) {
    Object.assign(this, supplier);

    if (this.logo && this.logo.indexOf(environment.resourceEndpoint) === -1) {
      this.logo = environment.resourceEndpoint + this.logo;
    }
  }

  public supplierID: string;
  public name: string;
  public logo: string;

  // for display only
  public bids: RfqSessionBid[];
}