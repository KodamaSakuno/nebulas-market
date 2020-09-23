import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';
import { TokenService } from '../../services/token.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-add-order-pay-token-modal',
  templateUrl: './add-order-pay-token-modal.component.html',
  styleUrls: ['./add-order-pay-token-modal.component.styl']
})
export class AddOrderPayTokenModalComponent implements OnInit {

  deposit!: BigNumber;
  max!: BigNumber;

  amount!: BigNumber;

  orderValueArg!:string;
  orderAmountArg!:string;

  allowance = new BigNumber(NaN);

  get isInsuffientAllowance() {
    return this.allowance.lt(this.amount);
  }

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
