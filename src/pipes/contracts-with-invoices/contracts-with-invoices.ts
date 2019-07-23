import { Pipe, PipeTransform } from '@angular/core';

import { Contract } from '../../shared/models/contract/contract';

@Pipe({
  name: 'contractsWithInvoices'
})
export class ContractsWithInvoicesPipe implements PipeTransform {
  transform(contracts: Contract[]) {
    return contracts ? contracts.filter(c => !!c.invoices && !!c.invoices.length) : [];
  }
}
