import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { environment } from '../../../../environments/environment';
import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { State } from '../../../../shared/models/state/state';
import { StripeCard } from '../../../../shared/models/stripe/stripe-card';
import { User } from '../../../../shared/models/user/user';
import { ZipCode } from '../../../../shared/models/zip-code/zip-code';
import { Page } from '../../../../shared/models/app-state/page';

declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-billing-info',
  templateUrl: 'billing-info.html',
})
export class BillingInfoPage extends AbstractPageForm {
  public user: User;
  public loading = true;

  private stripe = Stripe(environment.stripeKey);
  public creditCard: any;
  public existingCard: StripeCard;

  public billingInfoErrorMessage: string;
  public billingInfoForm: FormGroup;
  public startBillingInfoValidation = false;

  public saveButtonEnabled = true;
  public saveButtonText = 'Save';

  public loadingBillingZipCode = false;
  public billingZipCodeErrorMessage = '';
  public billingCitiesInZipCode: string[];

  public states: State[];

  constructor(public navCtrl: NavController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.user = navParams.data.user;

    this.billingInfoForm = new FormGroup({
      billingAddress1: new FormControl(this.user.billingAddress1 ? this.user.billingAddress1 : '', [Validators.required]),
      billingAddress2: new FormControl(this.user.billingAddress2 ? this.user.billingAddress2 : ''),
      billingCity: new FormControl(this.user.billingCity ? this.user.billingCity : '', [Validators.required]),
      billingStateID: new FormControl('', [Validators.required]),
      billingStateShort: new FormControl({ value: '', disabled: true }, [Validators.required]),
      billingStateLong: new FormControl({ value: '', disabled: true }, [Validators.required]),
      billingZipCode: new FormControl(this.user.billingZipCode ? this.user.billingZipCode : '', [Validators.required]),
      billingZipCodeValid: new FormControl(this.user.billingZipCode ? true : false, [Validators.requiredTrue])
    });

    this.getBillingZipCode(true)

    Promise.all([
      this.graphQLService.getStripeCustomerData(this.user.stripeCustomerID),
      this.graphQLService.getBillingInfoData()
    ]).then(result => {
      const stripeCustomerResult = result[0];
      const billingInfoDataResult = result[1];

      if (stripeCustomerResult.data.customerCards.data.length) {
        this.existingCard = new StripeCard(stripeCustomerResult.data.customerCards.data[0]);
      }

      this.states = billingInfoDataResult.data.states.data.map(s => new State(s));

      this.loading = false
    });
  }

  get billingAddress1() { return this.billingInfoForm.get('billingAddress1'); }
  get billingAddress2() { return this.billingInfoForm.get('billingAddress2'); }
  get billingCity() { return this.billingInfoForm.get('billingCity'); }
  get billingStateID() { return this.billingInfoForm.get('billingStateID'); }
  get billingStateShort() { return this.billingInfoForm.get('billingStateShort'); }
  get billingStateLong() { return this.billingInfoForm.get('billingStateLong'); }
  get billingZipCode() { return this.billingInfoForm.get('billingZipCode'); }
  get billingZipCodeValid() { return this.billingInfoForm.get('billingZipCodeValid'); }

  ionViewDidLoad() {
    this.billingInfoErrorMessage = '';
    const elements = this.stripe.elements();
    this.creditCard = elements.create('card');
    this.creditCard.mount('#card-element');
    this.creditCard.addEventListener('change', event => {
      if (event.error) {
        this.billingInfoErrorMessage = event.error.message;
      } else {
        this.billingInfoErrorMessage = '';
      }
    });
  }

  public resetBillingLoadedValues(): void {
    this.billingCitiesInZipCode = null;
    this.billingStateID.setValue(null);
    this.billingStateShort.setValue(null);
    this.billingStateLong.setValue(null);
    this.billingCity.setValue(null);
  }

  public getBillingZipCode(isOnLoad = false): void {
    if (this.billingZipCode.value.length === 5) {
      this.billingZipCode.disable();
      this.loadingBillingZipCode = true;
      this.billingZipCodeErrorMessage = '';
      if (!isOnLoad) {
        this.resetBillingLoadedValues();
      }
      this.graphQLService.getZipCode(this.billingZipCode.value)
        .then(zipCodeResult => {
          const zipCode = new ZipCode(zipCodeResult.data.zipCode);
          this.billingCitiesInZipCode = zipCode.city;
          this.billingStateID.setValue(zipCode.stateID);
          this.billingStateShort.setValue(zipCode.stateShort);
          this.billingStateLong.setValue(zipCode.stateLong);

          if (this.billingCitiesInZipCode.length === 1) {
            if (!isOnLoad) {
              this.billingCity.setValue(this.billingCitiesInZipCode[0]);
            }
          } else {
            this.billingZipCodeErrorMessage = 'Invalid billing zipcode, unable to find any cities, please contact PK support.'
          }

          this.loadingBillingZipCode = false;
          this.billingZipCode.enable();
          this.billingZipCodeValid.setValue(true);
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.billingZipCodeErrorMessage = res.statusText;
          } else {
            this.billingZipCodeErrorMessage = 'Invalid billing zipcode, if you believe this to be an error, please contact PK support.'
          }
          this.loadingBillingZipCode = false;
          this.billingZipCode.enable();
          this.billingZipCodeValid.setValue(false);
        });
    }
  }

  public save() {
    this.startBillingInfoValidation = true;
    this.billingInfoErrorMessage = '';
    this.setTouched(this.billingInfoForm);
    this.saveButtonText = 'Saving...';
    this.saveButtonEnabled = false;

    if (this.billingInfoForm.valid) {
      if (this.creditCard && this.creditCard._complete) {
        this.stripe.createToken(this.creditCard).then(res => {
          if (res.error) {
            this.billingInfoErrorMessage = res.error.message;
            this.saveButtonText = 'Save';
            this.saveButtonEnabled = true;
          } else if (res.token) {
            this.graphQLService.addCustomerCard(this.user.stripeCustomerID, res.token.id)
              .then(() => {
                this.saveUser();
              })
              .catch((res: HttpErrorResponse) => {
                if (res && res.status) {
                  this.billingInfoErrorMessage = res.statusText;
                } else {
                  this.billingInfoErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
                }
                this.saveButtonText = 'Finish';
                this.saveButtonEnabled = true;
              });
          }
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.billingInfoErrorMessage = res.statusText;
          } else {
            this.billingInfoErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.saveButtonText = 'Finish';
          this.saveButtonEnabled = true;
        });
      } else {
        this.saveUser();
      }
    } else {
      this.saveButtonText = 'Save';
      this.saveButtonEnabled = true;
    }
  }

  private saveUser(): void {
    const userDto = {
      billingAddress1: this.billingAddress1.value.trim(),
      billingAddress2: this.billingAddress2.value ? this.billingAddress2.value.trim() : undefined,
      billingCity: this.billingCity.value.trim(),
      billingStateID: this.billingStateID.value.trim(),
      billingZipCode: this.billingZipCode.value
    } as User;

    if (this.billingInfoForm.valid) {
      this.saveButtonEnabled = false;
      this.saveButtonText = 'Saving...';
      this.graphQLService.updateUser(this.user.userID, userDto)
        .then(() => {
          this.graphQLService.reset(Page.ProfilePage);
          this.navCtrl.pop();
          this.saveButtonText = 'Save';
          this.saveButtonEnabled = true;
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.billingInfoErrorMessage = res.statusText;
          } else {
            this.billingInfoErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.saveButtonText = 'Save';
          this.saveButtonEnabled = true;
        });
    }
  }
}
