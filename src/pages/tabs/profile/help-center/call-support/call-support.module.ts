import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallSupportPage } from './call-support';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    CallSupportPage,
  ],
  entryComponents: [
    CallSupportPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(CallSupportPage),
  ],
})
export class CallSupportPageModule {}
