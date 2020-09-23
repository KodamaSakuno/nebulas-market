import { Component, OnInit } from '@angular/core';

import { WalletService } from '../../services/wallet.service';
import { TokenService } from '../../services/token.service';
import { MarketService } from '../../services/market.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {

  isAvailable = false;

  isDetailOrderList = false;

  get marketContractExplorerUrl() {
    return environment.explorerPrefix + this.marketService.contractAddress;
  }

  constructor(private walletService: WalletService, private tokenService: TokenService, private marketService: MarketService) {
    this.walletService.isAvailable.subscribe(isAvailable => {
      this.isAvailable = isAvailable;
    });
    this.walletService.checkBinded();
  }

  ngOnInit(): void {
    this.tokenService.initialize();
    this.marketService.initialize();
  }
}
