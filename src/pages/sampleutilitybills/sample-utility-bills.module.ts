import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleUtilityBillsPage } from './sample-utility-bills';
import { SharedModule } from '../../shared/shared.module';
import { SampleBillPageModule } from './sample-bill/sample-bill.module';

@NgModule({
  declarations: [
    SampleUtilityBillsPage,
  ],
  entryComponents: [
    SampleUtilityBillsPage
  ],
  imports: [
    SharedModule,
    SampleBillPageModule,
    IonicPageModule.forChild(SampleUtilityBillsPage),
  ],
})
export class SampleUtilityBillsPageModule {}
