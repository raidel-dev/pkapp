import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppFeedbackPage } from './app-feedback';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    AppFeedbackPage,
  ],
  entryComponents: [
    AppFeedbackPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(AppFeedbackPage),
  ],
})
export class AppFeedbackPageModule {}
