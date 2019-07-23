import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AlertController, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Page } from '../../../../shared/models/app-state/page';
import { User } from '../../../../shared/models/user/user';
import { RiskTolerancePage } from '../risk-tolerance/risk-tolerance';
import { AutoRenewModal } from '../../../modals/auto-renew/auto-renew-modal';
import { ActivateNotificationsModal } from '../../../modals/activate-notifications/activate-notifications-modal';

@IonicPage()
@Component({
  selector: 'page-security-settings',
  templateUrl: 'security-settings.html',
})
export class SecuritySettingsPage extends AbstractPageForm {
  public user: User;
  public saveButtonText = 'Save';
  public saveButtonEnabled = true;

  public securitySettingsForm: FormGroup;
  public startSecuritySettingsValidation = false;
  public securitySettingsErrorMessage: string;

  constructor(public navCtrl: NavController,
    private altCtrl: AlertController,
    private modalCtrl: ModalController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    public storage: Storage,
    public navParams: NavParams) {
    super(appStateService);
    this.user = navParams.data.user;

    this.securitySettingsForm = new FormGroup({
      initials: new FormControl(this.user.initials, [Validators.required, Validators.maxLength(5)]),
      signature: new FormControl(this.user.signature, [Validators.required]),
      autoRenewContracts: new FormControl(this.user.autoRenewContracts, [Validators.required]),
      activateNotifications: new FormControl(this.user.subscribeToMobileNotifications, [Validators.required])
    });
  }

  get initials() { return this.securitySettingsForm.get('initials'); }
  get signature() { return this.securitySettingsForm.get('signature'); }
  get isTosAccepted() { return this.securitySettingsForm.get('isTosAccepted'); }
  get autoRenewContracts() { return this.securitySettingsForm.get('autoRenewContracts'); }
  get activateNotifications() { return this.securitySettingsForm.get('activateNotifications'); }

  public goRisk() {
    this.navCtrl.push(RiskTolerancePage);
  }

  public save() {
    this.startSecuritySettingsValidation = true;
    this.securitySettingsErrorMessage = '';
    this.setTouched(this.securitySettingsForm);
    this.saveButtonEnabled = false;
    this.saveButtonText = 'Saving...';
    if (this.securitySettingsForm.valid) {
      const userDTO = this.getUserDTO();

      this.graphQLService.updateUser(this.user.userID, userDTO)
        .then(() => {
          this.graphQLService.reset(Page.ProfilePage);
          const alert = this.altCtrl.create({
            title: 'Email Support',
            message: 'Your changes have been saved', buttons: [
              {
                text: 'Got it',
                handler: () => { }
              }
            ]
          });
          alert.onDidDismiss(() => this.navCtrl.pop());
          alert.present();
          this.saveButtonText = 'Save';
          this.saveButtonEnabled = true;
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.securitySettingsErrorMessage = res.statusText;
          } else {
            this.securitySettingsErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.saveButtonText = 'Save';
          this.saveButtonEnabled = true;
        });
    } else {
      this.saveButtonEnabled = true;
      this.saveButtonText = 'Save';
    }
  }

  private getUserDTO(): User {
    const user = new User();
    user.initials = this.initials.value.trim();
    user.autoRenewContracts = this.autoRenewContracts.value;
    user.subscribeToMobileNotifications = this.activateNotifications.value;
    user.signature = this.signature.value;

    return user;
  }

  public showAutoRenewModal(): void {
    var modal = this.modalCtrl.create(AutoRenewModal);
    modal.present();
  }

  public showActivateNotificationsModal(): void {
    var modal = this.modalCtrl.create(ActivateNotificationsModal);
    modal.present();
  }
}
