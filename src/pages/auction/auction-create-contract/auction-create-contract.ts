import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Storage } from '@ionic/storage';
import { ApolloError } from 'apollo-client';
import { AlertController, Content, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../providers/helper/helper-service';
import { AbstractPageForm } from '../../../shared/abstract-page-form';
import { Constants } from '../../../shared/constants';
import { Page } from '../../../shared/models/app-state/page';
import { Contract } from '../../../shared/models/contract/contract';
import { Customer } from '../../../shared/models/customer/customer';
import { Document } from '../../../shared/models/document/document';
import { RfqSessionBid } from '../../../shared/models/rfq-session-bid/rfq-session-bid';
import { RfqSession } from '../../../shared/models/rfq-session/rfq-session';
import { State } from '../../../shared/models/state/state';
import { StripeCard } from '../../../shared/models/stripe/stripe-card';
import { User } from '../../../shared/models/user/user';
import { ZipCode } from '../../../shared/models/zip-code/zip-code';
import { TermsAndConditionsPage } from '../../registration/terms-and-conditions/terms-and-conditions';
import { BillingInfoPage } from '../../tabs/profile/billing-info/billing-info';
import { TabsPage } from '../../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-auction-create-contract',
  templateUrl: 'auction-create-contract.html',
})
export class AuctionCreateContractPage extends AbstractPageForm {

  public contractID: string;
  public contract: Contract;
  public bid: RfqSessionBid;
  public rfqSession: RfqSession;
  public newContractForm: FormGroup;
  public step1NewContractForm: FormGroup;

  public user: User;
  public card: StripeCard;

  public states: State[];
  public citiesInZipCode: string[];
  public billingCitiesInZipCode: string[];
  public zipCodeLoading = false;
  public billingZipCodeLoading = false;
  public newContractErrorMessage = '';
  public startNewContractValidation = false;
  public startStep1NewContractValidation = false;

  public loading = true;
  public loadingUtility = true;
  public loadingSupplier = true;

  public createContractText = 'Approve via e-Sign';
  public createContractEnabled = true;
  public allowBack = true;

  public document: Document;
  public stepIndex = 1;
  public Constants = Constants;
  public pdfLink: string;
  public paymentTerms: number;

  public brandClassMapping = {
    'visa': faCcVisa,
    'mastercard': faCcMastercard,
    'amex': faCcAmex,
    'discover': faCcDiscover,
    'diners': faCcDinersClub,
    'jcb': faCcJcb,
    'unknown': faCreditCard,
  }

  @ViewChild(Content) content: Content;
  
  constructor(public navCtrl: NavController,
    private altCtrl: AlertController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    private storage: Storage,
    public navParams: NavParams) { 
    super(appStateService);

    this.contractID = navParams.data.contractID;
    this.paymentTerms = navParams.data.paymentTerms;

    this.step1NewContractForm = new FormGroup({
      isTosAccepted: new FormControl(false, [Validators.requiredTrue])
    });

    this.graphQLService.getAuctionCreateContractData(this.contractID)
      .then(result => {
        this.contract = new Contract(result.data.contract);

        this.graphQLService.getContractDocuments(this.contract.serviceTypeID, this.contract.supplierID,
          this.contract.stateID, this.contract.getUtilityID(), this.contract.annualUsage, Constants.quoteStatuses.quote)
          .then(documentResult => {
              const documents = documentResult.data.documents.data.map(d => new Document(d));
              this.document = documents && documents.length ? documents[0] : null;

              if (!this.document) {
                this.graphQLService.reset(Page.Entity);
                this.graphQLService.reset(Page.Home);
                const alert = this.altCtrl.create({
                  title: 'Create Contract',
                  message: 'The final contract has not been submitted by the supplier yet.  Please come back later or contact OctiPower support.', buttons: [
                    {
                      text: 'Got It',
                      handler: () => { }
                    }
                  ]
                });
                alert.onDidDismiss(() => this.navCtrl.pop());
                alert.present();
              } else {
                this.pdfLink = this.document.attachmentBase64.replace('data:application/pdf;base64,', '');
                this.buildContractForm();
              }
          });
      });

    this.bid = navParams.data.bid;
    this.allowBack = navParams.data.allowBack !== undefined ? navParams.data.allowBack : true;

    if (!this.allowBack) {
      this.navCtrl.remove(1, this.navCtrl.length() - 1);
    }
  }

