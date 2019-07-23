import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'sortContractsByServiceType',
})
export class SortContractsByServiceTypePipe implements PipeTransform {

  transform(contracts: Contract[]) {
    return contracts ? _.sortBy(contracts, 'serviceTypeID') : [];
  }
}
