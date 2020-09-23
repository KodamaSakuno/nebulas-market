import BigNumber from 'bignumber.js';

export type InquiryDto = {
  id: string,
  from: string,
  valueOrAmount: string,
  symbol: string;
  decimals: number;
  blockHeight: number,
}

export class Inquiry {
  id: string;
  from: string;
  valueOrAmount: BigNumber;
  symbol: string;
  blockHeight: number;

  constructor(dto: InquiryDto) {
    this.id = dto.id;
    this.from = dto.from;
    this.valueOrAmount = new BigNumber(dto.valueOrAmount).div(new BigNumber(10).pow(dto.decimals));
    this.symbol = dto.symbol;
    this.blockHeight = dto.blockHeight;
  }
}
