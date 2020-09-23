import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';
import { TokenService } from '../../services/token.service';
import { WalletService } from '../../services/wallet.service';
import { Order } from '../../types/Order';

@Component({
  selector: 'app-order-detail-pay-token-modal',
  templateUrl: './order-detail-pay-token-modal.component.html',
  styleUrls: ['./order-detail-pay-token-modal.component.styl']
})
export class OrderDetailPayTokenModalComponent implements OnInit {

  isNewTrader = false;

  min!: BigNumber;
  max!: BigNumber;

  amount!: BigNumber;

  order!: Order;

  allowance = new BigNumber(NaN);

  get isInsuffientAllowance() {
    return this.allowance.lt(this.amount);
  }

  idArg!: string;

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService,
    public tokenService: TokenService, private walletService: WalletService) { }

  ngOnInit(): void {
    this.refreshAllowance();
  }

  refreshAllowance() {
    this.allowance = new BigNumber(NaN);

    this.tokenService.getAllowance(this.walletService.address!, this.marketService.contractAddress).subscribe(allowance => {
      this.allowance = allowance;
    });
  }

}
