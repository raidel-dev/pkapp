export class Product {
  constructor(product?: Product) {
    Object.assign(this, product);
  }

  public id: string;
  public serviceTypeID: string;
  public name: string;
  public description: string;
  public term: number;
  public isActive: boolean;
}