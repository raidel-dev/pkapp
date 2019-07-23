import { Pipe, PipeTransform } from '@angular/core';

import { Contract } from '../../shared/models/contract/contract';
import { ContractFilter } from './contract-filter';

@Pipe({
  name: 'contractsFilter'
})
export class ContractsFilterPipe implements PipeTransform {
  
  transform(contracts: Contract[], filter: ContractFilter) {
    if (!contracts) return [];
    if (!filter) return contracts;

    return contracts.filter(c =>
       (!filter.statuses.length  || !!filter.statuses.find(s => s.status >= 0 ? (s.status === c.status) : (s.status !== c.status)))
    && (!filter.utilities.length || !!filter.utilities.find(u => u.utilityID === c.getUtilityID()))
    && (!filter.states.length    || !!filter.states.find(s => s.stateID === c.stateID))
    && (!filter.signatureDateFrom || filter.signatureDateFrom.getTime() <= c.contractDate.getTime())
    && (!filter.signatureDateTo || filter.signatureDateTo.getTime() >= c.contractDate.getTime()));
  }
}
