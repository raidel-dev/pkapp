import { Rate } from '../rate/rate';
import { RfqSessionProduct } from '../rfq-session-product/rfq-session-product';
import { RfqSessionSupplier } from '../rfq-session-supplier/rfq-session-supplier';

export class RfqSessionBid {
  constructor(bid: RfqSessionBid | Rate) {
    Object.assign(this, bid);
  }

  public id: string;
  public greenPercentage: number;
  public bandwidthPercentage: number;
  public salesTax: number;
  public supplierID: string;
  public ipAddress: string;
  public billingMethod: string;
  public rfqSessionID: string;
  public debug: string;
  public addDate: string;
  public amount: number;
  public addDate2: string;
  public rfqSessionProductID: string;

  public rfqSessionProduct: RfqSessionProduct;
  public rfqSessionSupplier: RfqSessionSupplier;
}