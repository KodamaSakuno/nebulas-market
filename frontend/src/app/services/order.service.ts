import { Injectable } from '@angular/core';
import { defer, Subject } from 'rxjs';

import { ContractService } from './contract.service';
import { Order, OrderDto } from '../types/Order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders$ = new Subject<Array<Order>>();

  constructor(private contractService: ContractService) { }

  async getOrders() {
    const { result } = await this.contractService.callPromise(environment.marketAddress, 'getAllOrders');

    this.orders$.next((result as Array<OrderDto>).map(dto => new Order(dto)));
  }

  async getOrder(id: string) {
    const { result } = await this.contractService.callPromise(environment.marketAddress, 'getOrder', [id]);

    if (!result)
      return null;

    return new Order(result);
  }
}
