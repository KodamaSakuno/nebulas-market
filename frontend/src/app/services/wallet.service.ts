import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const WalletKey = 'wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  address: string | null = null;

  isAvailable = new Subject<boolean>();

  constructor() {
    this.address = localStorage.getItem(WalletKey);

    if (!Account.isValidAddress(this.address)) {
      this.address = null;
      localStorage.removeItem(WalletKey);
    }
  }

  checkBinded() {
    this.isAvailable.next(!!this.address);
  }

  bind(address: string) {
    if (!Account.isValidAddress(address)) {
      alert('地址无效');
      return;
    }

    this.address = address;
    localStorage.setItem(WalletKey, address);

    this.isAvailable.next(false);
    this.isAvailable.next(true);
  }
}
