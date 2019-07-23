import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditLocationPage } from './add-edit-location';
import { SharedModule } from '../../../../shared/shared.module';
import { SampleUtilityBillsPageModule } from '../../../sampleutilitybills/sample-utility-bills.module';

@NgModule({
  declarations: [
    AddEditLocationPage,
  ],
  entryComponents: [
    AddEditLocationPage
  ],
  imports: [
    SharedModule,
    SampleUtilityBillsPageModule,
    IonicPageModule.forChild(AddEditLocationPage),
  ],
})
export class AddEditLocationPageModule {}
