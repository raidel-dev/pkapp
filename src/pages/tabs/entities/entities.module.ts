import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../../shared/shared.module';
import { ContractDetailPageModule } from './contract-detail/contract-detail.module';
import { EntitiesPage } from './entities';
import { EntityDetailPageModule } from './entity-detail/entity-detail.module';
import { NewContractPageModule } from './new-contract/new-contract.module';
import { NewEntityPageModule } from './new-entity/new-entity.module';
import { PreloadedContractPageModule } from './preloaded-contract/preloaded-contract.module';

@NgModule({
  declarations: [
    EntitiesPage,
  ],
  entryComponents: [
    EntitiesPage
  ],
  imports: [
    EntityDetailPageModule,
    ContractDetailPageModule,
    NewEntityPageModule,
    NewContractPageModule,
    PreloadedContractPageModule,
    SharedModule,
    IonicPageModule.forChild(EntitiesPage),
  ]
})
export class EntitiesPageModule {}
