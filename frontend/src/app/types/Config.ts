import BigNumber from 'bignumber.js';

export type Config = {
  minValue: string | BigNumber,
  maxValue: string | BigNumber,
  minAmount: string | BigNumber,
  maxAmount: string | BigNumber,
  ratioProtectRange: number,
  valueProtectRange: number,
  deposit: number,
  fee: number,
  fee50Receiver: string,
  fee10Receivers: Array<string>,
}
