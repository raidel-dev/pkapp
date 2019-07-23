import { Constants } from '../../constants';
import { ContractLocation } from '../contract-location/contract-location';
import { Customer } from '../customer/customer';
import { Invoice } from '../invoice/invoice';
import { Product } from '../product/product';
import { ServiceType } from '../service-type/service-type';
import { Supplier } from '../supplier/supplier';
import { Feedback } from '../feedback/feedback';
import { RfqSession } from '../rfq-session/rfq-session';

export class Contract {
  constructor(contract?: Contract) {
    Object.assign(this, contract);

    if (contract) {
      this.expirationDate = new Date(contract.expirationDate);
      this.contractDate = new Date(contract.contractDate);
      this.effectiveDate = new Date(contract.effectiveDate);

      this.supplier = new Supplier(contract.supplier);
    }
  }

  public contractID: string;
  public customerID: string;
  public productID: string;
  public expirationDate: Date;
  public serviceTypeID: string;
  public supplierID: string;
  public award: boolean;
  public contractNum: string;
  public contractDate: Date;
  public rate: number;
  public term: number;
  public status: number;
  public switchDate: Date;
  public effectiveDate: Date | string;
  public annualUsage: number;
  public renewalID: string;
  public stateID: string;
  public rfqSessionID: string;
  public rateDetail: string;
  public regenerateDocuments: boolean;

  public invoices: Invoice[];
  public locations: ContractLocation[];
  public customer: Customer;
  public serviceType: ServiceType;
  public supplier: Supplier;
  public renewalContract: Contract;
  public product: Product;
  public feedback: Feedback;
  public rfqSession: RfqSession;

  public addButtonText = 'Add';
  public addButtonEnabled = true;
  public errorMessage = '';

  public getDaysUntilExpiration(): number {
    return this.expirationDate && typeof this.expirationDate !== 'string'
      ? Math.round(Math.abs((new Date().getTime() - this.expirationDate.getTime()) / (Constants.oneDay)))
      : 0;
  }

  public getInvoiceTotal(): number {
    return this.invoices ? this.invoices.reduce((total, invoice) => total + invoice.amount, 0) : 0;
  }

  public getEffectiveDateSmall(): string {
    return `${(<Date>this.effectiveDate).getMonth() + 1}/1/${(<Date>this.effectiveDate).getFullYear()}`;
  }

  public getZone(): string {
    return this.locations && this.locations[0].zone
      ? this.locations[0].zone
      : '';
  }

  public getAnnualUsage(): number {
    return this.locations && this.locations[0].annualUsage
      ? this.locations[0].annualUsage
      : 0;
  }

  public getBaseRate(): number {
    return this.locations && this.locations[0].utility
      ? this.locations[0].utility.baseRate
      : undefined;
  }

  public getRateClass(): string {
    return this.locations && this.locations[0].rateClass
      ? this.locations[0].rateClass
      : '';
  }

  public getZipCode(): string {
    return this.locations && this.locations[0].zipCode
      ? this.locations[0].zipCode
      : undefined;
  }

  public getUtilityID(): string {
    return this.locations && this.locations[0].utilityID
      ? this.locations[0].utilityID
      : '';
  }

  public getUtilityName(): string {
    return this.locations && this.locations[0].utility
      ? this.locations[0].utility.name
      : '';
  }

  public getUtilityAbbreviation(): string {
    return this.locations && this.locations[0].utility
      ? this.locations[0].utility.abbreviation
      : '';
  }

  public getEstimatedAnnualSpend(): number {
    return (this.annualUsage * this.rate * 100) / 100;
  }
}