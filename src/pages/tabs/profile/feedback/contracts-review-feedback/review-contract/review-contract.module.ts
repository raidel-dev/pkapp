import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewContractPage } from './review-contract';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  declarations: [
    ReviewContractPage,
  ],
  entryComponents: [
    ReviewContractPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ReviewContractPage),
  ],
})
export class ReviewContractPageModule {}
