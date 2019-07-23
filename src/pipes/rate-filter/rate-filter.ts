import { Pipe, PipeTransform } from '@angular/core';
import { RfqSessionRate } from '../../shared/models/rfq-session-rate/rfq-session-rate';

@Pipe({
  name: 'rateFilter',
})
export class RateFilterPipe implements PipeTransform {
  transform(rates: RfqSessionRate[], productName: string, productTerm: number) {
    return rates.filter(b => b.product.name === productName && b.term === productTerm);
  }
}
