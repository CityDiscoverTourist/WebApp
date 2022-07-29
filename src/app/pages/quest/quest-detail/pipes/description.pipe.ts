import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'descriptionPipe' })
export class DescriptionPipe implements PipeTransform {
  transform(value: string) {
    var result= this.replaceAll(value, '&nbsp;', ' ');
    result=this.replaceAll(result, '</p>', ' ');
    result=this.replaceAll(result, '<p>', ' ');
    result=this.replaceAll(result, '<br>', ' ');
    return result;
  }
  public replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
}
