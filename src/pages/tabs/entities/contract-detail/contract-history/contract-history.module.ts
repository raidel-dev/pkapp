import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractHistoryPage } from './contract-history';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    ContractHistoryPage,
  ],
  entryComponents: [
    ContractHistoryPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ContractHistoryPage),
  ],
})
export class ContractHistoryPageModule {}
