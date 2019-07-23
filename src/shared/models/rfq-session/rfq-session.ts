import { Contract } from '../contract/contract';
import { RfqSessionProduct } from '../rfq-session-product/rfq-session-product';
import { RfqSessionRate } from '../rfq-session-rate/rfq-session-rate';

export class RfqSession {
  constructor(rfqSession: RfqSession) {
    Object.assign(this, rfqSession);

    if (rfqSession.contract) {
      this.contract = new Contract(rfqSession.contract);
    }

    if (rfqSession.rates) {
      this.rates = rfqSession.rates.map(r => new RfqSessionRate(r, true, this.contract ? this.contract.serviceTypeID : ''));
    }
  }

  public id: string;
  public addDate: Date;
  public endDate: Date | string;
  public endDate2: string;
  public endTime: string;
  public instructions: string;
  public isActive: boolean;
  public maxBids: number;
  public maxExtends: number;
  public startDate: Date;
  public startDate2: string;
  public contractID: string;

  public contract: Contract;
  public rates: RfqSessionRate[];
  public products: RfqSessionProduct[];
}
