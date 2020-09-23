import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BigNumber from 'bignumber.js';

import { environment } from '../../../environments/environment';
import { ContractService } from '../../services/contract.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-test-token',
  templateUrl: './test-token.component.html',
  styleUrls: ['./test-token.component.styl']
})
export class TestTokenComponent implements OnInit {
  address = environment.tokenAddress;
  balance?: BigNumber;

  constructor(private contractService: ContractService, private walletService: WalletService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.contractService.callPromise(this.address, 'balanceOf', [this.walletService.address]).then(({ result }) => {
      this.balance = new BigNumber(result).div(new BigNumber(10).pow(18));
    });
  }

  claimTestToken() {
    this.httpClient.post(`/claim/${this.walletService.address}`, {}).subscribe(() => {
      alert('转账操作成功，可过一会点击刷新看看是否到帐');
    });
  }

}
