import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'integer'
})
export class IntegerPipe implements PipeTransform {

  transform(value: string | BigNumber): string {
    if (typeof value === 'string')
      value = new BigNumber(value);

    return value.toFixed(0);
  }

}
