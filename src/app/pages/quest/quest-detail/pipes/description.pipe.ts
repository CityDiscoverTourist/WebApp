import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'descriptionPipe' })
export class DescriptionPipe implements PipeTransform {
  transform(value: string) {
    var result = value.replace('<p>', ''); 
    return this.replaceAll(result, '&nbsp;', ' ');
  }
  public replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
}
