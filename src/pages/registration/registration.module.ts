import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { QuestionsPageModule } from './questions/questions.module';
import { RegistrationPage } from './registration';
import { TermsAndConditionsPageModule } from './terms-and-conditions/terms-and-conditions.module';
import { AutoRenewModalModule } from '../modals/auto-renew/auto-renew-modal.module';
import { ActivateNotificationsModalModule } from '../modals/activate-notifications/activate-notifications-modal.module';

@NgModule({
  declarations: [
    RegistrationPage
  ],
  entryComponents: [
    RegistrationPage
  ],
  imports: [
    SharedModule,
    TermsAndConditionsPageModule,
    QuestionsPageModule,
    AutoRenewModalModule,
    ActivateNotificationsModalModule,
    IonicPageModule.forChild(RegistrationPage),
  ],
})
export class RegistrationPageModule {}
