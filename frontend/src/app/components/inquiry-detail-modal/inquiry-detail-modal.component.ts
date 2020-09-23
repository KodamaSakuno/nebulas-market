import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Inquiry } from '../../types/Inquiry';
import { WalletService } from '../../services/wallet.service';
import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-inquiry-detail-modal',
  templateUrl: './inquiry-detail-modal.component.html',
  styleUrls: ['./inquiry-detail-modal.component.styl']
})
export class InquiryDetailModalComponent implements OnInit {
  inquiry!: Inquiry;

  isMine = false;

  constructor(public activeModal: NgbActiveModal, private walletService: WalletService, public marketService: MarketService) { }

  ngOnInit(): void {
    this.isMine = this.inquiry.from === this.walletService.address;
  }

}
