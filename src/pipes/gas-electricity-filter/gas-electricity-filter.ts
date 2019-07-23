import { Pipe, PipeTransform } from '@angular/core';

import { Constants } from '../../shared/constants';
import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'gasElectricityFilter'
})
export class GasElectricityFilterPipe implements PipeTransform {
  transform(contracts: Contract[], statuses: boolean[]) {
    let gasStatus = statuses[0];
    let electricityStatus = statuses[1];
    if (gasStatus && electricityStatus) return contracts;
    return contracts ? contracts.filter(a => 
         (gasStatus         && (a.serviceTypeID === Constants.serviceTypes.gas))
       || (electricityStatus && (a.serviceTypeID === Constants.serviceTypes.electricity))) : [];
  }
}
