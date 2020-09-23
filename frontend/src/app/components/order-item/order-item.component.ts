import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Order } from '../../types/Order';
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.styl']
})
export class OrderItemComponent implements OnInit {
  @Input()
  order!: Order;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  showDetail() {
    const modal = this.modalService.open(OrderDetailModalComponent);

    modal.componentInstance.order = this.order;
  }
}
