import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractsReviewFeedbackPage } from './contracts-review-feedback';
import { ReviewContractPageModule } from './review-contract/review-contract.module';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    ContractsReviewFeedbackPage,
  ],
  entryComponents: [
    ContractsReviewFeedbackPage
  ],
  imports: [
    SharedModule,
    ReviewContractPageModule,
    IonicPageModule.forChild(ContractsReviewFeedbackPage),
  ],
})
export class ContractsReviewFeedbackPageModule {}
