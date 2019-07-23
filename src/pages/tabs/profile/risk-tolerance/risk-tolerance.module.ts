import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiskTolerancePage } from './risk-tolerance';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    RiskTolerancePage,
  ],
  entryComponents: [
    RiskTolerancePage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(RiskTolerancePage),
  ],
})
export class RiskTolerancePageModule {}
