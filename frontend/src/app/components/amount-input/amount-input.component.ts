import { Component, EventEmitter, Input, Output } from '@angular/core';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.styl']
})
export class AmountInputComponent {

  private _amount: BigNumber = new BigNumber(NaN);
  @Input()
  get amount() {
    return this._amount;
  }
  set amount(val: string | BigNumber) {
    this._amount = new BigNumber(val);
  }

  @Output()
  amountChange = new EventEmitter<BigNumber>();

  @Input()
  decimals = 0;

  @Input()
  min = new BigNumber(NaN);
  @Input()
  max = new BigNumber(NaN);

  @Input()
  disabled = false;

  get isInvalid() {
    return this._amount.isNaN() || (!this.min.isNaN() && this._amount.lt(this.min)) || (!this.max.isNaN() && this._amount.gt(this.max))
  }

  constructor() { }

  onInputChange(input: string) {
    this.amountChange.emit(new BigNumber(input).times(new BigNumber(10).pow(this.decimals)));
  }

}
