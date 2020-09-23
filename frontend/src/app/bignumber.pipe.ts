import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'bignumber'
})
export class BigNumberPipe implements PipeTransform {

  transform(value: string | BigNumber, decimals: number) {
    if (typeof value === 'string')
      value = new BigNumber(value);

    if (value.isNaN())
      return '';

    return value.div(new BigNumber(10).pow(decimals)).toString(10);
  }

}
