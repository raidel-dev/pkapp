import { Supplier } from "../supplier/supplier";

export class Rate {
  constructor(rate: Rate) {
    Object.assign(this, rate);
  }

  public addDate: Date;
  public bandwidthPercentage: number;
  public baseRate: number;
  public billingMethod: string;
  public customerID: string;
  public displayRate: string;
  public logo: string;
  public name: string;
  public productID: string;
  public rfqSessionID: string;
  public rate: number;
  public savings: number;
  public supplierID: string;
  public term: number;
  public termName: string;
  public units: string;
  public usageAdjustment: number;
  public termsAndConditions: string;
  public tosPath: string;
  public greenPercentage: number;
  public enRateDetail: string;

  public supplier: Supplier;
}