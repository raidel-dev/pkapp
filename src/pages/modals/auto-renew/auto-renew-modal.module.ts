import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AutoRenewModal } from './auto-renew-modal';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AutoRenewModal,
  ],
  entryComponents: [
    AutoRenewModal
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(AutoRenewModal),
  ],
})
export class AutoRenewModalModule {}
