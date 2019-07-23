import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../../../shared/shared.module';
import { TermsAndConditionsPageModule } from '../../../registration/terms-and-conditions/terms-and-conditions.module';
import { AuctionCreateContractPageModule } from '../../auction-create-contract/auction-create-contract.module';
import { AuctionAwardPage } from './auction-award';
import { ContractTermsPageModule } from './contract-terms/contract-terms.module';

@NgModule({
  declarations: [
    AuctionAwardPage,
  ],
  entryComponents: [
    AuctionAwardPage
  ],
  imports: [
    SharedModule,
    TermsAndConditionsPageModule,
    AuctionCreateContractPageModule,
    ContractTermsPageModule,
    IonicPageModule.forChild(AuctionAwardPage),
  ],
})
export class AuctionAwardPageModule {}
