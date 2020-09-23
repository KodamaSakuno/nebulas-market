export {};

declare global {
  type Options = {
    from: string,
    to: string,
    gasLimit: number,
    gasPrice: number,
    value: string,
    nonce: number,
    contract: {
      function: string,
      args: string,
    },
  };

  type AccountState = {
    balance: string,
    nonce: string,
  };

  type NebApiResponse = {
    result: string,
    execute_err: string,
    estimate_gas: string,
  }

  type NebApis = {
    call(options: Options): Promise<NebApiResponse>;
    getAccountState(from: string): Promise<AccountState>;
  }

  export class Neb {
    readonly api: NebApis;
    setRequest(httpRequest: HttpRequest): void;
  }

  export class Account {
    static isValidAddress(address: string | null): boolean;
  }

  export class HttpRequest {
    constructor(prefix: string);
  }

  type NebPayConfig = {
    mainnetUrl: string,
    testnetUrl: string,
  }

  class NebPay {
    static readonly config: NebPayConfig;

    constructor();

    call(to: string, value: string, func: string, args: string, options: any): string;
    nrc20pay(currency: string, to: string, value: string, options: any): string;
    queryPayInfo(sn: string, options: any): Promise<any>;
  }
}
