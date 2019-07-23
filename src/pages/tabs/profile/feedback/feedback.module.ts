import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';
import { AppFeedbackPageModule } from './app-feedback/app-feedback.module';
import { ContractsReviewFeedbackPageModule } from './contracts-review-feedback/contracts-review-feedback.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  entryComponents: [
    FeedbackPage
  ],
  imports: [
    SharedModule,
    AppFeedbackPageModule,
    ContractsReviewFeedbackPageModule,
    IonicPageModule.forChild(FeedbackPage),
  ],
})
export class FeedbackPageModule {}
