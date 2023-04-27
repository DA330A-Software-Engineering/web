import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformCondition'
})
export class TransformConditionPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case 'grt':
        return 'Greater';
      case 'lsr':
        return 'Lesser';
      default:
        return value;
    }
  }
}
