import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqsPage } from './faqs';
import { SharedModule } from '../../../../shared/shared.module';
import { SampleUtilityBillsPageModule } from '../../../sampleutilitybills/sample-utility-bills.module';

@NgModule({
  declarations: [
    FaqsPage,
  ],
  entryComponents: [
    FaqsPage
  ],
  imports: [
    SharedModule,
    SampleUtilityBillsPageModule,
    IonicPageModule.forChild(FaqsPage),
  ],
})
export class FaqsPageModule {}
