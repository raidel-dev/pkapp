import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuctionExtendPage } from './auction-extend';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    AuctionExtendPage,
  ],
  entryComponents: [
    AuctionExtendPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(AuctionExtendPage),
  ],
})
export class AuctionExtendPageModule {}
