import { Component } from '@angular/core';
import { ApolloError } from 'apollo-client';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../providers/helper/helper-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { User } from '../../shared/models/user/user';

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage extends AbstractPageForm {

  public isFocusEmail: boolean;
  public user: User = new User();

  public errorMessage: string;

  public submitText = 'Submit';
  public submitEnabled = true;

  constructor(public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private altCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    super(appStateService);
  }

  public submit() {
    this.errorMessage = '';
    this.submitText = 'Submitting...';
    this.submitEnabled = false;
    this.graphQLService.forgotPassword(this.user.email.trim().replace(/[\W_]+/g,"").toLowerCase(), this.user.email.trim().toLowerCase())
      .then(() => {
        const alert = this.altCtrl.create({
          title: 'Forgot Password',
          message: `A temporary password has been sent to ${this.user.email}`, buttons: [
            {
              text: 'OK',
              handler: () => { }
            }
          ]
        });
        alert.onDidDismiss(() => this.navCtrl.pop());
        alert.present();
        this.submitText = 'Submit';
        this.submitEnabled = true;
      })
      .catch((res: ApolloError) => {
        if (res && res.graphQLErrors && res.graphQLErrors.length) {
          this.errorMessage = res.graphQLErrors[0].message.indexOf('User') !== -1
            ? 'We do not recognize that email. Please try submitting with an alternative email. If you don’t remember which email you used to register contact customer support at support@octipower.com.'
            : HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          this.graphQLService.sendErrorReport(res.graphQLErrors[0].message, res);
        } else {
          this.errorMessage = 'There was a problem sending the recovery email to your email address, please try again later or contact customer support at support@octipower.com.'
          this.graphQLService.sendErrorReport(res.message, res);
        }
        this.submitText = 'Submit';
        this.submitEnabled = true;
      });
  }

  public isFocus() {
    this.isFocusEmail = true
  }

  public isBlur() {
    this.isFocusEmail = false
  }
}
