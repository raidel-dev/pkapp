export class Invoice {
  constructor(invoice: Invoice) {
    Object.assign(this, invoice);
  }

  public id: string;
  public contractLocationID: string;
  public invoiceDate: Date;
  public dueDate: string;
  public amount: number;
  public usage: number;
  public isPaid: boolean;
  public billPeriodStartDate: Date;
  public billPeriodEndDate: Date;
}