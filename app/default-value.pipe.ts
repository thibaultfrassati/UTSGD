import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue'
})
export class DefaultValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return 'Consultation' 
    	else return value;
  }

}
