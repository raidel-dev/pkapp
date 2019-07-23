import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreloadedContractPage } from './preloaded-contract';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    PreloadedContractPage,
  ],
  entryComponents: [
    PreloadedContractPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(PreloadedContractPage),
  ],
})
export class PreloadedContractPageModule {}
