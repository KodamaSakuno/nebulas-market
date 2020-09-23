import { BigNumber } from 'bignumber.js';

export enum OrderType {
  NasToToken = "NAS->Token",
  TokenToNas = "Token->Nas",
}

export type OrderDto = {
  id: string,
  owner: string,
  type: OrderType,
  trader: string | null,
  token: string,
  value: string,
  amount: string,
  paidValue: string,
  paidAmount: string,
  symbol: string,
  decimals: number,
}

export const enum PaidState {
  Unpaid,
  DepositPaid,
  AllPaid,
}

export class Order {
  id: string;
  owner: string;
  type: OrderType;
  trader: string | null;
  value: BigNumber;
  amount: BigNumber;
  paidValue: BigNumber;
  paidAmount: BigNumber;
  decimals: number;
  symbol: string;

  get ratio() {
    return this.amount.div(this.value).toFixed(0);
  }

  get currencyPaidState() {
    if (this.paidValue.eq(0))
      return PaidState.Unpaid;

    if (this.paidValue.eq(this.value))
      return PaidState.AllPaid;

    return PaidState.DepositPaid;
  }
  get tokenPaidState() {
    if (this.paidAmount.eq(0))
      return PaidState.Unpaid;

    if (this.paidAmount.eq(this.amount))
      return PaidState.AllPaid;

    return PaidState.DepositPaid;
  }

  constructor(dto: OrderDto) {
    this.id = dto.id;
    this.owner = dto.owner;
    this.type = dto.type;
    this.trader = dto.trader;
    this.value = new BigNumber(dto.value);
    this.amount = new BigNumber(dto.amount);
    this.paidValue = new BigNumber(dto.paidValue);
    this.paidAmount = new BigNumber(dto.paidAmount);
    this.decimals = dto.decimals;
    this.symbol = dto.symbol;
  }
}
