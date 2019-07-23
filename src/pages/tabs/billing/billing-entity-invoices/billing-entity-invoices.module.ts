import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingEntityInvoicesPage } from './billing-entity-invoices';
import { SharedModule } from '../../../../shared/shared.module';
import { BillingMethodPageModule } from '../billing-method/billing-method.module';
import { BillingDetailPageModule } from '../billing-detail/billing-detail.module';

@NgModule({
  declarations: [
    BillingEntityInvoicesPage,
  ],
  entryComponents: [
    BillingEntityInvoicesPage
  ],
  imports: [
    SharedModule,
    BillingMethodPageModule,
    BillingDetailPageModule,
    IonicPageModule.forChild(BillingEntityInvoicesPage),
  ],
})
export class BillingEntityInvoicesPageModule {}
