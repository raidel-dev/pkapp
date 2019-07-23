import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailSupportPage } from './email-support';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    EmailSupportPage,
  ],
  entryComponents: [
    EmailSupportPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(EmailSupportPage),
  ],
})
export class EmailSupportPageModule {}
