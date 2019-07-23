import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingPage } from './billing';
import { SharedModule } from '../../../shared/shared.module';
import { BillingDetailPageModule } from './billing-detail/billing-detail.module';
import { BillingEntityInvoicesPageModule } from './billing-entity-invoices/billing-entity-invoices.module';

@NgModule({
  declarations: [
    BillingPage,
  ],
  entryComponents: [
    BillingPage
  ],
  imports: [
    SharedModule,
    BillingDetailPageModule,
    BillingEntityInvoicesPageModule,
    IonicPageModule.forChild(BillingPage),
  ],
})
export class BillingPageModule {}
