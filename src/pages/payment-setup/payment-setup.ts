import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { environment } from '../../environments/environment';
import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { State } from '../../shared/models/state/state';

declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-payment-setup',
  templateUrl: 'payment-setup.html',
})
export class PaymentSetupPage extends AbstractPageForm {
  public billingForm: FormGroup;
  public states: State[];
  
  public startValidation = false;

  private stripe = Stripe(environment.stripeKey);
  public iosCreditCard: any;
  public androidCreditCard: any;

  public errorMessage: string;

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public appStateService: AppStateServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.billingForm = new FormGroup({
      stripeToken: new FormControl('', [Validators.required]),
      billingAddress1: new FormControl('', [Validators.required]),
      billingAddress2: new FormControl(''),
      billingCity: new FormControl('', [Validators.required]),
      billingStateID: new FormControl('', [Validators.required]),
      billingZipCode: new FormControl('', [Validators.required]),
      account: new FormControl('', [Validators.required]),
      routing: new FormControl('', [Validators.required])
    });
  }

  get account() { return this.billingForm.get('account'); }
  get routing() { return this.billingForm.get('routing'); }
  get billingAddress1() { return this.billingForm.get('billingAddress1'); }
  get billingAddress2() { return this.billingForm.get('billingAddress2'); }
  get billingCity() { return this.billingForm.get('billingCity'); }
  get billingStateID() { return this.billingForm.get('billingStateID'); }
  get billingZipCode() { return this.billingForm.get('billingZipCode'); }
  get stripeToken() { return this.billingForm.get('stripeToken'); }

  ionViewDidLoad() {
    const elements = this.stripe.elements();
    if (this.isIos()) {
      this.iosCreditCard = elements.create('card');
      this.iosCreditCard.mount('#card-element-ios');
      this.iosCreditCard.addEventListener('change', event => {
        if (event.error) {
          this.errorMessage = event.error.message;
        } else {
          this.errorMessage = '';
        }
      });
    } else {
      this.androidCreditCard = elements.create('card');
      this.androidCreditCard.mount('#card-element-android');
      this.androidCreditCard.addEventListener('change', event => {
        if (event.error) {
          this.errorMessage = event.error.message;
        } else {
          this.errorMessage = '';
        }
      });
    }
  }

  public submit(): void {
    this.stripe.createToken(this.isIos() ? this.iosCreditCard : this.androidCreditCard).then(res => {        
      if (res.error) {
        this.errorMessage = res.error.message;
      } else if (res.token) {
        this.stripeToken.setValue(res.token.id);

        const customerDto = this.getCustomerDTO()

        // this.customerService.update(this.customer.customerID, customerDto)
        //   .then(customerResponse => {
        //     if (!customerResponse.error) {
        //       this.navCtrl.setRoot(TabsPage);
        //     } else {
        //       this.errorMessage = <any>customerResponse.data;
        //     }
        //   });
      }
    });
  }

  private getCustomerDTO(): any {
    const customer: any = { };
    customer.billingAddress1 = this.billingForm.get('billingAddress1').value.trim();
    customer.billingAddress2 = this.billingForm.get('billingAddress2').value.trim();
    customer.billingCity = this.billingForm.get('billingCity').value.trim();
    customer.billingStateID = this.billingForm.get('billingStateID').value.trim();
    customer.billingZipCode = String(this.billingForm.get('billingZipCode').value);

    return customer;
  }
}
