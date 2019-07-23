import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileChangePassPage } from './profile-change-pass';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    ProfileChangePassPage,
  ],
  entryComponents: [
    ProfileChangePassPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ProfileChangePassPage),
  ],
})
export class ProfileChangePassPageModule {}
