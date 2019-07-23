import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractDetailPage } from './contract-detail';
import { SharedModule } from '../../../../shared/shared.module';
import { AddEditLocationPageModule } from '../add-edit-location/add-edit-location.module';
import { ContractHistoryPageModule } from './contract-history/contract-history.module';

@NgModule({
  declarations: [
    ContractDetailPage
  ],
  entryComponents: [
    ContractDetailPage,
  ],
  imports: [
    SharedModule,
    AddEditLocationPageModule,
    ContractHistoryPageModule,
    IonicPageModule.forChild(ContractDetailPage)
  ],
})
export class ContractDetailPageModule {}
