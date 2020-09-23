import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-pay-currency-modal',
  templateUrl: './add-order-pay-currency-modal.component.html',
  styleUrls: ['./add-order-pay-currency-modal.component.styl']
})
export class AddOrderPayCurrencyModalComponent implements OnInit {

  deposit!: BigNumber;
  max!: BigNumber;

  value!: BigNumber;

  args!: any[];

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService) { }

  ngOnInit(): void {
  }

}
