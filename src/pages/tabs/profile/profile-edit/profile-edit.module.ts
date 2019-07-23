import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    ProfileEditPage,
  ],
  entryComponents: [
    ProfileEditPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(ProfileEditPage),
  ],
})
export class ProfileEditPageModule {}
