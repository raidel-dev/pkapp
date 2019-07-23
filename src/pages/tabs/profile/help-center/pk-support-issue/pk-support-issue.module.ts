import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PkSupportIssuePage } from './pk-support-issue';
import { EmojiPickerComponentModule } from '../../../../../components/emoji-picker/emoji-picker.module';

@NgModule({
  declarations: [
    PkSupportIssuePage,
  ],
  entryComponents: [
    PkSupportIssuePage
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(PkSupportIssuePage),
  ],
})
export class PkSupportIssuePageModule {}
