import { Pipe, PipeTransform } from '@angular/core';

import { Alert } from '../../shared/models/alert/alert';

@Pipe({
  name: 'alertFilter',
})
export class AlertFilterPipe implements PipeTransform {
  transform(alerts: Alert[], filterByContractID: boolean) {
    return alerts 
      ? alerts
        .filter(a => (filterByContractID && a.contractID)
                  || (!filterByContractID && !a.contractID))
      : [];
  }
}
