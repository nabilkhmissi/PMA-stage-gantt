import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defautimg'
})
export class DefautimgPipe implements PipeTransform {

  transform(value: any): any {
    if (!value || value==null) return "avaat.png";
    else return value;}
}
