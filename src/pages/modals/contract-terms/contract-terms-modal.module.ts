import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ContractTermsModal } from './contract-terms-modal';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ContractTermsModal,
  ],
  entryComponents: [
    ContractTermsModal
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ContractTermsModal),
  ],
})
export class ContractTermsModalModule {}
