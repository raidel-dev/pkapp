import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { User } from '../../../../shared/models/user/user';
import { CallSupportPage } from './call-support/call-support';
import { ChatPage } from './chat/chat';
import { EmailSupportPage } from './email-support/email-support';

@IonicPage()
@Component({
  selector: 'page-help-center',
  templateUrl: 'help-center.html',
})
export class HelpCenterPage {

  public user: User;

  constructor(public navCtrl: NavController,
    private appStateService: AppStateServiceProvider,
    public navParams: NavParams) {
    this.user = navParams.data.user;
  }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
  }

  public goEmailSupport() {
    this.navCtrl.push(EmailSupportPage, { user: this.user });
  }

  public goCallCenter() {
    this.navCtrl.push(CallSupportPage, { user: this.user });
  }

  public goChat() {
    this.appStateService.setTabHidden(true);
    this.navCtrl.push(ChatPage);
  }
}
