import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import {
  AlertController,
  Content,
  IonicPage,
  MenuController,
  ModalController,
  NavController,
  NavParams,
  Slides,
} from 'ionic-angular';

import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../providers/helper/helper-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { Constants } from '../../shared/constants';
import { Contract } from '../../shared/models/contract/contract';
import { Product } from '../../shared/models/product/product';
import { QuestionAnswer } from '../../shared/models/question-answer/question-answer';
import { Supplier } from '../../shared/models/supplier/supplier';
import { UserDefaultProduct } from '../../shared/models/user-default-product/user-default-product';
import { productsValidator } from '../../shared/validators/products-validator';
import { AuctionInProgressPage } from '../auction/auction-in-progress/auction-in-progress';
import { RiskTolerancePage } from '../tabs/profile/risk-tolerance/risk-tolerance';
import { Page } from '../../shared/models/app-state/page';

@IonicPage()
@Component({
  selector: 'page-auction',
  templateUrl: 'auction.html',
})
export class AuctionPage extends AbstractPageForm {
  @ViewChild(Slides) slides: Slides;
  public stepIndex: number;
  public selectedDate: Date;

  public loading = true;

  public newAuctionForm: FormGroup;
  private userQuestionAnswers: QuestionAnswer[];

  public contract: Contract;
  public contractForm: FormGroup;
  public productsForm: FormGroup;
  public locationsForm: FormGroup;
  public contractTypeForm: FormGroup;
  public suppliers: Supplier[];

  public startProductsValidation = false;
  public startNewAuctionValidation = false;
  public newActionErrorMessage = '';
  public startAuctionEnabled = true;
  public startAuctionText = 'Start Auction';
  public timezoneHourOffset: number;

  public availableTimes: string[] = [];
  public availableTerms: number[] = [];
  public availableProducts: Product[] = [];
  public selectedProduct: Product;
  public selectedTerm: number;
  public selectedIndex: number;

  public isRenewal: boolean;

  public showAllTerms = false;

  @ViewChild("mycontent") content: Content;

  public scrollToTop() {
    this.content.scrollToTop();
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private altCtrl: AlertController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider) {
    super(appStateService);
    this.isRenewal = navParams.data.isRenewal;
    this.contract = navParams.data.contract;
    this.contractTypeForm = navParams.data.contractTypeForm;
    this.contractForm = navParams.data.contractForm;
    this.locationsForm = navParams.data.locationsForm;

    this.timezoneHourOffset = new Date().getTimezoneOffset() / 60;

    this.buildAvailableTimes();
    this.buildAvailableTerms();

    this.productsForm = new FormGroup({
      products: new FormArray([])
    }, { validators: productsValidator });

    const defaultAuctionEndDate = new Date();
    defaultAuctionEndDate.setDate(defaultAuctionEndDate.getDate() + 4);

    this.newAuctionForm = new FormGroup({
      requestHistoricalUsage: new FormControl(true, [Validators.requiredTrue]),
      startAllInclusiveAuction: new FormControl(false, [Validators.required]),
      availabilityDate: new FormControl(defaultAuctionEndDate.toLocaleDateString(), [Validators.required]),
      availabilityTime: new FormControl('', [Validators.required])
    });
  }

