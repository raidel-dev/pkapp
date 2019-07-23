import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../../../shared/shared.module';
import { PreloadedContractPageModule } from '../preloaded-contract/preloaded-contract.module';
import { EntityDetailPage } from './entity-detail';

@NgModule({
  declarations: [
    EntityDetailPage,
  ],
  entryComponents: [
    EntityDetailPage
  ],
  imports: [
    SharedModule,
    PreloadedContractPageModule,
    IonicPageModule.forChild(EntityDetailPage),
  ],
})
export class EntityDetailPageModule {}
