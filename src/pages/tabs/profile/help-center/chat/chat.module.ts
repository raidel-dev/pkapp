import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    ChatPage,
  ],
  entryComponents: [
    ChatPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ChatPage),
  ],
})
export class ChatPageModule {}
