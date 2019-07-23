import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ApolloError } from 'apollo-client';
import { Content, IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../providers/helper/helper-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { Constants } from '../../shared/constants';
import { Page } from '../../shared/models/app-state/page';
import { QuestionAnswer } from '../../shared/models/question-answer/question-answer';
import { State } from '../../shared/models/state/state';
import { User } from '../../shared/models/user/user';
import { ZipCode } from '../../shared/models/zip-code/zip-code';
import { passwordValidator } from '../../shared/validators/password-validator';
import { TabsPage } from '../tabs/tabs';
import { TermsAndConditionsPage } from './terms-and-conditions/terms-and-conditions';
import { patternValidator } from '../../shared/validators/pattern-validator';
import { AutoRenewModal } from '../modals/auto-renew/auto-renew-modal';
import { ActivateNotificationsModal } from '../modals/activate-notifications/activate-notifications-modal';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage extends AbstractPageForm {
  public loading = true;
  public zipCodeLoading = false;
  public finishText = 'Finish';
  public finishEnabled = true;
	public passwordFocused = false;
	public cpasswordFocused = false;

  public Constants = Constants;

  public step1RegistrationForm: FormGroup;
  public step2RegistrationForm: FormGroup;

  public states: State[];
  public citiesInZipCode: string[];

  public stepIndex = 1;
  public step1ErrorMessage: string;
  public step2ErrorMessage: string;
  public registrationErrorMessage = '';

  public startStep1Validation = false;
  public startStep2Validation = false;

  public hide = true;
  public cHide = true;

  @ViewChild(Content) content: Content;

  public scrollToTop() {
    this.content.scrollToTop();
  }

  constructor(public appStateService: AppStateServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public plt: Platform,
    private storage: Storage,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider) {
    super(appStateService);
    this.appStateService.setPage(Page.Registration);

    this.graphQLService.getRegistrationData()
      .then(result => {
        this.states = result.data.states.data.map(s => new State(s));
        this.loading = result.loading;
      })
      .catch((res: ApolloError) => {
        if (res && res.graphQLErrors && res.graphQLErrors.length) {
          this.registrationErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
        } else {
          this.registrationErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.loading = false;
      });

    this.step1RegistrationForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      title: new FormControl(''),
      DBAName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(Constants.validators.email)
      ]),
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
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      stateID: new FormControl('', [Validators.required]),
      stateShort: new FormControl({ value: '', disabled: true }, [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ]),
      phone2: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ])
    }, { validators: passwordValidator });

    this.step2RegistrationForm = new FormGroup({
      initials: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      signature: new FormControl('', [Validators.required]),
      autoRenewContracts: new FormControl(true, [Validators.required]),
      activateNotifications: new FormControl(true, [Validators.required]),
      isTosAccepted: new FormControl(false, [Validators.requiredTrue]),
      questionAnswers: new FormControl([])
    });
  }

  get firstName() { return this.step1RegistrationForm.get('firstName'); }
  get lastName() { return this.step1RegistrationForm.get('lastName'); }
  get email() { return this.step1RegistrationForm.get('email'); }
  get title() { return this.step1RegistrationForm.get('title'); }
  get DBAName() { return this.step1RegistrationForm.get('DBAName'); }
  get phone() { return this.step1RegistrationForm.get('phone'); }
  get phone2() { return this.step1RegistrationForm.get('phone2'); }
  get password() { return this.step1RegistrationForm.get('password'); }
  get cpassword() { return this.step1RegistrationForm.get('cpassword'); }
  get address1() { return this.step1RegistrationForm.get('address1'); }
  get address2() { return this.step1RegistrationForm.get('address2'); }
  get city() { return this.step1RegistrationForm.get('city'); }
  get stateID() { return this.step1RegistrationForm.get('stateID'); }
  get stateShort() { return this.step1RegistrationForm.get('stateShort'); }
  get zipCode() { return this.step1RegistrationForm.get('zipCode'); }

  get signature() { return this.step2RegistrationForm.get('signature'); }
  get initials() { return this.step2RegistrationForm.get('initials'); }
  get isTosAccepted() { return this.step2RegistrationForm.get('isTosAccepted'); }
  get autoRenewContracts() { return this.step2RegistrationForm.get('autoRenewContracts'); }
  get activateNotifications() { return this.step2RegistrationForm.get('activateNotifications'); }
  get questionAnswers() { return this.step2RegistrationForm.get('questionAnswers'); }

  ionViewDidEnter() {
    this.resetErrors();
    if (this.stepIndex == 2) {
      this.storage.get(Constants.storageKeys.isTosAccepted)
        .then(res => {
          if (res) {
            this.isTosAccepted.setValue(<boolean>res);
            this.storage.remove(Constants.storageKeys.isTosAccepted);
          }
        });

      this.storage.get(Constants.storageKeys.questionAnswers)
        .then(res => {
          if (res) {
            this.questionAnswers.setValue(res.map(r => new QuestionAnswer(r)));
          }
        });
    } else {
      this.storage.remove(Constants.storageKeys.questionAnswers);
      this.storage.remove(Constants.storageKeys.isTosAccepted);
    }
  }

  public resetLoadedValues(): void {
    this.citiesInZipCode = null;
    this.stateID.setValue(null);
    this.stateShort.setValue(null);
  }

  public getZipCode(): void {
    if (this.zipCode.value.length === 5) {
      this.zipCode.disable();
      this.resetLoadedValues();
      this.zipCodeLoading = true;
      this.graphQLService.getZipCode(this.zipCode.value)
        .then(zipCodeResponse => {
          if (zipCodeResponse && !zipCodeResponse.errors) {
            const zipCode = new ZipCode(zipCodeResponse.data.zipCode);
            this.citiesInZipCode = zipCode.city;
            this.stateID.setValue(zipCode.stateID);
            this.stateShort.setValue(zipCode.stateShort);

            if (this.citiesInZipCode.length === 1) {
              this.city.setValue(this.citiesInZipCode[0]);
            }

          } else {
            this.step1ErrorMessage = 'Invalid zipcode, if you believe this to be an error, please contact PK support';
          }
          this.zipCodeLoading = false;
          this.zipCode.enable();
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.step1ErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.step1ErrorMessage = 'There was a problem processing the zip code.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.zipCodeLoading = false;
          this.zipCode.enable();
        });
    }
  }

  public next() {
    this.resetErrors();

    if (this.stepIndex === 1) {
      this.setTouched(this.step1RegistrationForm);
      this.startStep1Validation = true;
      if (this.step1RegistrationForm.valid) {
        this.stepIndex++;
        this.scrollToTop();
      }
    }
  }

  public previous() {
    this.resetErrors();

    if (--this.stepIndex < 1) {
      this.stepIndex = 1;
    }

    this.scrollToTop();
  }

  public goTerms() {
    this.navCtrl.push(TermsAndConditionsPage);
  }

  public finish() {
    this.resetErrors();
    this.setTouched(this.step2RegistrationForm);
    this.startStep2Validation = true;
    if (this.step2RegistrationForm.valid) {
      const userDto = this.getUserDTO();
      this.finishText = 'Registering...';
      this.finishEnabled = false;
      this.authService.resetAuthFields();
      this.graphQLService.createStripeCustomer(userDto.email, userDto.fname + ' ' + userDto.lname)
        .then(stripeCustomerResponse => {
          userDto.stripeCustomerID = stripeCustomerResponse.data.createStripeCustomer.id;
          this.graphQLService.createUser(userDto)
            .then(userResponse => {
              if (userResponse) {
                this.authService.authenticate(userDto.username, userDto.password)
                  .then(() => {
                    this.navCtrl.setRoot(TabsPage);
                  });
              } else {
                this.step2ErrorMessage = <any>userResponse;
                this.finishText = 'Finish';
                this.finishEnabled = true;
              }
            })
            .catch((res: ApolloError) => {
              if (res && res.graphQLErrors && res.graphQLErrors.length) {
                this.step2ErrorMessage = res.graphQLErrors[0].message.indexOf('Username') !== -1
                  ? 'That email is already taken, please sign up with another email.'
                  : HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
                this.graphQLService.sendErrorReport(res.graphQLErrors[0].message, res);
              } else {
                this.step2ErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
                this.graphQLService.sendErrorReport(res.message, res);
              }
              this.finishText = 'Finish';
              this.finishEnabled = true;
            });
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.step2ErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
            this.graphQLService.sendErrorReport(res.graphQLErrors[0].message, res);
          } else {
            this.step2ErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
            this.graphQLService.sendErrorReport(res.message, res);
          }
          this.finishText = 'Finish';
          this.finishEnabled = true;
        });
    }
  }

  private resetErrors(): void {
    this.step1ErrorMessage = '';
    this.step2ErrorMessage = '';
  }

  private getUserDTO(): User {
    const user = new User();
    user.username = this.email.value.trim().replace(/[\W_]+/g,"").toLowerCase();
    user.fname = this.firstName.value.trim();
    user.lname = this.lastName.value.trim();
    user.title = this.title.value.trim();
    user.DBAName = this.DBAName.value.trim();
    user.billingAddress1 = this.address1.value.trim();
    user.billingAddress2 = this.address2.value.trim();
    user.billingCity = this.city.value.trim();
    user.billingStateID = this.stateID.value.trim();
    user.billingZipCode = this.zipCode.value;
    user.email = this.email.value.trim().toLowerCase();
    user.phone = String(this.phone.value).trim()
      .replace(/[^\w\.-\s\(\)]/g,'');
    user.phone2 = String(this.phone2.value).trim()
      .replace(/[^\w\.-\s\(\)]/g,'');
    user.password = this.password.value;
    user.confirmpassword = this.cpassword.value;

    user.initials = this.initials.value.trim().toUpperCase();
    user.autoRenewContracts = this.autoRenewContracts.value;
    user.subscribeToMobileNotifications = this.activateNotifications.value;
    // customer role
    user.roleID = "588f51ee44f212f20144f218b9270008";
    user.isActive = true;
    // default answers
    user.questionAnswers = [{ id: 1 }, { id: 4 }, { id: 7 }] as QuestionAnswer[];
    user.signature = this.signature.value;

    return user;
  }

  public goBack(): void {
    if (this.stepIndex === 1) {
      this.navCtrl.pop();
    } else {
      this.previous();
    }
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
