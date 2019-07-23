import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActivateNotificationsModal } from './activate-notifications-modal';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ActivateNotificationsModal,
  ],
  entryComponents: [
    ActivateNotificationsModal
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ActivateNotificationsModal),
  ],
})
export class ActivateNotificationsModalModule {}
