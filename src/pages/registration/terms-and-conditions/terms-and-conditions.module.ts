import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsAndConditionsPage } from './terms-and-conditions';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    TermsAndConditionsPage,
  ],
  entryComponents: [
    TermsAndConditionsPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(TermsAndConditionsPage),
  ],
})
export class TermsAndConditionsPageModule {}
