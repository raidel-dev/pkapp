import { Product } from "../product/product";

export class RfqSessionProduct {
  constructor(product: RfqSessionProduct) {
    Object.assign(this, product);
  }

  public id: string;
  public productID: string;
  public term: number;

  public product: Product;
}