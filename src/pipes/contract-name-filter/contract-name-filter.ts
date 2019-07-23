import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractNameFilter',
})
export class ContractNameFilterPipe implements PipeTransform {
  transform(contracts: any[], contractName: string) {
    if (!contracts || !contracts.length || !contractName) return contracts;

    const contractNameLower = contractName.toLowerCase();
    return contracts.filter((x) => x.contractnumber.toLowerCase().includes(contractNameLower));
  }
}
