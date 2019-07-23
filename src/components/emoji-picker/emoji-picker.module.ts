import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmojiPickerComponent } from './emoji-picker';

@NgModule({
  declarations: [
    EmojiPickerComponent,
  ],
  exports: [
    EmojiPickerComponent
  ],
  imports: [
    IonicPageModule.forChild(EmojiPickerComponent),
  ]
})
export class EmojiPickerComponentModule {
}
