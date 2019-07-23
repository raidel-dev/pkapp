import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentSetupPage } from './payment-setup';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PaymentSetupPage,
  ],
  entryComponents: [
    PaymentSetupPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(PaymentSetupPage),
  ],
})
export class PaymentSetupPageModule {}
