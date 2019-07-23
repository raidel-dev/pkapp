import { Pipe, PipeTransform } from '@angular/core';

import { Entity } from '../../shared/models/entity/entity';

@Pipe({
  name: 'entitiesWithInvoices'
})
export class EntitiesWithInvoicesPipe implements PipeTransform {
  transform(entities: Entity[]) {
    return entities ? entities.filter(e => e.contracts && e.contracts.some(c => !!c.invoices && !!c.invoices.length)) : [];
  }
}
