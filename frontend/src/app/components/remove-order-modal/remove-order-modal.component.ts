import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-remove-order-modal',
  templateUrl: './remove-order-modal.component.html',
  styleUrls: ['./remove-order-modal.component.styl']
})
export class RemoveOrderModalComponent implements OnInit {

  args = [];

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService) { }

  ngOnInit(): void {
  }

}
