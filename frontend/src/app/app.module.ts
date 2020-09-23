import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppIconsModule } from './app-icons.module';

import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { WalletUnlockerComponent } from './components/wallet-unlocker/wallet-unlocker.component';
import { TradeInputModalComponent } from './components/trade-input-modal/trade-input-modal.component';
import { InquiryListComponent } from './components/inquiry-list/inquiry-list.component';
import { InquiryItemComponent } from './components/inquiry-item/inquiry-item.component';
import { InquiryDetailModalComponent } from './components/inquiry-detail-modal/inquiry-detail-modal.component';
import { IntegerPipe } from './integer.pipe';
import { AddInquiryModalComponent } from './components/add-inquiry-modal/add-inquiry-modal.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { RemoveAllInquiriesModalComponent } from './components/remove-all-inquiries-modal/remove-all-inquiries-modal.component';
import { TestTokenComponent } from './components/test-token/test-token.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderItemComponent } from './components/order-item/order-item.component';
import { AddOrderModalComponent } from './components/add-order-modal/add-order-modal.component';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';
import { AddOrderPayCurrencyModalComponent } from './components/add-order-pay-currency-modal/add-order-pay-currency-modal.component';
import { AddOrderPayTokenModalComponent } from './components/add-order-pay-token-modal/add-order-pay-token-modal.component';
import { ConfigComponent } from './pages/config/config.component';
import { AmountInputComponent } from './components/amount-input/amount-input.component';
import { BigNumberPipe } from './bignumber.pipe';
import { OrderDetailPayCurrencyModalComponent } from './components/order-detail-pay-currency-modal/order-detail-pay-currency-modal.component';
import { OrderDetailPayTokenModalComponent } from './components/order-detail-pay-token-modal/order-detail-pay-token-modal.component';
import { RemoveOrderModalComponent } from './components/remove-order-modal/remove-order-modal.component';
import { TxsComponent } from './pages/txs/txs.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WalletUnlockerComponent,
    TradeInputModalComponent,
    InquiryListComponent,
    InquiryItemComponent,
    InquiryDetailModalComponent,
    IntegerPipe,
    AddInquiryModalComponent,
    QrcodeComponent,
    RemoveAllInquiriesModalComponent,
    TestTokenComponent,
    OrderListComponent,
    OrderItemComponent,
    AddOrderModalComponent,
    OrderDetailModalComponent,
    AddOrderPayCurrencyModalComponent,
    AddOrderPayTokenModalComponent,
    ConfigComponent,
    AmountInputComponent,
    BigNumberPipe,
    OrderDetailPayCurrencyModalComponent,
    OrderDetailPayTokenModalComponent,
    RemoveOrderModalComponent,
    TxsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    AppIconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
