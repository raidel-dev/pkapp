import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingInfoPage } from './billing-info';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    BillingInfoPage
  ],
  entryComponents: [
    BillingInfoPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(BillingInfoPage),
  ],
})
export class BillingInfoPageModule {}