  ionViewDidEnter() {
    this.storage.get(Constants.storageKeys.isTosAccepted)
      .then(res => {
        if (res) {
          this.isTosAccepted.setValue(<boolean>res);
          this.storage.remove(Constants.storageKeys.isTosAccepted);
        }
      });

    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.getAuctionCreateContractUserData(authFields.userID)
          .then(result => {
            this.user = new User(result.data.user);
            this.graphQLService.getStripeCustomerData(this.user.stripeCustomerID)
              .then(customerResponse => {
                if (customerResponse.data.customerCards.data && customerResponse.data.customerCards.data.length) {
                  this.card = new StripeCard(customerResponse.data.customerCards.data[0]);
                }
              });
          });
      });
  }

  private buildContractForm(): void {
    this.newContractForm = new FormGroup({
      firstName: new FormControl(this.contract.customer.contactFname, [Validators.required]),
      lastName: new FormControl(this.contract.customer.contactLname, [Validators.required]),
      email: new FormControl(this.contract.customer.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(Constants.validators.email)
      ]),
      phone: new FormControl(this.contract.customer.phone, [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ]),
      phone2: new FormControl(this.contract.customer.phone2 ? this.contract.customer.phone2 : '', [
        Validators.pattern(Constants.validators.phone)
      ]),
      address1: new FormControl(this.contract.customer.address1, [Validators.required]),
      address2: new FormControl(this.contract.customer.address2 ? this.contract.customer.address2 : ''),
      city: new FormControl(this.contract.customer.city, [Validators.required]),
      stateID: new FormControl(this.contract.customer.stateID, [Validators.required]),
      stateShort: new FormControl({ value: this.contract.customer.state.stateShort, disabled: true }, [Validators.required]),
      stateLong: new FormControl({ value: this.contract.customer.state.stateLong, disabled: true }, [Validators.required]),
      zipCode: new FormControl(this.contract.customer.zipCode, [Validators.required]),
      billingAddress1: new FormControl(this.contract.customer.billingAddress1, [Validators.required]),
      billingAddress2: new FormControl(this.contract.customer.billingAddress2),
      billingCity: new FormControl(this.contract.customer.billingCity, [Validators.required]),
      billingStateID: new FormControl(this.contract.customer.billingStateID, [Validators.required]),
      billingStateShort: new FormControl({ value: this.contract.customer.billingState.stateShort, disabled: true }, [Validators.required]),
      billingStateLong: new FormControl({ value: this.contract.customer.billingState.stateLong, disabled: true }, [Validators.required]),
      billingZipCode: new FormControl(this.contract.customer.billingZipCode, [Validators.required])
    });

    this.loading = false;
  }

  get firstName() { return this.newContractForm.get('firstName'); }
  get lastName() { return this.newContractForm.get('lastName'); }
  get email() { return this.newContractForm.get('email'); }
  get address1() { return this.newContractForm.get('address1'); }
  get address2() { return this.newContractForm.get('address2'); }
  get zipCode() { return this.newContractForm.get('zipCode'); }
  get stateID() { return this.newContractForm.get('stateID'); }
  get stateShort() { return this.newContractForm.get('stateShort'); }
  get stateLong() { return this.newContractForm.get('stateLong'); }
  get city() { return this.newContractForm.get('city'); }
  get billingAddress1() { return this.newContractForm.get('billingAddress1'); }
  get billingAddress2() { return this.newContractForm.get('billingAddress2'); }
  get billingZipCode() { return this.newContractForm.get('billingZipCode'); }
  get billingStateID() { return this.newContractForm.get('billingStateID'); }
  get billingStateShort() { return this.newContractForm.get('billingStateShort'); }
  get billingStateLong() { return this.newContractForm.get('billingStateLong'); }
  get billingCity() { return this.newContractForm.get('billingCity'); }
  get phone() { return this.newContractForm.get('phone'); }
  get phone2() { return this.newContractForm.get('phone2'); }

  get isTosAccepted() { return this.step1NewContractForm.get('isTosAccepted'); }

  public scrollToTop() {
    this.content.scrollToTop();
  }

  public next(): void {
    if (this.stepIndex === 1) {
      this.startStep1NewContractValidation = true;
      this.setTouched(this.step1NewContractForm);
      if (this.step1NewContractForm.valid) {
        this.stepIndex++;
        this.scrollToTop();
      }
    } else if (this.stepIndex === 2) {
      this.startNewContractValidation = true;
      this.setTouched(this.newContractForm);
      if (this.newContractForm.valid) {
        this.stepIndex++;
        this.scrollToTop();
      }
    }
  }

  public previous(): void {
    if (--this.stepIndex < 1) {
      this.stepIndex = 1;
    }

    this.scrollToTop();
  }

  private resetLoadedValues(): void {
    this.citiesInZipCode = null;
    this.stateID.setValue(null);
    this.stateShort.setValue(null);
    this.stateLong.setValue(null);
  }

  private resetBillingLoadedValues(): void {
    this.billingCitiesInZipCode = null;
    this.billingStateID.setValue(null);
    this.billingStateShort.setValue(null);
    this.billingStateLong.setValue(null);
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
            this.stateLong.setValue(zipCode.stateLong);
          } else {
            this.newContractErrorMessage = 'Invalid zipcode, if you believe this to be an error, please contact PK support';
          }
          this.zipCodeLoading = false;
          this.zipCode.enable();
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.newContractErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.newContractErrorMessage = 'There was a problem processing the zip code.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.zipCodeLoading = false;
          this.zipCode.enable();
        });  
    }
  }

  public getBillingZipCode(): void {
    if (this.billingZipCode.value.length === 5) {
      this.billingZipCode.disable();
      this.resetBillingLoadedValues();
      this.billingZipCodeLoading = true;
      this.graphQLService.getZipCode(this.billingZipCode.value)
        .then(zipCodeResponse => {
          if (zipCodeResponse && !zipCodeResponse.errors) {
            const zipCode = new ZipCode(zipCodeResponse.data.zipCode);
            this.billingCitiesInZipCode = zipCode.city;
            this.billingStateID.setValue(zipCode.stateID);
            this.billingStateShort.setValue(zipCode.stateShort);
            this.billingStateLong.setValue(zipCode.stateLong);
          } else {
            this.newContractErrorMessage = 'Invalid zipcode, if you believe this to be an error, please contact PK support';
          }
          this.billingZipCodeLoading = false;
          this.billingZipCode.enable();
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.newContractErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
          } else {
            this.newContractErrorMessage = 'There was a problem processing the zip code.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.billingZipCodeLoading = false;
          this.billingZipCode.enable();
        });  
    }
  }

  public getEstAnnualSpendMainPart(): string {
    return this.contract ? HelperServiceProvider.getMainPart(this.contract.getEstimatedAnnualSpend()) : '';
  }

  public getEstAnnualSpendDecimalPart(): string {
    return this.contract ? HelperServiceProvider.getDecimalPart(this.contract.getEstimatedAnnualSpend()) : '';
  }

  public goBillingInfo(): void {
    this.navCtrl.push(BillingInfoPage, { user: this.user });
  }

  public createContract(): void {
    this.startNewContractValidation = true;    
    this.setTouched(this.newContractForm);
    if (this.newContractForm.valid && this.card) {
      this.createContractText = 'Processing...';
      this.createContractEnabled = false;
      const customerDTO = {
        contactFname: this.firstName.value,
        contactLname: this.lastName.value,
        email: this.email.value,
        address1: this.address1.value,
        address2: this.address2.value,
        zipCode: this.zipCode.value,
        stateID: this.stateID.value,
        state: this.stateLong.value,
        city: this.city.value,
        phone: this.phone.value,
        phone2: this.phone2.value,
        billingAddress1: this.billingAddress1.value,
        billingAddress2: this.billingAddress2.value,
        billingZipCode: this.billingZipCode.value,
        billingStateID: this.billingStateID.value,
        billingCity: this.billingCity.value,
      } as Customer;
      Promise.all([
        this.graphQLService.updateCustomer(this.contract.customerID, customerDTO),
        this.graphQLService.updateContract(this.contract.contractID, { status: Constants.quoteStatuses.signed } as Contract)
      ]).then(results => {
        if (results) {
          const customerResponse = results[0];
          const contractResponse = results[1];

          if (customerResponse && contractResponse) {
            if (this.paymentTerms === 0) {
              // only run the payment once other steps have completed successfully first, its okay to run updateCustomer and updateContract again if necessary
              const oneHundred = 100 * Constants.payments.cents;
              this.graphQLService.chargeCustomer(this.user.stripeCustomerID, oneHundred, `Mobile Processing: One Time Fee - ${this.user.email}`, this.card.id)
                .then(paymentResponse => {
                  if (paymentResponse.data.chargeCustomer.failure_code) {
                    this.newContractErrorMessage = `${paymentResponse.data.chargeCustomer.failure_code} : ${paymentResponse.data.chargeCustomer.failure_message}`;
                  } else {
                    this.showConfirmationAlert();
                  }
                });
            } else {
              this.showConfirmationAlert();
            }
          } else {
            this.newContractErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.createContractEnabled = true;
          this.createContractText = 'Approve via e-Sign';
        } else {
          this.newContractErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
      }).catch((res: ApolloError) => {
        if (res && res.graphQLErrors && res.graphQLErrors.length) {
          this.newContractErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
        } else {
          this.newContractErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.createContractEnabled = true;
        this.createContractText = 'Approve via e-Sign';
      }); 
    }
  }

  public showConfirmationAlert(): void {
    const alert = this.altCtrl.create({
      title: 'Approvement',
      message: 'A separate email has been sent to ' + this.contract.customer.email + '. You have until 4pm CST to complete the e-signature document.', buttons: [
        {
          text: 'OK',
          handler: () => { }
        }
      ]
    });
    alert.onDidDismiss(() => this.navCtrl.setRoot(TabsPage));
    alert.present();
  }

  public getCardIcon(card: StripeCard): any {
    let pfClass = faCreditCard;
    if (card && this.brandClassMapping[card.brand.toLowerCase()]) {
      pfClass = this.brandClassMapping[card.brand.toLowerCase()];
    }
    return pfClass;
  }

  public goTermsandConditions(): void {
    this.navCtrl.push(TermsAndConditionsPage, { pdf: this.document.attachmentBase64 });
  }

  public goBack(): void {
    if (this.stepIndex === 1) {
      this.navCtrl.pop();
    } else {
      this.previous();
    }
  }
}
