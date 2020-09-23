import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Inquiry } from '../../types/Inquiry';
import { InquiryDetailModalComponent } from '../inquiry-detail-modal/inquiry-detail-modal.component';

@Component({
  selector: 'app-inquiry-item',
  templateUrl: './inquiry-item.component.html',
  styleUrls: ['./inquiry-item.component.styl']
})
export class InquiryItemComponent implements OnInit {
  @Input()
  inquiry!: Inquiry;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  showDetail() {
    const modal = this.modalService.open(InquiryDetailModalComponent);

    modal.componentInstance.inquiry = this.inquiry;
  }
}
