import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';

import { environment } from '../../../environments/environment';
import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';
import { MarketService } from '../../services/market.service';
import { TokenService } from '../../services/token.service';
import { Config } from '../../types/Config';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.styl']
})
export class ConfigComponent implements OnInit {

  isAvailable = false;

  proxyContractAddress = environment.proxyAddress;
  config: Config | null = null;

  symbol = '';
  decimals = 0;

  args: Array<any> | null = null;

  constructor(private walletService: WalletService, private contractService: ContractService, private marketService: MarketService, private tokenService: TokenService) {
    this.walletService.isAvailable.subscribe(isAvailable => {
      this.isAvailable = isAvailable;

      if (!isAvailable)
        return;

      this.contractService.call(this.marketService.contractAddress, 'getConfig').subscribe(({ result }) => {
        this.config = result;
      });
      this.contractService.call(this.tokenService.contractAddress, 'symbol').subscribe(({ result }) => {
        this.symbol = result;
      });
      this.contractService.call(this.tokenService.contractAddress, 'decimals').subscribe(({ result }) => {
        this.decimals = result;
      });
    });
    this.walletService.checkBinded();
  }

  ngOnInit(): void {
  }

  update() {
    this.args = [this.marketService.contractAddress, this.config];
  }

}
