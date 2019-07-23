import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { User } from '../../../shared/models/user/user';
import { LoginPage } from '../../login/login';
import { BillingInfoPage } from './billing-info/billing-info';
import { FaqsPage } from './faqs/faqs';
import { HelpCenterPage } from './help-center/help-center';
import { ProfileChangePassPage } from './profile-change-pass/profile-change-pass';
import { ProfileEditPage } from './profile-edit/profile-edit';
import { SecuritySettingsPage } from './security-settings/security-settings';
import { FeedbackPage } from './feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public user: User;
  public loading = true;
  public profileErrorMessage = '';

  public logoutText = 'Sign Out';
  public logoutEnabled = true;

  constructor(private app: App,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {  
  }

  ionViewDidEnter() {
    this.profileErrorMessage = '';
    this.loadUser();
  }

  private loadUser(): void {
    this.authService.getAuthFields()
      .then(authFields => {
        if (authFields && authFields.userID) {
          this.graphQLService.getProfileData(authFields.userID)
            .then(result => {
              this.user = new User(result.data.user);
              this.loading = false;
            })
            .catch((res: HttpErrorResponse) => {
              if (res && res.status) {
                this.profileErrorMessage = res.statusText;
              } else {
                this.profileErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
              }
              this.loading = false;
            });
        }
      });
  }

  public logout() {
    this.logoutEnabled = false;
    this.logoutText = 'Signing out...';
    this.authService.logout()
      .then(() => {
        this.logoutEnabled = true;
        this.logoutText = 'Sign Out';
        this.app.getRootNavs()[0].setRoot(LoginPage);
      });
  }

  public goEdit() {
    this.navCtrl.push(ProfileEditPage, { user: this.user });
  }

  public goPassChange() {
    this.navCtrl.push(ProfileChangePassPage, { user: this.user });
  }

  public goBillingInfo() {
    this.navCtrl.push(BillingInfoPage, { user: this.user });
  }

  public goSecuritySetting() {
    this.navCtrl.push(SecuritySettingsPage, { user: this.user })
  }

  public goHelpCenter() {
    this.navCtrl.push(HelpCenterPage, { user: this.user });
  }

  public goFaqs() {
    this.navCtrl.push(FaqsPage, { user: this.user });
  }

  public goFeedback() {
    this.navCtrl.push(FeedbackPage, { user: this.user });
  }
}
