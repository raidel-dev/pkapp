import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
})
export class HighlightTextPipe implements PipeTransform {
  transform(value: any, searchQuery: string): any {
    if (!searchQuery) { return value; }
    const re = new RegExp(searchQuery, 'i');
    return value.replace(re, "<i class='matched'>" + searchQuery + "</i>");
  }
}
