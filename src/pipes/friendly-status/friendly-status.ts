import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../shared/constants';

@Pipe({
  name: 'friendlyStatus'
})
export class FriendlyStatusPipe implements PipeTransform {
  transform(value: number) {
    return value || value === 0 ? Constants.quoteStatuses[value] : '';
  }
}
