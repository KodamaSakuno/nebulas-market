import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { InquiryService } from '../../services/inquiry.service';
import { Inquiry } from '../../types/Inquiry';
import { AddInquiryModalComponent } from '../add-inquiry-modal/add-inquiry-modal.component';
import { RemoveAllInquiriesModalComponent } from '../remove-all-inquiries-modal/remove-all-inquiries-modal.component';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.styl']
})
export class InquiryListComponent implements OnInit {
  inquiries: Array<Inquiry> = [];

  constructor(private inquiryService: InquiryService, private modalService: NgbModal, private router: Router) {
    this.inquiryService.inquiries$.subscribe(inquiries => {
      this.inquiries = inquiries;
    });
  }

  ngOnInit(): void {
    this.inquiryService.getInquiries();
  }

  async addInquiry() {
    await this.modalService.open(AddInquiryModalComponent).result;

    this.inquiryService.getInquiries();
  }
  async removeAllInquiries() {
    await this.modalService.open(RemoveAllInquiriesModalComponent).result;

    this.inquiryService.getInquiries();
  }

  gotoTxs() {
    this.router.navigate(['txs']);
  }

}
