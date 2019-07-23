import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPage } from './forgot';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ForgotPage,
  ],
  entryComponents: [
    ForgotPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ForgotPage),
  ],
})
export class ForgotPageModule {}
