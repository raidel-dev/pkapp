import { Pipe, PipeTransform } from '@angular/core';
import { HelperServiceProvider } from '../../providers/helper/helper-service';

@Pipe({
  name: 'formatPhone',
})
export class FormatPhonePipe implements PipeTransform {
  
  transform(phoneNumber: string) {
    return HelperServiceProvider.formatPhone(phoneNumber);
  }
}
