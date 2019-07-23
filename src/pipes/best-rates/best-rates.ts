import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { RfqSessionRate } from '../../shared/models/rfq-session-rate/rfq-session-rate';

@Pipe({
  name: 'bestRates'
})
export class BestRatesPipe implements PipeTransform {

  transform(rates: RfqSessionRate[]) {
    const groupedRates = _.chain(rates)
      .groupBy((rate: RfqSessionRate) => `${rate.productID}_${rate.term}`)
      .toPairs()
      .map((groupedRate: any) => {
        return ({
          bestBid: _.chain(groupedRate[1]).sortBy('rate').head().value()
        })
      })
      .value();

    return groupedRates.map(b => b.bestBid);
  }
}
