import BigNumber from 'bignumber.js';
import { Order, OrderDto } from './Order';

export type TransactionDto = {
  id: string,
  actualValue: string,
  actualAmount: string,
  blockHeight: number,
  order: OrderDto,
}

export class Transaction {
  id: string;
  actualValue: BigNumber;
  actualAmount: BigNumber;
  blockHeight: number;
  order: Order;

  constructor(dto: TransactionDto) {
    this.id = dto.id;
    this.blockHeight = dto.blockHeight;
    this.actualValue = new BigNumber(dto.actualValue);
    this.actualAmount = new BigNumber(dto.actualAmount);
    this.order = new Order(dto.order);
  }
}
