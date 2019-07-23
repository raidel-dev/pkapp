import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../../shared/shared.module';
import { AuctionExtendPageModule } from './auction-extend/auction-extend.module';
import { AuctionInProgressPage } from './auction-in-progress';
import {
  AuctionAwardPageModule,
} from './auction-award/auction-award.module';

@NgModule({
  declarations: [
    AuctionInProgressPage,
  ],
  entryComponents: [
    AuctionInProgressPage
  ],
  imports: [
    SharedModule,
    AuctionExtendPageModule,
    AuctionAwardPageModule,
    IonicPageModule.forChild(AuctionInProgressPage),
  ],
})
export class AuctionInProgressPageModule {}
