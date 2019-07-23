import { ValidatorFn, FormGroup, ValidationErrors, FormArray } from "@angular/forms";
import { UserDefaultProduct } from "../models/user-default-product/user-default-product";

/** Products must all be unique and have at least one chosen on the form */

export const productsValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const products = <FormArray>control.get('products');

  if (products.length == 0) {
    return { 'productAmount': true };
  }

  let allUnique = true;
  let allFilledOut = true;
  products.controls.forEach(control => {
    const product = <UserDefaultProduct>control.value;
    if (!product || !product.product || !product.product.name || !product.term) {
      allFilledOut = false;
    }
    if (allFilledOut) {
      const matchedProduct = products.controls
        .filter(c => c != control)
        .find(c => c.value.product && product.product
                && c.value.product.name === product.product.name 
                && c.value.term === product.term);
      if (matchedProduct) {
        allUnique = false;
      }
    }
  });

  if (!allFilledOut) {
    return { 'productFilled': true };
  }

  return !allUnique ? { 'productUnique': true } : null;
};