import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpCenterPage } from './help-center';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailSupportPageModule } from './email-support/email-support.module';
import { CallSupportPageModule } from './call-support/call-support.module';
import { ChatPageModule } from './chat/chat.module';
import { PkSupportIssuePageModule } from './pk-support-issue/pk-support-issue.module';

@NgModule({
  declarations: [
    HelpCenterPage
  ],
  entryComponents: [
    HelpCenterPage
  ],
  imports: [
    EmailSupportPageModule,
    CallSupportPageModule,
    ChatPageModule,
    SharedModule,
    PkSupportIssuePageModule,
    IonicPageModule.forChild(HelpCenterPage),
  ],
})
export class HelpCenterPageModule {}
