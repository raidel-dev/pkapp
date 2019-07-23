import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewContractPage } from './new-contract';
import { SharedModule } from '../../../../shared/shared.module';
import { AddEditLocationPageModule } from '../add-edit-location/add-edit-location.module';
import { AuctionPageModule } from '../../../auction/auction.module';

@NgModule({
  declarations: [
    NewContractPage,
  ],
  entryComponents: [
    NewContractPage
  ],
  imports: [
    SharedModule,
    AddEditLocationPageModule,
    AuctionPageModule,
    IonicPageModule.forChild(NewContractPage),
  ],
})
export class NewContractPageModule {}
