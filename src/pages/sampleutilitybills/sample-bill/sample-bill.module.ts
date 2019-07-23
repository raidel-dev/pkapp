import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../../shared/shared.module';
import { SampleBillPage } from './sample-bill';

@NgModule({
  declarations: [
    SampleBillPage,
  ],
  entryComponents: [
    SampleBillPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(SampleBillPage),
  ],
})
export class SampleBillPageModule {}
