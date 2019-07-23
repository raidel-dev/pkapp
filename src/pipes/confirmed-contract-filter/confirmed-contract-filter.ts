import { Pipe, PipeTransform } from '@angular/core';

import { Constants } from '../../shared/constants';
import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'confirmedContractFilter',
})
export class ConfirmedContractFilterPipe implements PipeTransform {
  transform(contracts: Contract[]) {
    return contracts ? contracts.filter(c => c.status === Constants.quoteStatuses.confirmed) : [];
  }
}
