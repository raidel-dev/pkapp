import { Product } from '../product/product';

export class UserDefaultProduct {
  constructor(product: UserDefaultProduct) {
    Object.assign(this, product);
  }

  public productID: string;
  public term: number;

  public product: Product;
}