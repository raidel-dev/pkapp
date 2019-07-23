import { Supplier } from '../supplier/supplier';

export class RfqSessionSupplier {
  constructor(supplier: RfqSessionSupplier) {
    Object.assign(this, supplier);
  }

  public id: string;
  public supplierID: string;
  public note: string;
  public isOptOut: boolean;

  public supplier: Supplier;
}