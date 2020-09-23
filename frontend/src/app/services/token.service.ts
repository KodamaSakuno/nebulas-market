import { Injectable } from '@angular/core';
import { defer } from 'rxjs';
import BigNumber from 'bignumber.js';

import { ContractService } from './contract.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  contractAddress = environment.tokenAddress;

  symbol = '???';
  decimals = 18;

  constructor(private contractService: ContractService) { }

  async initialize() {
    this.symbol = (await this.contractService.callPromise(environment.tokenAddress, 'symbol')).result;
    this.decimals = (await this.contractService.callPromise(environment.tokenAddress, 'decimals')).result;
  }

  getAllowance(owner: string, spender: string) {
    return defer(async () => {
      const { result } = await this.contractService.callPromise(environment.tokenAddress, 'allowance', [owner, spender]);

      return new BigNumber(result);
    });
  }
}
