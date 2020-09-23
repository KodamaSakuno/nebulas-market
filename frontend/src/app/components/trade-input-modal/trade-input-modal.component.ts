import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trade-input-modal',
  templateUrl: './trade-input-modal.component.html',
  styleUrls: ['./trade-input-modal.component.styl']
})
export class TradeInputModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
