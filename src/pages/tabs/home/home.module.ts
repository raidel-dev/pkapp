import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { SharedModule } from '../../../shared/shared.module';
import { EntitiesPageModule } from '../entities/entities.module';
import { ProfilePageModule } from '../profile/profile.module';
import { BillingPageModule } from '../billing/billing.module';
import { AuctionCreateContractPageModule } from '../../auction/auction-create-contract/auction-create-contract.module';
import { AuctionInProgressPageModule } from '../../auction/auction-in-progress/auction-in-progress.module';
import { ContractsReviewFeedbackPageModule } from '../profile/feedback/contracts-review-feedback/contracts-review-feedback.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  entryComponents: [
    HomePage
  ],
  imports: [
    SharedModule,
    EntitiesPageModule,
    ProfilePageModule,
    BillingPageModule,
    AuctionCreateContractPageModule,
    AuctionInProgressPageModule,
    ContractsReviewFeedbackPageModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
