import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractTermsPage } from './contract-terms';
import { SharedModule } from '../../../../../shared/shared.module';
import { ContractTermsModalModule } from '../../../../modals/contract-terms/contract-terms-modal.module';

@NgModule({
  declarations: [
    ContractTermsPage,
  ],
  entryComponents: [
    ContractTermsPage
  ],
  imports: [
    SharedModule,
    ContractTermsModalModule,
    IonicPageModule.forChild(ContractTermsPage),
  ],
})
export class ContractTermsPageModule {}
