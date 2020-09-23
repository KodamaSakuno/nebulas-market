import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContractService } from '../../services/contract.service';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';
import { Transaction, TransactionDto } from '../../types/Transaction';
import { OrderType } from '../../types/Order';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.styl']
})
export class TxsComponent implements OnInit {

  OrderType = OrderType;

  transactions: Array<Transaction> = [];

  constructor(private router: Router, private contractService: ContractService, public tokenService: TokenService) { }

  async ngOnInit() {
    const { result } = await this.contractService.callPromise(environment.marketAddress, 'getAllTransactions');

    this.transactions = (result as Array<TransactionDto>).map(dto => new Transaction(dto));
  }

  goback() {
    this.router.navigate(['']);
  }

}
