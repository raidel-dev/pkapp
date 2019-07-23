import { Pipe, PipeTransform } from '@angular/core';

import { ContractLocation } from '../../shared/models/contract-location/contract-location';

@Pipe({
  name: 'locationsWithInvoice'
})
export class LocationsWithInvoicePipe implements PipeTransform {
  transform(contractLocations: ContractLocation[]) {
    return contractLocations ? contractLocations.filter(c => c.invoice) : [];
  }
}
