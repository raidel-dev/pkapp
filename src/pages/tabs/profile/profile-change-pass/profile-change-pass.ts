import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Page } from '../../../../shared/models/app-state/page';
import { User } from '../../../../shared/models/user/user';
import { passwordValidator } from '../../../../shared/validators/password-validator';
import { ApolloError } from 'apollo-client';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { TabsPage } from '../../tabs';
import { patternValidator } from '../../../../shared/validators/pattern-validator';

@IonicPage()
@Component({
  selector: 'page-profile-change-pass',
  templateUrl: 'profile-change-pass.html',
})
export class ProfileChangePassPage extends AbstractPageForm {
  public user: User;

  public cpasswordFocused = false;
  public passwordFocused = false;
  public passwordChangeForm: FormGroup;
  public passwordChangeErrorMessage: string;
  public startPasswordChangeValidation = false;
  public submitButtonEnabled = true;
  public submitButtonText = 'Submit';

  public passwordExpired = false;

  public hide = true;
  public cHide = true;
  public nHide = true;

  constructor(public navCtrl: NavController,
    private altCtrl: AlertController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.appStateService.setPage(Page.PasswordChange)
    this.user = navParams.data.user;
    this.passwordExpired = navParams.data.passwordExpired !== undefined ? navParams.data.passwordExpired : false;

    if (this.passwordExpired) {
      this.appStateService.setTabHidden(true);
    }

    this.passwordChangeForm = new FormGroup({
      oldPassword: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        patternValidator(/\d/, { hasNumber: true }),
        patternValidator(/[A-Z]/, { hasUpperCase: true }),
        patternValidator(/[a-z]/, { hasLowerCase: true }),
        patternValidator(/[A-Za-z]/, { hasLetter: true }),
        patternValidator(/(?=.*[^0-9A-Za-z])/, { hasSpecialCharacters: true }),
        patternValidator(/^(?!.*[pP][aA@][sS][sS][wW][oO0][rR][dD])/, { hasPassword: true }),
        Validators.minLength(8)
      ]),
      cpassword: new FormControl('', [Validators.required]),
    }, { validators: passwordValidator });

    if (!this.passwordExpired) {
      this.oldPassword.setValidators([Validators.required])
    } else {
      this.oldPassword.setValidators([]);
    }
  }

  get oldPassword() { return this.passwordChangeForm.get('oldPassword'); }
  get password() { return this.passwordChangeForm.get('password'); }
  get cpassword() { return this.passwordChangeForm.get('cpassword'); }

  public goBack(): void {
    if (!this.passwordExpired) {
      this.navCtrl.pop();
    }
  }

  public submit(): void {
    this.passwordChangeErrorMessage = '';
    this.setTouched(this.passwordChangeForm);
    this.startPasswordChangeValidation = true;
    if (this.passwordChangeForm.valid) {
      this.submitButtonText = 'Submitting...';
      this.submitButtonEnabled = false;
      if (!this.passwordExpired) {
        this.authService.authenticate(this.user.username, this.oldPassword.value)
          .then(isSuccess => {
            if (isSuccess) {
              this.updateUser();
            } else {
              this.passwordChangeErrorMessage = 'The old password is incorrect, please try again.';
            }
          })
          .catch((res: HttpErrorResponse) => {
            if (res && res.status) {
              this.passwordChangeErrorMessage = res.statusText;
            } else {
              this.passwordChangeErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
            }
            this.submitButtonText = 'Submit';
            this.submitButtonEnabled = true;
          });
      } else {
        this.updateUser();
      }
    } else {
      this.submitButtonEnabled = true;
      this.submitButtonText = 'Submit';
    }
  }

  private updateUser(): void {
    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.updateUser(authFields.userID, {
          password: this.password.value,
          confirmpassword: this.cpassword.value
        } as User)
        .then(() => {
          this.graphQLService.reset(Page.Home);
          this.graphQLService.reset(Page.ProfilePage);
          const alert = this.altCtrl.create({
            title: 'Password Change',
            message: 'Your Password has been successfully updated', buttons: [
              {
                text: 'OK',
                handler: () => { }
              }
            ]
          });
          if (this.passwordExpired) {
            alert.onDidDismiss(() => {
              this.appStateService.setTabHidden(false);
              this.navCtrl.setRoot(TabsPage);
            });
          } else {
            alert.onDidDismiss(() => {
              this.navCtrl.pop();
            });
          }
          alert.present();
          this.submitButtonText = 'Submit';
          this.submitButtonEnabled = true;
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.passwordChangeErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.passwordChangeErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.submitButtonText = 'Submit';
          this.submitButtonEnabled = true;
        });
      });
  }
}
