import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { TokenService } from '../../services/token.service';
import { MarketService } from '../../services/market.service';
import { AddOrderPayCurrencyModalComponent } from '../add-order-pay-currency-modal/add-order-pay-currency-modal.component';
import { AddOrderPayTokenModalComponent } from '../add-order-pay-token-modal/add-order-pay-token-modal.component';

@Component({
  selector: 'app-add-order-modal',
  templateUrl: './add-order-modal.component.html',
  styleUrls: ['./add-order-modal.component.styl']
})
export class AddOrderModalComponent implements OnInit {

  value = new BigNumber(NaN);
  amount = new BigNumber(NaN);

  get ratio() {
    if (this.value.isNaN() || this.amount.isNaN())
      return '';

    return '1:' + this.amount.div(this.value).toFixed(0);
  }

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, public tokenService: TokenService, private marketService: MarketService) { }

  ngOnInit(): void {
  }

  async payCurrency() {
    const modal = this.modalService.open(AddOrderPayCurrencyModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.value,
      deposit: this.value.div(100).times(this.marketService.config.deposit),
      value: this.value,
      args: [this.tokenService.contractAddress, this.value.toString(10), this.amount.toString(10)],
    });

    await modal.result;

    this.activeModal.close();
  }
  async payToken() {
    const modal = this.modalService.open(AddOrderPayTokenModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.amount,
      deposit: this.amount.div(100).times(this.marketService.config.deposit),
      amount: this.amount,
      orderValueArg: this.value.toString(10),
      orderAmountArg: this.amount.toString(10),
    });

    await modal.result;

    this.activeModal.close();
  }

}
