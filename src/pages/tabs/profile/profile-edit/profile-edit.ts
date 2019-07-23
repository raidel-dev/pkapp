import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { User } from '../../../../shared/models/user/user';
import { Constants } from '../../../../shared/constants';
import { Page } from '../../../../shared/models/app-state/page';
import { ZipCode } from '../../../../shared/models/zip-code/zip-code';
import { ApolloError } from 'apollo-client';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage extends AbstractPageForm {

  public user: User;
  public saveButtonText = 'Submit';
  public saveButtonEnabled = true;
  public profileEditErrorMessage: string;
  public startProfileEditFormValidation: boolean;
  public citiesInZipCode: string[];
  public zipCodeLoading = false;
  public zipCodeErrorMessage = '';

  public profileEditForm: FormGroup;

  public Constants = Constants;

  constructor(public navCtrl: NavController,
    private altCtrl: AlertController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.user = navParams.data.user;

    this.profileEditForm = new FormGroup({
      firstName: new FormControl(this.user.fname, [Validators.required]),
      lastName: new FormControl(this.user.lname, [Validators.required]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(Constants.validators.email)
      ]),
      phone: new FormControl(this.user.phone, [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ]),
      phone2: new FormControl(this.user.phone2, [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ]),
      address1: new FormControl(this.user.billingAddress1 ? this.user.billingAddress1 : '', [Validators.required]),
      address2: new FormControl(this.user.billingAddress2 ? this.user.billingAddress2 : ''),
      city: new FormControl(this.user.billingCity ? this.user.billingCity : '', [Validators.required]),
      stateID: new FormControl(this.user.billingStateID ? this.user.billingStateID : '', [Validators.required]),
      stateShort: new FormControl({ value: '', disabled: true }, [Validators.required]),
      zipCode: new FormControl(this.user.billingZipCode ? this.user.billingZipCode : '', [Validators.required]),
      title: new FormControl(this.user.title ? this.user.title : ''),
      DBAName: new FormControl(this.user.DBAName ? this.user.DBAName : '', [Validators.required])
    });

    this.getZipCode(true);
  }

  get firstName() { return this.profileEditForm.get('firstName'); }
  get lastName() { return this.profileEditForm.get('lastName'); }
  get title() { return this.profileEditForm.get('title'); }
  get DBAName() { return this.profileEditForm.get('DBAName'); }
  get email() { return this.profileEditForm.get('email'); }
  get phone() { return this.profileEditForm.get('phone'); }
  get phone2() { return this.profileEditForm.get('phone2'); }
  get address1() { return this.profileEditForm.get('address1'); }
  get address2() { return this.profileEditForm.get('address2'); }
  get city() { return this.profileEditForm.get('city'); }
  get stateID() { return this.profileEditForm.get('stateID'); }
  get stateShort() { return this.profileEditForm.get('stateShort'); }
  get zipCode() { return this.profileEditForm.get('zipCode'); }

  public resetLoadedValues(isFromLoading: boolean): void {
    this.citiesInZipCode = null;
    if (!isFromLoading) {
      this.stateID.setValue(null);
      this.stateShort.setValue(null);
    }
  }

  public getZipCode(isFromLoading: boolean): void {
    if (this.zipCode.value.length === 5) {
      this.zipCode.disable();
      this.resetLoadedValues(isFromLoading);
      this.zipCodeLoading = true;
      this.zipCodeErrorMessage = '';
      this.graphQLService.getZipCode(this.zipCode.value)
        .then(zipCodeResult => {
          const zipCode = new ZipCode(zipCodeResult.data.zipCode);
          this.citiesInZipCode = zipCode.city;
          this.stateID.setValue(zipCode.stateID);
          this.stateShort.setValue(zipCode.stateShort);

          if (isFromLoading) {
            this.city.setValue(this.citiesInZipCode.find(c => c === this.city.value));
          } else {
            if (this.citiesInZipCode.length) {
              this.city.setValue(this.citiesInZipCode[0]);
            } else {
              this.zipCodeErrorMessage = 'Invalid billing zipcode, unable to find any cities, please contact PK support.'
            }
          }

          this.zipCodeLoading = false;
          this.zipCode.enable();
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.zipCodeErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.zipCodeErrorMessage = 'There was a problem processing the zip code.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.zipCodeLoading = false;
          this.zipCode.enable();
        });
    }
  }

  public save() {
    this.startProfileEditFormValidation = true;
    this.profileEditErrorMessage = '';
    this.setTouched(this.profileEditForm);
    this.saveButtonText = 'Saving...';
    this.saveButtonEnabled = false;
    if (this.profileEditForm.valid) {
      this.graphQLService.updateUser(this.user.userID, {
        fname: this.firstName.value.trim(),
        lname: this.lastName.value.trim(),
        title: this.title.value.trim(),
        DBAName: this.DBAName.value.trim(),
        email: this.email.value.trim(),
        phone: this.phone.value.trim(),
        phone2: this.phone2.value.trim(),
        username: this.email.value.trim().replace(/[\W_]+/g,""),
        billingAddress1: this.address1.value.trim(),
        billingAddress2: this.address2.value.trim(),
        billingCity: this.city.value.trim(),
        billingStateID: this.stateID.value.trim(),
        billingZipCode: this.zipCode.value
      } as User).then(() => {
        const alert = this.altCtrl.create({
          title: 'Edit Profile',
          message: 'Your Profile has been successfully updated', buttons: [
            {
              text: 'OK',
              handler: () => { }
            }
          ]
        });
        alert.onDidDismiss(() => {
          this.graphQLService.reset(Page.ProfilePage);
          this.navCtrl.pop();
        });
        alert.present();
        this.saveButtonText = 'Save';
        this.saveButtonEnabled = true;
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.profileEditErrorMessage = res.statusText;
        } else {
          this.profileEditErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.saveButtonText = 'Save';
        this.saveButtonEnabled = true;
      });
    } else {
      this.saveButtonText = 'Save';
      this.saveButtonEnabled = true;
    }
  }
}
