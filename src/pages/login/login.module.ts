import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { SharedModule } from '../../shared/shared.module';
import { RegistrationPageModule } from '../registration/registration.module';
import { ForgotPageModule } from '../forgot/forgot.module';
import { ProfileChangePassPageModule } from '../tabs/profile/profile-change-pass/profile-change-pass.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  entryComponents: [
    LoginPage
  ],
  imports: [
    SharedModule,
    ForgotPageModule,
    RegistrationPageModule,
    ProfileChangePassPageModule,
    IonicPageModule.forChild(LoginPage)
  ],
})
export class LoginPageModule {}
