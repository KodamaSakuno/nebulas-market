import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import BigNumber from 'bignumber.js';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.styl']
})
export class QrcodeComponent implements OnInit {
  instance: symbol;

  @Input()
  to?: string;

  @Input()
  value: string | BigNumber = "0";

  @Input()
  func?: string;

  private _args: any[] = [];
  get args() {
    return this._args;
  }
  @Input()
  set args(val: any[]) {
    this._args = val;

    this.refresh();
  }

  get isMobile() {
    return this.deviceService.isMobile();
  }

  jumped = false;

  qrdata!: string;

  @Output()
  success = new EventEmitter();

  constructor(private contractService: ContractService, private deviceService: DeviceDetectorService) {
    this.instance = Symbol();
  }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh() {
    if (!this.to || !this.func)
      throw new Error("Parameter(s) missed");

    const { data, promise } = this.contractService.generateQRDataForCall(this.instance, this.to, this.value, this.func, this.args);

    this.qrdata = data;
    this._handlePromise(promise);
  }

  useExtension() {
    if (!this.to || !this.func || !this.args)
      throw new Error("Parameter(s) missed");

    this._handlePromise(this.contractService.callWithPay(this.to, this.func, this.value, this.args));
  }

  private _handlePromise(promise: Promise<unknown>) {
    promise.then(() => {
      this.success.emit();
    }).catch(reason => {
      alert(reason);
    });
  }

  jumpToNasNano() {
    window.location.href = `openapp.NASnano://virtual?params=${this.qrdata}`;

    this.jumped = true;
  }
  manualConfirm() {
    this.success.emit();
  }

}
