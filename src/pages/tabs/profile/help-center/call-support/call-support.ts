import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../../shared/abstract-page-form';
import { User } from '../../../../../shared/models/user/user';

@IonicPage()
@Component({
  selector: 'page-call-support',
  templateUrl: 'call-support.html',
})
export class CallSupportPage extends AbstractPageForm {

  public body: string;
  public isFocusEmail: boolean
  public isFocusDes: boolean
  public isRequested: boolean = false;
  
  public requestText = 'Request';
  public requestEnabled = true;

  public callRequestError = '';

  public user: User;

  constructor(public navCtrl: NavController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    public navParams: NavParams) {
    super(appStateService);

    this.user = navParams.data.user;
  }

  
  public isFocus(kind) {
    switch (kind) {
      case "input":
        this.isFocusEmail = true
        break;
      case "text":
        this.isFocusDes = true
        break;
    }
  }

  public isBlur(kind) {
    switch (kind) {
      case "input":
        this.isFocusEmail = false
        break;
      case "text":
        this.isFocusDes = false
        break;
    }
  }

  public request() {
    this.callRequestError = '';
    this.requestText = 'Processing...';
    this.requestEnabled = false;
    this.graphQLService.sendSMS(this.body)
      .then(() => {
        this.isRequested = true;
        this.requestText = 'Request';
        this.requestEnabled = false;
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.callRequestError = res.statusText;
        } else {
          this.callRequestError = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.requestText = 'Finish';
        this.requestEnabled = true;
      });
  }
}
