import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingDetailPage } from './billing-detail';
import { SharedModule } from '../../../../shared/shared.module';
import { BillingMethodPageModule } from '../billing-method/billing-method.module';

@NgModule({
  declarations: [
    BillingDetailPage,
  ],
  entryComponents: [
    BillingDetailPage
  ],
  imports: [
    SharedModule,
    BillingMethodPageModule,
    IonicPageModule.forChild(BillingDetailPage),
  ],
})
export class BillingDetailPageModule {}
