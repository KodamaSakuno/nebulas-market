import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-order-detail-pay-currency-modal',
  templateUrl: './order-detail-pay-currency-modal.component.html',
  styleUrls: ['./order-detail-pay-currency-modal.component.styl']
})
export class OrderDetailPayCurrencyModalComponent implements OnInit {

  isNewTrader = false;

  min!: BigNumber;
  max!: BigNumber;

  value!: BigNumber;

  args!: any;

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService) { }

  ngOnInit(): void {
  }

}
