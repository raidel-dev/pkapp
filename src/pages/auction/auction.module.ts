import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuctionPage } from './auction';
import { SharedModule } from '../../shared/shared.module';
import { AuctionInProgressPageModule } from './auction-in-progress/auction-in-progress.module';
import { RiskTolerancePageModule } from '../tabs/profile/risk-tolerance/risk-tolerance.module';

@NgModule({
  declarations: [
    AuctionPage,
  ],
  entryComponents: [
    AuctionPage
  ],
  imports: [
    SharedModule,
    AuctionInProgressPageModule,
    RiskTolerancePageModule,
    IonicPageModule.forChild(AuctionPage),
  ],
})
export class AuctionPageModule {}
