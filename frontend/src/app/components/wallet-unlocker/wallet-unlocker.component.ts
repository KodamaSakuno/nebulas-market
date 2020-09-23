import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-wallet-unlocker',
  templateUrl: './wallet-unlocker.component.html',
  styleUrls: ['./wallet-unlocker.component.styl']
})
export class WalletUnlockerComponent implements OnInit {

  constructor(public walletService: WalletService) {
  }

  ngOnInit(): void {
  }

  bind(address: string) {
    this.walletService.bind(address);
  }

}
