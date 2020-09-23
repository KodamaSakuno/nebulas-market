import { Injectable } from '@angular/core';
import { defer, Subject } from 'rxjs';

import { Inquiry, InquiryDto } from '../types/Inquiry';
import { ContractService } from './contract.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  inquiries$ = new Subject<Array<Inquiry>>();

  constructor(private contractService: ContractService) { }

  async getInquiries() {
    const { result } = await this.contractService.callPromise(environment.marketAddress, 'getAllInquiries');

    this.inquiries$.next((result as Array<InquiryDto>).map(dto => new Inquiry(dto)));
  }
}