  ionViewDidEnter() {
    this.clearProducts();
    const serviceTypeID = !this.contractForm
      ? this.contract.serviceTypeID
      : this.contractForm.get('serviceType').value.serviceTypeID;

    const stateID = !this.contractForm
      ? this.contract.stateID
      : this.contractForm.get('billingStateID').value;

    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.getAuctionData(authFields.userID, serviceTypeID, stateID)
          .then(result => {
            this.userQuestionAnswers = result.data.user.questionAnswers.map(u => new QuestionAnswer(u));

            if (!this.userQuestionAnswers.length) {
              this.navCtrl.push(RiskTolerancePage, { saveImmediately: true });
            } else {
              this.stepIndex = 1;

              result.data.user.defaultProducts.forEach(p =>
                this.products.push(new FormControl(new UserDefaultProduct(p), [Validators.required]))
              );

              this.suppliers =  result.data.availableSuppliers.data.map(s => new Supplier(s));
              this.availableProducts =  result.data.products.data.map(p => new Product({ name: p.name, id: p.id } as Product));

              this.loading = false;
            }
          });
      });
  }

  private clearProducts(): void {
    for (var i = 0; i < this.products.controls.length; i++) {
      this.products.removeAt(i);
    }
  }

  private buildAvailableTimes(): void {
    var testDate = new Date();
    for (var i = 0; i < 5; i++) {
      testDate.setHours(11 + (5 - this.timezoneHourOffset) + i);
      this.availableTimes.push(HelperServiceProvider.getFriendlyTimeString(testDate));
    }
  }

  private buildAvailableTerms(): void {
    for (var i = 1; i < 61; i++) {
      this.availableTerms.push(i);
    }
  }

  public toggleAllTerms(): void {
    this.showAllTerms = true;
  }

  get products(): FormArray { return <FormArray>this.productsForm.get('products'); }
  get requestHistoricalUsage() { return this.newAuctionForm.get('requestHistoricalUsage'); }
  get startAllInclusiveAuction() { return this.newAuctionForm.get('startAllInclusiveAuction'); }
  get availabilityDate() { return this.newAuctionForm.get('availabilityDate'); }
  get availabilityTime() { return this.newAuctionForm.get('availabilityTime'); }

  public next() {
    if (this.stepIndex === 1) {
      this.startProductsValidation = true;
      this.resetTouched(this.productsForm);
      this.setTouched(this.productsForm);
      if (this.productsForm.valid) {
        this.stepIndex++;
        this.scrollToTop();
      }
    } else {
      this.scrollToTop();
    }
  }

  public previous() {
    if (this.stepIndex == 1) {
      this.navCtrl.push(RiskTolerancePage, { saveImmediately: true });
      this.stepIndex = 1;
    } else {
      this.stepIndex--;
      this.scrollToTop();
    }
  }

  public removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  public addProduct(): void {
    this.startProductsValidation = false;
    this.products.push(new FormControl(new Product(), [Validators.required]));
  }

  public startAuction() {
    this.startNewAuctionValidation = true;
    this.setTouched(this.newAuctionForm);
    if (this.newAuctionForm.valid) {
      this.startAuctionEnabled = false;
      this.startAuctionText = 'Processing...';
      if (this.isRenewal) {
        this.createRFQSession(this.contract);
      } else {
        const contract = this.buildContractRequest();
        this.graphQLService.createContract(contract)
          .then(createContractResponse => {
            this.createRFQSession(createContractResponse.data.createContract);
          })
          .catch((res: HttpErrorResponse) => {
            if (res && res.status) {
              this.newActionErrorMessage = res.statusText;
            } else {
              this.newActionErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
            }
            this.startAuctionEnabled = true;
            this.startAuctionText = 'Start Auction';
          });
      }
    }
  }

  public createRFQSession(contract: Contract): void {
    const rfqRequest = this.buildRFQRequest(contract.contractID);
    this.graphQLService.createRfqSession(rfqRequest)
      .then(() => {
        this.graphQLService.reset(Page.Entity);
        this.graphQLService.reset(Page.Home);
        this.navCtrl.push(AuctionInProgressPage, { contractID: contract.contractID, allowBack: false });
        this.startAuctionEnabled = true;
        this.startAuctionText = 'Start Auction';
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.newActionErrorMessage = res.statusText;
        } else {
          this.newActionErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.startAuctionEnabled = true;
        this.startAuctionText = 'Start Auction';
      });
  }



  public closeMenu() {
    this.menuCtrl.close();
  }

  public openProductMenu(index: number) {
    this.selectedIndex = index;
    const product = this.products.controls[index];
    this.selectedProduct = product.value.product;

    this.menuCtrl.enable(true, 'products');
    this.menuCtrl.toggle('products');
  }

  public selectProduct(product: Product) {
    this.selectedProduct = product;
    const productControl = this.products.controls[this.selectedIndex];
    productControl.value.product = product;
    this.closeMenu();
  }

  public openTermMenu(index: number) {
    this.selectedIndex = index;
    const product = this.products.controls[index];
    this.selectedTerm = product.value.term;

    this.menuCtrl.enable(true, 'terms');
    this.menuCtrl.toggle('terms');
  }

  public selectTerm(term: number) {
    this.selectedTerm = term;
    const product = this.products.controls[this.selectedIndex];
    product.value.term = term;
    this.closeMenu();
  }

  private buildRFQRequest(contractId: string): any {
    return {
      startDate: new Date().toLocaleDateString(),
      startTime: '1:00 AM',
      endDate: this.availabilityDate.value,
      endTime: this.availabilityTime.value,
      maxBids: 3,
      mils: 0,
      generateSilentLOA: this.requestHistoricalUsage.value,
      generateSilentLOE: this.startAllInclusiveAuction.value,
      contract: { id: contractId },
      suppliers: this.suppliers.map(s => ({ supplierID: s.supplierID })),
      products: this.products.controls.map(c => c.value).map(p => ({ productID: p.product.id, term: p.term }))
    };
  }

  private buildContractRequest(): any {
    const locations = (<FormArray>this.locationsForm.get('locations')).controls.map(c => ({
      address1: c.get('address1').value,
      address2: c.get('address2').value ? c.get('address2').value : undefined,
      city: c.get('city').value,
      zipCode: String(c.get('zipCode').value),
      utility: {
        id: c.get('utility').value.utilityID,
      },
      utilityAccountNum: c.get('utilityAccountNum').value,
      utilityMeterNum: c.get('utilityMeterNum').value ? c.get('utilityMeterNum').value : undefined,
      utilityNameKey: c.get('utilityNameKey').value ? c.get('utilityNameKey').value : undefined,
      utilityReferenceNum: c.get('utilityReferenceNum').value ? c.get('utilityReferenceNum').value : undefined,
      rateClass: c.get('rateClass').value ? c.get('rateClass').value.name : '',
      zone: c.get('zone').value ? c.get('zone').value.name : undefined,
      annualUsage: HelperServiceProvider.unmaskAnnualUsage(c.get('annualUsage').value)
    }));

    var customer = {
      DBAName: this.contractForm.get('DBAName').value
        ? this.contractForm.get('DBAName').value
        : this.contractForm.get('firstName').value.trim() + ' ' + this.contractForm.get('lastName').value.trim(),
      contactFname: this.contractForm.get('firstName').value.trim(),
      contactLname: this.contractForm.get('lastName').value.trim(),
      contactTitle: this.contractForm.get('title').value ? this.contractForm.get('title').value : undefined,
      address1: locations[0].address1,
      address2: locations[0].address2
        ? locations[0].address2
        : undefined,
      city: locations[0].city,
      zipCode: locations[0].zipCode,
      billingAddress1: this.contractForm.get('billingAddress1').value.trim(),
      billingAddress2: this.contractForm.get('billingAddress2').value
        ? this.contractForm.get('billingAddress2').value.trim() : undefined,
      billingZipCode: String(this.contractForm.get('billingZipCode').value),
      billingCity: this.contractForm.get('billingCity').value.trim(),
      billingStateID: this.contractForm.get('billingStateID').value.trim(),
      phone: this.contractForm.get('phone').value.trim(),
      phone2: this.contractForm.get('phone2').value ? this.contractForm.get('phone2').value : undefined,
      mobile: this.contractForm.get('phone').value.trim() ? this.contractForm.get('phone').value.trim() : undefined,
      email: this.contractForm.get('email').value.trim(),
      entityID: this.contractForm.get('selectedEntity').value && this.contractForm.get('selectedEntity').value.id
        ? Number(this.contractForm.get('selectedEntity').value.id) : undefined
    } as any;

    var contract = {
      status: Constants.quoteStatuses.RFQ,
      customer: customer,
      locations: locations,
      serviceType: {
        name: this.contractForm.get('serviceType').value.name
      },
      supplier: { },
      product: { }
    } as Contract;

    if (this.contractTypeForm.get('expirationDate').value) {
      contract.expirationDate = this.contractTypeForm.get('expirationDate').value
    } else {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      contract.effectiveDate = nextMonth.toLocaleDateString();
    }

    return contract;
  }

  public onChangeCalendar() {
    this.altCtrl.create({
      title: 'Confirmation',
      message: 'You only have until 4 pm on the day your auction closes to accept in order to keep the bid offered. ' +
      'If a bid is not accepted by 4 pm on day of closing, a new auction will have to be started. ',
      buttons: [{
          text: 'I got it',
          handler: () => { }
      }]
    }).present();
  }

  public openCalendar(): void {
    const options: CalendarModalOptions = {
      from: new Date(new Date().setDate(new Date().getDate() + 2)),
      defaultDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      title: 'Choose Date'
    };

    const calendarModal = this.modalCtrl.create(CalendarModal, { options });

    calendarModal.present();
    calendarModal.onDidDismiss((date, type) => {
      if (type === 'done' && date) {
        this.onChangeCalendar();
        this.availabilityDate.setValue(this.timeConverter(date.time));
      }
    });
  }

  private timeConverter(timeStamp: number): string {
    return HelperServiceProvider.unixTimeStampToString(timeStamp);
  }

  public goBack(): void {
    if (this.stepIndex === 1) {
      this.navCtrl.pop();
    } else {
      this.previous();
    }
  }
}
