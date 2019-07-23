import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuctionCreateContractPage } from './auction-create-contract';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AuctionCreateContractPage,
  ],
  entryComponents: [
    AuctionCreateContractPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(AuctionCreateContractPage),
  ],
})
export class AuctionCreateContractPageModule {}
