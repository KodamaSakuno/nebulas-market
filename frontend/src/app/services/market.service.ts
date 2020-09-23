import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Config } from '../types/Config';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  contractAddress = environment.marketAddress;

  config!: Config;

  constructor(private contractService: ContractService) { }

  async initialize() {
    this.config = (await this.contractService.callPromise(this.contractAddress, 'getConfig')).result;
  }
}
