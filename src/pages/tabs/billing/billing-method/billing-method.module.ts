import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingMethodPage } from './billing-method';

@NgModule({
  declarations: [
    BillingMethodPage,
  ],
  entryComponents: [
    BillingMethodPage
  ],
  imports: [
    IonicPageModule.forChild(BillingMethodPage),
  ],
})
export class BillingMethodPageModule {}
