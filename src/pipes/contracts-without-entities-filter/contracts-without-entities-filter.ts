import { Pipe, PipeTransform } from '@angular/core';

import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'contractsWithoutEntitiesFilter'
})
export class ContractsWithoutEntitiesFilterPipe implements PipeTransform {
  transform(contracts: Contract[]) {
    return contracts ? contracts.filter(c => !c.customer || !c.customer.entityID) : [];
  }
}
