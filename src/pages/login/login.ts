import { Component, ViewChild } from '@angular/core';
import { ApolloError } from 'apollo-client';
import { IonicPage, NavController, NavParams, Platform, Content } from 'ionic-angular';

import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../providers/auth/auth-service';
import { HelperServiceProvider } from '../../providers/helper/helper-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { Page } from '../../shared/models/app-state/page';
import { ForgotPage } from '../forgot/forgot';
import { RegistrationPage } from '../registration/registration';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { Constants } from '../../shared/constants';
import { User } from '../../shared/models/user/user';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { ProfileChangePassPage } from '../tabs/profile/profile-change-pass/profile-change-pass';

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends AbstractPageForm {
  user = { } as User;

  public signInText = 'Sign In';
  public signInDisabled = false;
  public rememberMe: boolean = false;
  public isFocusEmail: boolean = false;
  public isFocusPass: boolean = false;

  public hide = true;

  public errorMessage: string;

  @ViewChild(Content) content: Content;
  public keyboardHeight: number;

  constructor(public appStateService: AppStateServiceProvider,
    private storage: Storage,
    private graphQLService: GraphqlServiceProvider,
    private authProvider: AuthServiceProvider,
    public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
    super(appStateService);
    this.appStateService.setPage(Page.Login);
    this.storage.get(Constants.storageKeys.rememberedUsername)
      .then(res => {
        if (res) {
          this.rememberMe = true;
          this.user.email = res;
        }
      });
  }

  public forgot() {
    this.errorMessage = '';
    this.navCtrl.push(ForgotPage);
  }

  public signIn() {
    this.errorMessage = '';
    this.signInText = 'Signing in...';
    this.signInDisabled = true;
    if (this.user && this.user.email && this.user.password) {
      this.graphQLService.resetAll();
      this.authProvider.authenticate(this.user.email.trim().replace(/[\W_]+/g,"").toLowerCase(), this.user.password.trim())
        .then(isSuccess => {
          if (isSuccess) {
            if (this.rememberMe) {
              this.storage.set(Constants.storageKeys.rememberedUsername, this.user.email);
            } else {
              this.storage.remove(Constants.storageKeys.rememberedUsername);
            }
            this.graphQLService.resetAll();
            this.authProvider.getAuthFields()
              .then(authFields => {
                this.graphQLService.getUser(authFields.userID)
                  .then(userResult => {
                    if (userResult && userResult.data.user.isPasswordExpired) {
                      this.navCtrl.push(ProfileChangePassPage, { user: this.user, passwordExpired: true });
                    } else {
                      this.navCtrl.setRoot(TabsPage);
                    }
                  });
              });
          } else {
            this.errorMessage = 'Your email or password is incorrect.';
            this.signInDisabled = false;
            this.signInText = 'Sign In';
          }
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.errorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.errorMessage = 'There was a problem authenticating.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.signInDisabled = false;
          this.signInText = 'Sign In';
        });
    } else {
      this.errorMessage = 'Please enter a username and password to login.';
      this.signInDisabled = false;
      this.signInText = 'Sign In';
    }
  }

  public createAccount() {
    this.errorMessage = '';
    this.navCtrl.push(RegistrationPage);
  }

  public isFocus(kind: string) {
    switch (kind) {
      case "email":
        this.isFocusEmail = true;
        break;
      case "pass":
        this.isFocusPass = true;
        break;
      default:
        break;
    }
  }
  
  public isBlur(kind: string) {
    switch (kind) {
      case "email":
        this.isFocusEmail = false;
        break;
      case "pass":
        this.isFocusPass = false;
        break;
      default:
        break;
    }
  }
}
