import { Pipe, PipeTransform } from '@angular/core';

import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'contractNumFilter'
})
export class ContractNumFilterPipe implements PipeTransform {
  transform(contracts: Contract[], searchQuery: string) {
    return contracts ? contracts
      .filter(c => !searchQuery || c.contractNum.indexOf(searchQuery) !== -1) : [];
  }
}
