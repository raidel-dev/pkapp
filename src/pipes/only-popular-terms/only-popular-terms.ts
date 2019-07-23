import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyPopularTerms',
})
export class OnlyPopularTermsPipe implements PipeTransform {

  transform(value: number[], showAllTerms: boolean) {
    if (!value || !value.length || showAllTerms) return value;
    
    return [6, 12, 24, 36, 48];
  }
}
