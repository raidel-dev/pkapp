import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecuritySettingsPage } from './security-settings';
import { SharedModule } from '../../../../shared/shared.module';
import { AutoRenewModalModule } from '../../../modals/auto-renew/auto-renew-modal.module';
import { ActivateNotificationsModalModule } from '../../../modals/activate-notifications/activate-notifications-modal.module';

@NgModule({
  declarations: [
    SecuritySettingsPage,
  ],
  entryComponents: [
    SecuritySettingsPage
  ],
  imports: [
    SharedModule,
    AutoRenewModalModule,
    ActivateNotificationsModalModule,
    IonicPageModule.forChild(SecuritySettingsPage),
  ],
})
export class SecuritySettingsPageModule {}
