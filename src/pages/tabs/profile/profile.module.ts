import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../../shared/shared.module';
import { ProfilePage } from './profile';
import { HelpCenterPageModule } from './help-center/help-center.module';
import { BillingInfoPageModule } from './billing-info/billing-info.module';
import { ProfileChangePassPageModule } from './profile-change-pass/profile-change-pass.module';
import { ProfileEditPageModule } from './profile-edit/profile-edit.module';
import { SecuritySettingsPageModule } from './security-settings/security-settings.module';
import { TrainingVideosPageModule } from './training-videos/training-videos.module';
import { FaqsPageModule } from './faqs/faqs.module';
import { FeedbackPageModule } from './feedback/feedback.module';
import { RiskTolerancePageModule } from './risk-tolerance/risk-tolerance.module';

@NgModule({
  declarations: [
    ProfilePage
  ],
  entryComponents: [
    ProfilePage
  ],
  imports: [
    SharedModule,
    HelpCenterPageModule,
    BillingInfoPageModule,
    ProfileChangePassPageModule,
    ProfileEditPageModule,
    SecuritySettingsPageModule,
    TrainingVideosPageModule,
    FaqsPageModule,
    FeedbackPageModule,
    RiskTolerancePageModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
