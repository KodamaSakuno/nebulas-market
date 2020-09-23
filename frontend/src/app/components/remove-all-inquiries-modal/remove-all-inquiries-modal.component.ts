import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-remove-all-inquiries-modal',
  templateUrl: './remove-all-inquiries-modal.component.html',
  styleUrls: ['./remove-all-inquiries-modal.component.styl']
})
export class RemoveAllInquiriesModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService) { }

  ngOnInit(): void {
  }

}
