import { environment } from '../../../environments/environment';
import { Constants } from '../../constants';
import { Product } from '../product/product';
import { Rate } from '../rate/rate';
import { Supplier } from '../supplier/supplier';

export class RfqSessionRate {
  constructor(rate: RfqSessionRate | Rate, isAward: boolean, serviceTypeID: string) {
    Object.assign(this, rate);

    this.isAward = isAward;
    this.serviceTypeID = serviceTypeID;

    if (this.logo) {
      this.logo = !this.logo.includes('http') ? environment.resourceEndpoint + this.logo : this.logo;
    }
  }

  public greenPercentage: number;
  public bandwidthPercentage: number;
  public salesTax: number;
  public rate: number;
  public termName: string;
  public logo: string;
  public supplierID: string;
  public billingMethod: string;
  public term: number;
  public productID: string;
  public rateClass: string;
  public displayRate: string;
  public customerID: string;
  public companyID: string;
  public priceSecurity: number;
  public usageAdjustment: number;
  public units: string;
  public rateAddDate: string;
  public baseRate: number;
  public rfqSessionContractID: string;
  public premium: number;
  public rfqSessionID: string;
  public name: string;
  public commission: number;
  public termsAndConditions: string;
  public addDate: string;
  public savings: number;
  public popularity: number;
  public enRateDetail: string;
  public isGRTIncluded: string;

  public product: Product;
  public supplier: Supplier;

  public serviceTypeID: string;
  public isAward: boolean;
  public isExpanded: boolean = false; // used for auction in progress expansion of other bids in same category

  public getUsage(): string {
    if (this.bandwidthPercentage === 100 || !this.bandwidthPercentage) {
			return "Your rate stays fixed, no matter how much " + (this.serviceTypeID === Constants.serviceTypes.gas ? "natural gas" : "energy") + " you consume.";
		}

    return `Your rate stays fixed as long as your annual ${(this.serviceTypeID === Constants.serviceTypes.gas ? "natural gas" : "energy")} consumption doesn't increase or decrease beyond ${this.bandwidthPercentage}% of your last year's consumption.`;
    return '';
  }
}